"use client";

import type { Libro } from "@/lib/types";
import { BookOpen } from "lucide-react";
import { BookRow } from "./book-row";

interface BookTableProps {
  libros: Libro[];
  onEdit: (libro: Libro) => void;
  onDelete: (libro: Libro) => void;
  onVenta: (libro: Libro) => void;
}

export function BookTable({ libros, onEdit, onDelete, onVenta }: BookTableProps) {
  if (libros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
        <BookOpen className="mb-3 h-10 w-10 text-stone-300" />
        <p className="font-medium text-ink-muted">No hay libros que coincidan</p>
        <p className="mt-1 text-sm text-stone-400">
          Probá cambiar los filtros o agregá un libro nuevo
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-paper-dark/60 text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-medium">Libro</th>
              <th className="px-4 py-3 font-medium">Género</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-center font-medium">Stock</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Compra</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Venta</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {libros.map((libro) => (
              <BookRow
                key={libro.id}
                libro={libro}
                onEdit={onEdit}
                onDelete={onDelete}
                onVenta={onVenta}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
