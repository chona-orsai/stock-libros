import type { Libro, StockStats } from "./types";

export function calcularStats(libros: Libro[]): StockStats {
  const conStock = libros.filter((l) => l.stock > 0);

  return {
    titulosEnStock: conStock.length,
    ejemplaresTotales: libros.reduce((sum, l) => sum + l.stock, 0),
    gananciaPotencial: libros.reduce(
      (sum, l) => sum + (l.precio_venta - l.precio_compra) * l.stock,
      0,
    ),
    capitalInvertido: libros.reduce(
      (sum, l) => sum + l.precio_compra * l.stock,
      0,
    ),
  };
}

export function filtrarLibros(
  libros: Libro[],
  busqueda: string,
  genero: string,
  estado: string,
): Libro[] {
  const q = busqueda.toLowerCase().trim();

  return libros.filter((libro) => {
    const matchBusqueda =
      !q ||
      libro.titulo.toLowerCase().includes(q) ||
      libro.autor.toLowerCase().includes(q);
    const matchGenero = !genero || libro.genero === genero;
    const matchEstado = !estado || libro.estado === estado;

    return matchBusqueda && matchGenero && matchEstado;
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
