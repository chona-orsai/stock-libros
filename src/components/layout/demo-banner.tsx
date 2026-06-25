import { AlertTriangle } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-start gap-3 text-sm text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Modo demo:</strong> Supabase no está configurado. Se muestran datos de
          ejemplo (Borges, Cortázar, Sabato). Los cambios no se guardan. Configurá{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          y{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          en tu archivo <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">.env.local</code>.
        </p>
      </div>
    </div>
  );
}
