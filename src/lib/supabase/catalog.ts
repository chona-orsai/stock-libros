import type { Autor, CatalogOption } from "../types";
import { getSupabaseClient } from "./client";
import { fetchAutores } from "./authors";

export async function fetchGeneros(): Promise<CatalogOption[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("generos")
    .select("*")
    .order("orden", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchEstados(): Promise<CatalogOption[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("estados")
    .select("*")
    .order("orden", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchCatalog(): Promise<{
  generos: CatalogOption[];
  estados: CatalogOption[];
  autores: Autor[];
}> {
  const [generos, estados, autores] = await Promise.all([
    fetchGeneros(),
    fetchEstados(),
    fetchAutores(),
  ]);

  return { generos, estados, autores };
}
