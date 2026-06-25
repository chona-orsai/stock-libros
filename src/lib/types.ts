export type Genero =
  | "Narrativa"
  | "Poesía"
  | "Ensayo"
  | "Historia"
  | "Filosofía"
  | "Ciencia ficción"
  | "Policial"
  | "Infantil"
  | "Otro";

export type Estado = "Bueno" | "Regular" | "Deteriorado";

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: Genero;
  estado: Estado;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  created_at: string;
}

export type LibroFormData = Omit<Libro, "id" | "created_at">;

export interface StockStats {
  titulosEnStock: number;
  ejemplaresTotales: number;
  gananciaPotencial: number;
  capitalInvertido: number;
}
