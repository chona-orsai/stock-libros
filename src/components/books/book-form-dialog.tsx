"use client";

import { DEFAULT_LIBRO, ESTADOS, GENEROS } from "@/lib/constants";
import type { Libro, LibroFormData } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

interface BookFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: LibroFormData) => void;
  libro?: Libro | null;
}

export function BookFormDialog({
  open,
  onClose,
  onSave,
  libro,
}: BookFormDialogProps) {
  const [form, setForm] = useState<LibroFormData>(DEFAULT_LIBRO);

  useEffect(() => {
    if (libro) {
      setForm({
        titulo: libro.titulo,
        autor: libro.autor,
        genero: libro.genero,
        estado: libro.estado,
        stock: libro.stock,
        precio_compra: libro.precio_compra,
        precio_venta: libro.precio_venta,
      });
    } else {
      setForm(DEFAULT_LIBRO);
    }
  }, [libro, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.autor.trim()) return;
    onSave(form);
    onClose();
  };

  const update = <K extends keyof LibroFormData>(key: K, value: LibroFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={libro ? "Editar libro" : "Agregar libro"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="titulo"
          label="Título"
          value={form.titulo}
          onChange={(e) => update("titulo", e.target.value)}
          required
          autoFocus
        />
        <Input
          id="autor"
          label="Autor/a"
          value={form.autor}
          onChange={(e) => update("autor", e.target.value)}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="genero"
            label="Género"
            value={form.genero}
            onChange={(e) => update("genero", e.target.value as LibroFormData["genero"])}
            options={GENEROS.map((g) => ({ value: g, label: g }))}
          />
          <Select
            id="estado"
            label="Estado"
            value={form.estado}
            onChange={(e) => update("estado", e.target.value as LibroFormData["estado"])}
            options={ESTADOS.map((e) => ({ value: e, label: e }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="stock"
            label="Stock"
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
          />
          <Input
            id="precio_compra"
            label="Precio compra"
            type="number"
            min={0}
            step={0.01}
            value={form.precio_compra}
            onChange={(e) => update("precio_compra", Number(e.target.value))}
          />
          <Input
            id="precio_venta"
            label="Precio venta"
            type="number"
            min={0}
            step={0.01}
            value={form.precio_venta}
            onChange={(e) => update("precio_venta", Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{libro ? "Guardar cambios" : "Agregar libro"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
