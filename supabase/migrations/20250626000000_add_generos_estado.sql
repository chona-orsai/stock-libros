-- Nuevos géneros: Biografía, Cuentos/Antología
-- Nuevo estado: Nuevo

insert into generos (nombre, color_class, orden, es_default) values
  ('Biografía', 'bg-cyan-100 text-cyan-800 border-cyan-200', 9, false),
  ('Cuentos/Antología', 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200', 10, false)
on conflict (nombre) do nothing;

update generos set orden = 11 where nombre = 'Otro';

insert into estados (nombre, color_class, orden, es_default) values
  ('Nuevo', 'bg-lime-100 text-lime-800 border-lime-200', 1, false)
on conflict (nombre) do nothing;

update estados set orden = 2 where nombre = 'Bueno';
update estados set orden = 3 where nombre = 'Regular';
update estados set orden = 4 where nombre = 'Deteriorado';
