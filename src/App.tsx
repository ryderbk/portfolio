import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageLoadOverlay } from "@/components/page-load-overlay";
import { CustomCursor } from "@/components/custom-cursor";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

import { AuthProvider } from "@/context/AuthContext";

import Admin from "@/pages/admin";
import Login from "@/pages/login";
import { SiteConfigProvider } from "@/context/SiteConfigContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <SiteConfigProvider>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          {/* Cinematic global UI: cursor + entrance overlay. Both no-op on
              touch devices and when the user prefers reduced motion. */}
          <CustomCursor />
          <PageLoadOverlay />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
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
