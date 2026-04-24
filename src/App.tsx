import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageLoadOverlay } from "@/components/page-load-overlay";

// Lazy load pages for better initial performance
const Home = lazy(() => import("@/pages/home"));
const Admin = lazy(() => import("@/pages/admin"));
const Login = lazy(() => import("@/pages/login"));
const NotFound = lazy(() => import("@/pages/not-found"));

import { AuthProvider } from "@/context/AuthContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { DataProvider } from "@/context/DataContext";

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppContent() {
  return (
    <SiteConfigProvider>
      <DataProvider>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            {/* Cinematic entrance overlay. No-op when the user prefers reduced motion. */}
            <PageLoadOverlay />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </DataProvider>
    </SiteConfigProvider>
  );
}

function App() {
  console.log("🚀 App rendering (wrapped with ErrorBoundary)");
  
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
