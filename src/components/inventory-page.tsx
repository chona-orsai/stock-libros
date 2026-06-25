"use client";

import { BookFilters } from "@/components/books/book-filters";
import { BookFormDialog } from "@/components/books/book-form-dialog";
import { BookTable } from "@/components/books/book-table";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { buildColorMap } from "@/lib/catalog-utils";
import { calcularStats, filtrarLibros } from "@/lib/stats";
import {
  createLibro,
  deleteLibro,
  decrementStock,
  fetchLibros,
  updateLibro,
} from "@/lib/supabase/books";
import { fetchCatalog } from "@/lib/supabase/catalog";
import type { Autor, CatalogOption, Libro, LibroFormData } from "@/lib/types";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface InventoryPageProps {
  userEmail?: string | null;
  onSignedOut?: () => void;
}

export function InventoryPage({ userEmail, onSignedOut }: InventoryPageProps) {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [generos, setGeneros] = useState<CatalogOption[]>([]);
  const [estados, setEstados] = useState<CatalogOption[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState("");
  const [estado, setEstado] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingLibro, setEditingLibro] = useState<Libro | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [catalog, librosData] = await Promise.all([
        fetchCatalog(),
        fetchLibros(),
      ]);

      setGeneros(catalog.generos);
      setEstados(catalog.estados);
      setAutores(catalog.autores);
      setLibros(librosData);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los datos desde Supabase.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const generoColors = useMemo(() => buildColorMap(generos), [generos]);
  const estadoColors = useMemo(() => buildColorMap(estados), [estados]);

  const librosFiltrados = useMemo(
    () => filtrarLibros(libros, busqueda, genero, estado),
    [libros, busqueda, genero, estado],
  );

  const stats = useMemo(() => calcularStats(libros), [libros]);

  const handleAdd = useCallback(() => {
    setEditingLibro(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((libro: Libro) => {
    setEditingLibro(libro);
    setFormOpen(true);
  }, []);

  const handleSave = useCallback(
    async (data: LibroFormData) => {
      try {
        if (editingLibro) {
          const updated = await updateLibro(editingLibro.id, data);
          setLibros((prev) =>
            prev.map((libro) => (libro.id === updated.id ? updated : libro)),
          );
          if (
            data.autor_nombre &&
            !autores.some((autor) => autor.id === updated.autor_id)
          ) {
            setAutores((prev) =>
              [...prev, { id: updated.autor_id, nombre: updated.autor }].sort(
                (a, b) => a.nombre.localeCompare(b.nombre, "es"),
              ),
            );
          }
        } else {
          const created = await createLibro(data);
          setLibros((prev) => [created, ...prev]);
          if (
            data.autor_nombre &&
            !autores.some((autor) => autor.id === created.autor_id)
          ) {
            setAutores((prev) =>
              [...prev, { id: created.autor_id, nombre: created.autor }].sort(
                (a, b) => a.nombre.localeCompare(b.nombre, "es"),
              ),
            );
          }
        }
      } catch (err) {
        console.error("Error al guardar:", err);
        setError(
          err instanceof Error ? err.message : "No se pudo guardar el libro.",
        );
      }
    },
    [editingLibro, autores],
  );

  const handleDelete = useCallback(async (libro: Libro) => {
    const ok = window.confirm(
      `¿Eliminar "${libro.titulo}" de ${libro.autor}? Esta acción no se puede deshacer.`,
    );
    if (!ok) return;

    try {
      await deleteLibro(libro.id);
      setLibros((prev) => prev.filter((item) => item.id !== libro.id));
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el libro.",
      );
    }
  }, []);

  const handleVenta = useCallback(async (libro: Libro) => {
    if (libro.stock <= 0) return;

    try {
      const newStock = await decrementStock(libro.id, libro.stock);
      setLibros((prev) =>
        prev.map((item) =>
          item.id === libro.id ? { ...item, stock: newStock } : item,
        ),
      );
    } catch (err) {
      console.error("Error al registrar venta:", err);
      setError(
        err instanceof Error ? err.message : "No se pudo registrar la venta.",
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Header userEmail={userEmail} onSignedOut={onSignedOut} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <StatsCards stats={stats} />

        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink">
                Inventario
              </h2>
              <p className="text-sm text-ink-muted">
                {librosFiltrados.length} de {libros.length} títulos
              </p>
            </div>
            <Button onClick={handleAdd} disabled={loading || generos.length === 0}>
              <Plus className="h-4 w-4" />
              Agregar libro
            </Button>
          </div>

          <BookFilters
            busqueda={busqueda}
            genero={genero}
            estado={estado}
            generos={generos}
            estados={estados}
            onBusquedaChange={setBusqueda}
            onGeneroChange={setGenero}
            onEstadoChange={setEstado}
          />

          {loading ? (
            <div className="flex items-center justify-center py-20 text-ink-muted">
              Cargando inventario...
            </div>
          ) : (
            <BookTable
              libros={librosFiltrados}
              generoColors={generoColors}
              estadoColors={estadoColors}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onVenta={handleVenta}
            />
          )}
        </section>
      </main>

      <BookFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        libro={editingLibro}
        generos={generos}
        estados={estados}
        autores={autores}
      />
    </div>
  );
}
