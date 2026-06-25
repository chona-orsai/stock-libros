import type { Autor } from "../types";
import { getSupabaseClient } from "./client";

export async function fetchAutores(): Promise<Autor[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("autores")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createAutor(nombre: string): Promise<Autor> {
  const supabase = getSupabaseClient();
  const trimmed = nombre.trim();

  const { data: existing, error: selectError } = await supabase
    .from("autores")
    .select("*")
    .eq("nombre", trimmed)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from("autores")
    .insert({ nombre: trimmed })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function resolveAutorId(
  autorId: number | null,
  autorNombre?: string,
): Promise<number> {
  if (autorId) return autorId;

  const nombre = autorNombre?.trim();
  if (!nombre) throw new Error("Debés seleccionar o ingresar un autor.");

  const autor = await createAutor(nombre);
  return autor.id;
}
