"use client";

import { LoginForm } from "@/components/auth/login-form";
import { ConfigError } from "@/components/layout/config-error";
import { getCurrentSession } from "@/lib/supabase/auth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface AuthGateProps {
  children: (session: Session) => ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const currentSession = await getCurrentSession();
    setSession(currentSession);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (nextSession?.user.app_metadata?.role === "admin") {
        setSession(nextSession);
        return;
      }

      setSession(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured()) {
    return <ConfigError />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-ink-muted">
        Verificando sesión...
      </div>
    );
  }

  if (!session) {
    return <LoginForm onSuccess={refreshSession} />;
  }

  return <>{children(session)}</>;
}
