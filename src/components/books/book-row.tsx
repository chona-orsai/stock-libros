"use client";

import { ESTADO_COLORS, GENERO_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/stats";
import type { Libro } from "@/lib/types";
import { Minus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface BookRowProps {
  libro: Libro;
  onEdit: (libro: Libro) => void;
  onDelete: (libro: Libro) => void;
  onVenta: (libro: Libro) => void;
}

export function BookRow({ libro, onEdit, onDelete, onVenta }: BookRowProps) {
  const sinStock = libro.stock === 0;

  return (
    <tr className={sinStock ? "bg-stone-50/80 opacity-60" : "hover:bg-paper-dark/50"}>
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-ink">{libro.titulo}</p>
          <p className="text-sm text-ink-muted">{libro.autor}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge className={GENERO_COLORS[libro.genero]}>{libro.genero}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge className={ESTADO_COLORS[libro.estado]}>{libro.estado}</Badge>
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full text-sm font-semibold ${
            sinStock
              ? "bg-stone-200 text-stone-500"
              : "bg-accent/10 text-accent"
          }`}
        >
          {libro.stock}
        </span>
      </td>
      <td className="hidden px-4 py-3 text-sm text-ink-muted sm:table-cell">
        {formatCurrency(libro.precio_compra)}
      </td>
      <td className="hidden px-4 py-3 text-sm font-medium text-ink md:table-cell">
        {formatCurrency(libro.precio_venta)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onVenta(libro)}
            disabled={sinStock}
            title="Registrar venta (−1)"
            aria-label="Registrar venta"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(libro)}
            title="Editar"
            aria-label="Editar libro"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="icon"
            onClick={() => onDelete(libro)}
            title="Eliminar"
            aria-label="Eliminar libro"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
