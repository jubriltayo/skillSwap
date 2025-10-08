"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { MessagesContent } from "@/components/messages/messages-content";

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground text-pretty">
              Connect and chat with your professional connections.
            </p>
          </div>
          <MessagesContent />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
