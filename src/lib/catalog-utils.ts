import type { CatalogOption, LibroFormData } from "./types";

const FALLBACK_BADGE_CLASS =
  "bg-stone-100 text-stone-700 border-stone-200";

export function buildColorMap(
  options: CatalogOption[],
): Record<string, string> {
  return Object.fromEntries(
    options.map((option) => [option.nombre, option.color_class]),
  );
}

export function getBadgeClass(
  colorMap: Record<string, string>,
  value: string,
): string {
  return colorMap[value] ?? FALLBACK_BADGE_CLASS;
}

export function buildDefaultLibroForm(
  generos: CatalogOption[],
  estados: CatalogOption[],
): LibroFormData {
  const defaultGenero =
    generos.find((option) => option.es_default)?.nombre ??
    generos[0]?.nombre ??
    "";
  const defaultEstado =
    estados.find((option) => option.es_default)?.nombre ??
    estados[0]?.nombre ??
    "";

  return {
    titulo: "",
    autor_id: null,
    autor_nombre: "",
    genero: defaultGenero,
    estado: defaultEstado,
    stock: 1,
    precio_compra: 0,
    precio_venta: 0,
  };
}
