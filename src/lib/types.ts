export interface CatalogOption {
  id: number;
  nombre: string;
  color_class: string;
  orden: number;
  es_default: boolean;
  created_at?: string;
}

export interface Autor {
  id: number;
  nombre: string;
  created_at?: string;
}

export interface Libro {
  id: number;
  titulo: string;
  autor_id: number;
  autor: string;
  genero: string;
  estado: string;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  created_at: string;
}

export interface LibroFormData {
  titulo: string;
  autor_id: number | null;
  autor_nombre: string;
  genero: string;
  estado: string;
  stock: number;
  precio_compra: number;
  precio_venta: number;
}

export interface StockStats {
  titulosEnStock: number;
  ejemplaresTotales: number;
  gananciaPotencial: number;
  capitalInvertido: number;
}

export interface CatalogData {
  generos: CatalogOption[];
  estados: CatalogOption[];
  autores: Autor[];
}
