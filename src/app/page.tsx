"use client";

import { AuthGate } from "@/components/auth/auth-gate";
import { InventoryPage } from "@/components/inventory-page";

export default function Home() {
  return (
    <AuthGate>
      {(session) => (
        <InventoryPage
          userEmail={session.user.email}
          onSignedOut={() => window.location.reload()}
        />
      )}
    </AuthGate>
  );
}
