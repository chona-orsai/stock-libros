"use client";

import { BookFilters } from "@/components/books/book-filters";
import { BookFormDialog } from "@/components/books/book-form-dialog";
import { BookTable } from "@/components/books/book-table";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { DemoBanner } from "@/components/layout/demo-banner";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { MOCK_LIBROS } from "@/lib/mock-data";
import {
  createLibro,
  deleteLibro,
  decrementStock,
  getDemoMode,
  updateLibro,
} from "@/lib/supabase/books";
import { calcularStats, filtrarLibros } from "@/lib/stats";
import type { Libro, LibroFormData } from "@/lib/types";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export function InventoryPage() {
  const isDemo = getDemoMode();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState("");
  const [estado, setEstado] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingLibro, setEditingLibro] = useState<Libro | null>(null);

  useEffect(() => {
    setLibros([...MOCK_LIBROS]);
    setLoading(false);
  }, []);

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
      if (isDemo) {
        if (editingLibro) {
          setLibros((prev) =>
            prev.map((l) =>
              l.id === editingLibro.id ? { ...l, ...data } : l,
            ),
          );
        } else {
          setLibros((prev) => [
            {
              ...data,
              id: Date.now(),
              created_at: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
        return;
      }

      try {
        if (editingLibro) {
          const updated = await updateLibro(editingLibro.id, data);
          setLibros((prev) =>
            prev.map((l) => (l.id === updated.id ? updated : l)),
          );
        } else {
          const created = await createLibro(data);
          setLibros((prev) => [created, ...prev]);
        }
      } catch (err) {
        console.error("Error al guardar:", err);
      }
    },
    [editingLibro, isDemo],
  );

  const handleDelete = useCallback(
    async (libro: Libro) => {
      const ok = window.confirm(
        `¿Eliminar "${libro.titulo}" de ${libro.autor}? Esta acción no se puede deshacer.`,
      );
      if (!ok) return;

      if (isDemo) {
        setLibros((prev) => prev.filter((l) => l.id !== libro.id));
        return;
      }

      try {
        await deleteLibro(libro.id);
        setLibros((prev) => prev.filter((l) => l.id !== libro.id));
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    },
    [isDemo],
  );

  const handleVenta = useCallback(
    async (libro: Libro) => {
      if (libro.stock <= 0) return;

      if (isDemo) {
        setLibros((prev) =>
          prev.map((l) =>
            l.id === libro.id ? { ...l, stock: l.stock - 1 } : l,
          ),
        );
        return;
      }

      try {
        const newStock = await decrementStock(libro.id, libro.stock);
        setLibros((prev) =>
          prev.map((l) =>
            l.id === libro.id ? { ...l, stock: newStock } : l,
          ),
        );
      } catch (err) {
        console.error("Error al registrar venta:", err);
      }
    },
    [isDemo],
  );

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      {isDemo && <DemoBanner />}

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
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
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              Agregar libro
            </Button>
          </div>

          <BookFilters
            busqueda={busqueda}
            genero={genero}
            estado={estado}
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
      />
    </div>
  );
}
