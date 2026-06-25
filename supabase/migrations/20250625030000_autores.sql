-- Catálogo de autores: un autor puede tener muchos libros, un libro tiene un autor

create table if not exists autores (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  created_at timestamptz default now()
);

-- Migrar autores existentes desde el campo de texto en libros
insert into autores (nombre)
select distinct trim(autor)
from libros
where trim(autor) <> ''
on conflict (nombre) do nothing;

alter table libros add column if not exists autor_id bigint;

update libros l
set autor_id = a.id
from autores a
where trim(l.autor) = a.nombre
  and l.autor_id is null;

-- Fallback por si quedara algún registro sin match
insert into autores (nombre) values ('Desconocido')
on conflict (nombre) do nothing;

update libros
set autor_id = (select id from autores where nombre = 'Desconocido')
where autor_id is null;

alter table libros
  alter column autor_id set not null;

alter table libros
  drop column if exists autor;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'libros_autor_id_fkey'
  ) then
    alter table libros
      add constraint libros_autor_id_fkey
      foreign key (autor_id) references autores (id);
  end if;
end $$;

alter table autores enable row level security;

drop policy if exists "Admins pueden leer autores" on autores;
drop policy if exists "Admins pueden gestionar autores" on autores;

create policy "Admins pueden leer autores"
  on autores for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins pueden gestionar autores"
  on autores for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
