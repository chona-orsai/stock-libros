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
  const adminEmails = (env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const initialPassword = env.ADMIN_INITIAL_PASSWORD;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local",
    );
  }

  if (adminEmails.length === 0) {
    throw new Error("Definí ADMIN_EMAILS en .env.local (emails separados por coma).");
  }

  if (!initialPassword) {
    throw new Error("Definí ADMIN_INITIAL_PASSWORD en .env.local.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  for (const email of adminEmails) {
    const existing = existingUsers.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );

    if (existing) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existing.id,
        {
          app_metadata: { role: "admin" },
          email_confirm: true,
        },
      );

      if (updateError) {
        throw updateError;
      }

      console.log(`OK  ${email} (ya existía, marcado como admin)`);
      continue;
    }

    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password: initialPassword,
      email_confirm: true,
      app_metadata: { role: "admin" },
    });

    if (createError) {
      throw createError;
    }

    console.log(`OK  ${email} (creado)`);
  }
}

main().catch((error) => {
  console.error("Error:", error.message || error);
  process.exit(1);
});
