import { BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Chona Libros
          </h1>
          <p className="text-sm text-ink-muted">Control de stock — librería de usados</p>
        </div>
      </div>
    </header>
  );
}
