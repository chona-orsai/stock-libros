import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./client";

export function isAdminUser(user: User | null | undefined): boolean {
  return user?.app_metadata?.role === "admin";
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ session: Session | null; error: string | null }> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { session: null, error: error.message };
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    return { session: null, error: "No tenés permisos de administrador." };
  }

  return { session: data.session, error: null };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();

  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (session && !isAdminUser(session.user)) {
    await supabase.auth.signOut();
    return null;
  }

  return session;
}
