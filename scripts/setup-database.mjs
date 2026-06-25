import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv(filePath) {
  const env = {};

  if (!fs.existsSync(filePath)) {
    return env;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    env[key] = value;
  }

  return env;
}

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

async function main() {
  const envPath = path.join(process.cwd(), ".env.local");
  const env = loadEnv(envPath);

  const supabaseUrl = normalizeSupabaseUrl(
    env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "",
  );
  const serviceRoleKey =
    env.SUPABASE_SERVICE_ROLE_KEY ||
    env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = env.SUPABASE_DB_URL || env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error(
      "Agregá SUPABASE_DB_URL en .env.local (Settings → Database → Connection string).",
    );
  }

  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: dbUrl });
  await client.connect();

  const migrationsDir = path.join(process.cwd(), "supabase/migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Aplicando ${file}...`);
    await client.query(sql);
    console.log(`OK  ${file}`);
  }

  await client.end();

  if (!supabaseUrl || !serviceRoleKey) {
    console.log("\nMigraciones aplicadas.");
    return;
  }

  const adminEmails = (env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    console.log("\nMigraciones aplicadas.");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const initialPassword = env.ADMIN_INITIAL_PASSWORD;
  if (!initialPassword) {
    console.log(
      "\nMigraciones aplicadas. Para crear admins, definí ADMIN_EMAILS y ADMIN_INITIAL_PASSWORD.",
    );
    return;
  }

  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  for (const email of adminEmails) {
    const existing = existingUsers.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );

    if (existing) {
      await supabase.auth.admin.updateUserById(existing.id, {
        app_metadata: { role: "admin" },
        email_confirm: true,
      });
      console.log(`OK  ${email} (admin actualizado)`);
      continue;
    }

    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password: initialPassword,
      email_confirm: true,
      app_metadata: { role: "admin" },
    });

    if (createError) throw createError;
    console.log(`OK  ${email} (admin creado)`);
  }
}

main().catch((error) => {
  console.error("Error:", error.message || error);
  process.exit(1);
});
