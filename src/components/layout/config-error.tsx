export function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h1 className="font-serif text-xl font-semibold text-ink">
          Configuración incompleta
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Faltan las variables de entorno de Supabase. Copiá{" "}
          <code className="rounded bg-paper-dark px-1">.env.example</code> a{" "}
          <code className="rounded bg-paper-dark px-1">.env.local</code> y
          completá los valores desde tu proyecto.
        </p>
      </div>
    </div>
  );
}
