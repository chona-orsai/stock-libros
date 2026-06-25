-- Políticas de acceso solo para administradores autenticados

drop policy if exists "Acceso total" on libros;

create policy "Admins pueden leer libros"
  on libros for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins pueden crear libros"
  on libros for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins pueden actualizar libros"
  on libros for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins pueden eliminar libros"
  on libros for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
