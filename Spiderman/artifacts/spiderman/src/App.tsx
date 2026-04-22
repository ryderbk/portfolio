import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SpiderManHero from "@/components/SpiderManHero";
import ReferenceSection from "@/components/ReferenceSection";
import ReferenceDetailsSection from "@/components/ReferenceDetailsSection";
import DeadpoolPosterSection from "@/components/DeadpoolPosterSection";
import BottomPlaceholderSection from "@/components/BottomPlaceholderSection";
import FloatingRedPlaceholder from "@/components/FloatingRedPlaceholder";
import WhiteStage from "@/components/WhiteStage";

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="App">
      <SpiderManHero />
      <ReferenceSection />
      <WhiteStage>
        <FloatingRedPlaceholder />
        <ReferenceDetailsSection />
        <DeadpoolPosterSection />
        <BottomPlaceholderSection />
      </WhiteStage>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
