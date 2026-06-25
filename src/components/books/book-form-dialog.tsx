"use client";

import { buildDefaultLibroForm } from "@/lib/catalog-utils";
import type { Autor, CatalogOption, Libro, LibroFormData } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

const NUEVO_AUTOR = "__nuevo__";

interface BookFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: LibroFormData) => void;
  libro?: Libro | null;
  generos: CatalogOption[];
  estados: CatalogOption[];
  autores: Autor[];
}

export function BookFormDialog({
  open,
  onClose,
  onSave,
  libro,
  generos,
  estados,
  autores,
}: BookFormDialogProps) {
  const emptyForm = useMemo(
    () => buildDefaultLibroForm(generos, estados),
    [generos, estados],
  );
  const [form, setForm] = useState<LibroFormData>(emptyForm);
  const [modoAutor, setModoAutor] = useState<"existente" | "nuevo">("existente");

  useEffect(() => {
    if (libro) {
      setModoAutor("existente");
      setForm({
        titulo: libro.titulo,
        autor_id: libro.autor_id,
        autor_nombre: "",
        genero: libro.genero,
        estado: libro.estado,
        stock: libro.stock,
        precio_compra: libro.precio_compra,
        precio_venta: libro.precio_venta,
      });
    } else {
      setModoAutor(autores.length > 0 ? "existente" : "nuevo");
      setForm(emptyForm);
    }
  }, [libro, open, emptyForm, autores.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    if (modoAutor === "existente" && !form.autor_id) return;
    if (modoAutor === "nuevo" && !form.autor_nombre.trim()) return;

    onSave({
      ...form,
      autor_id: modoAutor === "existente" ? form.autor_id : null,
      autor_nombre: modoAutor === "nuevo" ? form.autor_nombre.trim() : "",
    });
    onClose();
  };

  const update = <K extends keyof LibroFormData>(
    key: K,
    value: LibroFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAutorSelect = (value: string) => {
    if (value === NUEVO_AUTOR) {
      setModoAutor("nuevo");
      update("autor_id", null);
      return;
    }

    setModoAutor("existente");
    update("autor_id", value ? Number(value) : null);
    update("autor_nombre", "");
  };

  const autorSelectValue =
    modoAutor === "nuevo"
      ? NUEVO_AUTOR
      : form.autor_id
        ? String(form.autor_id)
        : "";

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

        <Select
          id="autor-select"
          label="Autor/a"
          value={autorSelectValue}
          onChange={(e) => handleAutorSelect(e.target.value)}
          options={[
            { value: "", label: "Seleccionar autor/a..." },
            ...autores.map((autor) => ({
              value: String(autor.id),
              label: autor.nombre,
            })),
            { value: NUEVO_AUTOR, label: "+ Crear nuevo autor/a" },
          ]}
        />

        {modoAutor === "nuevo" && (
          <Input
            id="autor-nuevo"
            label="Nombre del autor/a"
            value={form.autor_nombre}
            onChange={(e) => update("autor_nombre", e.target.value)}
            required
            placeholder="Ej: Jorge Luis Borges"
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="genero"
            label="Género"
            value={form.genero}
            onChange={(e) => update("genero", e.target.value)}
            options={generos.map((option) => ({
              value: option.nombre,
              label: option.nombre,
            }))}
          />
          <Select
            id="estado"
            label="Estado"
            value={form.estado}
            onChange={(e) => update("estado", e.target.value)}
            options={estados.map((option) => ({
              value: option.nombre,
              label: option.nombre,
            }))}
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
