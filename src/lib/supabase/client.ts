import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { CatalogOption, Libro } from "../types";

let supabaseClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
      key &&
      !url.includes("xxxx") &&
      !key.startsWith("eyJhbGci..."),
  );
}

export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado.");
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return supabaseClient;
}

export type Database = {
  public: {
    Tables: {
      libros: {
        Row: Libro;
        Insert: Omit<Libro, "id" | "created_at">;
        Update: Partial<Omit<Libro, "id" | "created_at">>;
      };
      generos: {
        Row: CatalogOption;
        Insert: Omit<CatalogOption, "id" | "created_at">;
        Update: Partial<Omit<CatalogOption, "id" | "created_at">>;
      };
      estados: {
        Row: CatalogOption;
        Insert: Omit<CatalogOption, "id" | "created_at">;
        Update: Partial<Omit<CatalogOption, "id" | "created_at">>;
      };
    };
  };
};
