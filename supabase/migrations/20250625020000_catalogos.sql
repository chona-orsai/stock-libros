-- Catálogos dinámicos: géneros y estados

create table if not exists generos (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  color_class text not null default 'bg-stone-100 text-stone-700 border-stone-200',
  orden integer not null default 0,
  es_default boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists estados (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  color_class text not null default 'bg-stone-100 text-stone-700 border-stone-200',
  orden integer not null default 0,
  es_default boolean not null default false,
  created_at timestamptz default now()
);

insert into generos (nombre, color_class, orden, es_default) values
  ('Narrativa', 'bg-violet-100 text-violet-800 border-violet-200', 1, false),
  ('Poesía', 'bg-rose-100 text-rose-800 border-rose-200', 2, false),
  ('Ensayo', 'bg-sky-100 text-sky-800 border-sky-200', 3, false),
  ('Historia', 'bg-amber-100 text-amber-800 border-amber-200', 4, false),
  ('Filosofía', 'bg-indigo-100 text-indigo-800 border-indigo-200', 5, false),
  ('Ciencia ficción', 'bg-teal-100 text-teal-800 border-teal-200', 6, false),
  ('Policial', 'bg-slate-100 text-slate-800 border-slate-200', 7, false),
  ('Infantil', 'bg-orange-100 text-orange-800 border-orange-200', 8, false),
  ('Otro', 'bg-stone-100 text-stone-700 border-stone-200', 9, true)
on conflict (nombre) do nothing;

insert into estados (nombre, color_class, orden, es_default) values
  ('Bueno', 'bg-emerald-100 text-emerald-800 border-emerald-200', 1, true),
  ('Regular', 'bg-yellow-100 text-yellow-800 border-yellow-200', 2, false),
  ('Deteriorado', 'bg-red-100 text-red-800 border-red-200', 3, false)
on conflict (nombre) do nothing;

alter table generos enable row level security;
alter table estados enable row level security;

drop policy if exists "Admins pueden leer generos" on generos;
drop policy if exists "Admins pueden gestionar generos" on generos;
drop policy if exists "Admins pueden leer estados" on estados;
drop policy if exists "Admins pueden gestionar estados" on estados;

create policy "Admins pueden leer generos"
  on generos for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins pueden gestionar generos"
  on generos for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins pueden leer estados"
  on estados for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins pueden gestionar estados"
  on estados for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'libros_genero_fkey'
  ) then
    alter table libros
      add constraint libros_genero_fkey
      foreign key (genero) references generos (nombre);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'libros_estado_fkey'
  ) then
    alter table libros
      add constraint libros_estado_fkey
      foreign key (estado) references estados (nombre);
  end if;
end $$;
