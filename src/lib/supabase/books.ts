import { MOCK_LIBROS } from "../mock-data";
import type { Libro, LibroFormData } from "../types";
import { getSupabaseClient, isSupabaseConfigured } from "./client";

export function getDemoMode(): boolean {
  return !isSupabaseConfigured();
}

export async function fetchLibros(): Promise<Libro[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [...MOCK_LIBROS];

  const { data, error } = await supabase
    .from("libros")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createLibro(form: LibroFormData): Promise<Libro> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ...form,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from("libros")
    .insert(form)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLibro(
  id: number,
  form: LibroFormData,
): Promise<Libro> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ...form, id, created_at: new Date().toISOString() };
  }

  const { data, error } = await supabase
    .from("libros")
    .update(form)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLibro(id: number): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { error } = await supabase.from("libros").delete().eq("id", id);
  if (error) throw error;
}

export async function decrementStock(id: number, currentStock: number): Promise<number> {
  const newStock = Math.max(0, currentStock - 1);
  const supabase = getSupabaseClient();

  if (!supabase) return newStock;

  const { error } = await supabase
    .from("libros")
    .update({ stock: newStock })
    .eq("id", id);

  if (error) throw error;
  return newStock;
}
