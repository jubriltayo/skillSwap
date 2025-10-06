"use client"

import type React from "react"

import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

interface AppShellProps {
  children: React.ReactNode
  showFooter?: boolean
}

export function AppShell({ children, showFooter = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      {showFooter && <SiteFooter />}
    </div>
  )
}
