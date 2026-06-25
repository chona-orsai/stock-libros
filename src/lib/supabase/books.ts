import type { Libro, LibroFormData } from "../types";
import { resolveAutorId } from "./authors";
import { getSupabaseClient } from "./client";

type LibroRow = Omit<Libro, "autor"> & {
  autores: { nombre: string } | { nombre: string }[] | null;
};

function mapLibroRow(row: LibroRow): Libro {
  const autorRel = row.autores;
  const autorNombre = Array.isArray(autorRel)
    ? autorRel[0]?.nombre
    : autorRel?.nombre;

  const { autores: _autores, ...rest } = row;

  return {
    ...rest,
    autor: autorNombre ?? "Desconocido",
  };
}

export async function fetchLibros(): Promise<Libro[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("libros")
    .select("*, autores(nombre)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapLibroRow(row as LibroRow));
}

async function toDbPayload(form: LibroFormData) {
  const autor_id = await resolveAutorId(form.autor_id, form.autor_nombre);

  return {
    titulo: form.titulo.trim(),
    autor_id,
    genero: form.genero,
    estado: form.estado,
    stock: form.stock,
    precio_compra: form.precio_compra,
    precio_venta: form.precio_venta,
  };
}

export async function createLibro(form: LibroFormData): Promise<Libro> {
  const supabase = getSupabaseClient();
  const payload = await toDbPayload(form);

  const { data, error } = await supabase
    .from("libros")
    .insert(payload)
    .select("*, autores(nombre)")
    .single();

  if (error) throw error;
  return mapLibroRow(data as LibroRow);
}

export async function updateLibro(
  id: number,
  form: LibroFormData,
): Promise<Libro> {
  const supabase = getSupabaseClient();
  const payload = await toDbPayload(form);

  const { data, error } = await supabase
    .from("libros")
    .update(payload)
    .eq("id", id)
    .select("*, autores(nombre)")
    .single();

  if (error) throw error;
  return mapLibroRow(data as LibroRow);
}

export async function deleteLibro(id: number): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("libros").delete().eq("id", id);
  if (error) throw error;
}

export async function decrementStock(
  id: number,
  currentStock: number,
): Promise<number> {
  const newStock = Math.max(0, currentStock - 1);
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("libros")
    .update({ stock: newStock })
    .eq("id", id);

  if (error) throw error;
  return newStock;
}
