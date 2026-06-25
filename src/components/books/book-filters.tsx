"use client";

import { ESTADOS, GENEROS } from "@/lib/constants";
import { Search } from "lucide-react";
import { Select } from "../ui/select";

interface BookFiltersProps {
  busqueda: string;
  genero: string;
  estado: string;
  onBusquedaChange: (value: string) => void;
  onGeneroChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
}

export function BookFilters({
  busqueda,
  genero,
  estado,
  onBusquedaChange,
  onGeneroChange,
  onEstadoChange,
}: BookFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          placeholder="Buscar por título o autor..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-stone-300 bg-white pl-10 pr-3 text-sm text-ink placeholder:text-stone-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <Select
        id="filtro-genero"
        value={genero}
        onChange={(e) => onGeneroChange(e.target.value)}
        options={[
          { value: "", label: "Todos los géneros" },
          ...GENEROS.map((g) => ({ value: g, label: g })),
        ]}
        className="sm:w-44"
      />
      <Select
        id="filtro-estado"
        value={estado}
        onChange={(e) => onEstadoChange(e.target.value)}
        options={[
          { value: "", label: "Todos los estados" },
          ...ESTADOS.map((e) => ({ value: e, label: e })),
        ]}
        className="sm:w-44"
      />
    </div>
  );
}
