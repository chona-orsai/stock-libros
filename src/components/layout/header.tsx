"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase/auth";
import { BookOpen, LogOut } from "lucide-react";

interface HeaderProps {
  userEmail?: string | null;
  onSignedOut?: () => void;
}

export function Header({ userEmail, onSignedOut }: HeaderProps) {
  const showSession = Boolean(userEmail);

  async function handleSignOut() {
    await signOut();
    onSignedOut?.();
  }

  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
              Chona Libros
            </h1>
            <p className="text-sm text-ink-muted">
              Control de stock — librería de usados
            </p>
          </div>
        </div>

        {showSession && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-muted sm:inline">
              {userEmail}
            </span>
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
