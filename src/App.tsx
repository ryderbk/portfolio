import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

import { AuthProvider } from "@/auth/AuthContext";
import ChatWidget from "@/components/bkfiles/ChatWidget";

import Admin from "@/pages/admin";
import Login from "@/pages/login";
import { ThemeProvider } from "@/components/theme-provider";

// Debug: Log app component loaded
console.log("📦 App component loading...");

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
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <ChatWidget />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
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
