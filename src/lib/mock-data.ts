import type { Libro } from "./types";

export const MOCK_LIBROS: Libro[] = [
  {
    id: 1,
    titulo: "Ficciones",
    autor: "Jorge Luis Borges",
    genero: "Narrativa",
    estado: "Bueno",
    stock: 2,
    precio_compra: 800,
    precio_venta: 2500,
    created_at: "2024-03-15T10:00:00Z",
  },
  {
    id: 2,
    titulo: "Rayuela",
    autor: "Julio Cortázar",
    genero: "Narrativa",
    estado: "Regular",
    stock: 1,
    precio_compra: 600,
    precio_venta: 1800,
    created_at: "2024-04-02T14:30:00Z",
  },
  {
    id: 3,
    titulo: "Sobre héroes y tumbas",
    autor: "Ernesto Sabato",
    genero: "Narrativa",
    estado: "Bueno",
    stock: 3,
    precio_compra: 500,
    precio_venta: 1500,
    created_at: "2024-05-20T09:15:00Z",
  },
];
