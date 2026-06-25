import type { Estado, Genero } from "./types";

export const GENEROS: Genero[] = [
  "Narrativa",
  "Poesía",
  "Ensayo",
  "Historia",
  "Filosofía",
  "Ciencia ficción",
  "Policial",
  "Infantil",
  "Otro",
];

export const ESTADOS: Estado[] = ["Bueno", "Regular", "Deteriorado"];

export const GENERO_COLORS: Record<Genero, string> = {
  Narrativa: "bg-violet-100 text-violet-800 border-violet-200",
  Poesía: "bg-rose-100 text-rose-800 border-rose-200",
  Ensayo: "bg-sky-100 text-sky-800 border-sky-200",
  Historia: "bg-amber-100 text-amber-800 border-amber-200",
  Filosofía: "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Ciencia ficción": "bg-teal-100 text-teal-800 border-teal-200",
  Policial: "bg-slate-100 text-slate-800 border-slate-200",
  Infantil: "bg-orange-100 text-orange-800 border-orange-200",
  Otro: "bg-stone-100 text-stone-700 border-stone-200",
};

export const ESTADO_COLORS: Record<Estado, string> = {
  Bueno: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Regular: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Deteriorado: "bg-red-100 text-red-800 border-red-200",
};

export const DEFAULT_LIBRO = {
  titulo: "",
  autor: "",
  genero: "Otro" as Genero,
  estado: "Bueno" as Estado,
  stock: 1,
  precio_compra: 0,
  precio_venta: 0,
};
