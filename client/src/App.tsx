import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Auth from "@/pages/auth";
import Ledger from "@/pages/ledger";
import Loans from "@/pages/loans";
import Governance from "@/pages/governance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ledger" component={Ledger} />
      <Route path="/loans" component={Loans} />
      <Route path="/governance" component={Governance} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl" className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
