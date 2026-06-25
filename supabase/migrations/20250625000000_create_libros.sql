-- Migración inicial para Chona Libros
-- Ejecutar en Supabase SQL Editor o via CLI

create table libros (
  id            bigint generated always as identity primary key,
  titulo        text not null,
  autor         text not null,
  genero        text not null default 'Otro',
  estado        text not null default 'Bueno',
  stock         integer not null default 1,
  precio_compra numeric(10,2) not null default 0,
  precio_venta  numeric(10,2) not null default 0,
  created_at    timestamptz default now()
);

alter table libros enable row level security;

create policy "Acceso total" on libros for all using (true) with check (true);
