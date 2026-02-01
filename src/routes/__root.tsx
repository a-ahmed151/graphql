import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'



import type { QueryClient } from '@tanstack/react-query'
import { AuthContext } from '../auth'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}



export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="min-h-screen bg-background text-foreground font-display relative">
      {/* Global Background Effects - Fixed Container to prevent overflow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="cyber-grid absolute inset-0"></div>
        <div className="scanline"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[100vw] overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  ),
})
