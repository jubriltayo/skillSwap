import { AppShell } from "@/components/layout/app-shell"
import { EnhancedLoading } from "@/components/loading/enhanced-loading"

export default function UsersLoading() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded-lg w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-muted rounded w-96 animate-pulse" />
        </div>

        <div className="mb-8 space-y-4">
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-full w-20 animate-pulse" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-border/50 rounded-lg p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-32 mb-1 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                </div>
                <div className="h-5 bg-muted rounded-full w-16 animate-pulse" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-muted rounded w-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-5 bg-muted rounded-full w-16 animate-pulse" />
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                <div className="h-8 bg-muted rounded w-24 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <EnhancedLoading />
        </div>
      </div>
    </AppShell>
  )
}
