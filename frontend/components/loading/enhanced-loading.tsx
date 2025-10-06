"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EnhancedLoadingProps {
  variant?: "card" | "list" | "skeleton" | "spinner" | "dots"
  count?: number
  className?: string
}

export function EnhancedLoading({ variant = "card", count = 3, className }: EnhancedLoadingProps) {
  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="relative">
          <div className="w-12 h-12 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-primary/20"></div>
        </div>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-2 py-12", className)}>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-shimmer"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                  <div className="space-y-2 flex-1">
                    <div
                      className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-shimmer"
                      style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
                    />
                    <div
                      className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded w-2/3 animate-shimmer"
                      style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div
                    className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-shimmer"
                    style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
                  />
                  <div
                    className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-shimmer"
                    style={{ animationDelay: `${i * 0.1 + 0.4}s` }}
                  />
                  <div
                    className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded w-3/4 animate-shimmer"
                    style={{ animationDelay: `${i * 0.1 + 0.5}s` }}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div
                      className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded w-20 animate-shimmer"
                      style={{ animationDelay: `${i * 0.1 + 0.6}s` }}
                    />
                    <div
                      className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded w-16 animate-shimmer"
                      style={{ animationDelay: `${i * 0.1 + 0.7}s` }}
                    />
                  </div>
                  <div
                    className="h-10 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-shimmer mt-4"
                    style={{ animationDelay: `${i * 0.1 + 0.8}s` }}
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
            <div className="w-12 h-12 bg-muted rounded-full animate-skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-skeleton" />
              <div className="h-3 bg-muted rounded w-2/3 animate-skeleton" />
            </div>
            <div className="h-8 bg-muted rounded w-20 animate-skeleton" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded animate-skeleton" />
      ))}
    </div>
  )
}
