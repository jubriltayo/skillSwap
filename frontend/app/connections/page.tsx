"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppShell } from "@/components/layout/app-shell"
import { ConnectionsTabs } from "@/components/connections/connections-tabs"

export default function ConnectionsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Connections
            </h1>
            <p className="text-muted-foreground text-pretty">
              Manage your professional connections and discover new people to learn from.
            </p>
          </div>
          <ConnectionsTabs />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
