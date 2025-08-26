import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import game flow and screens
import GameFlow from "@/pages/GameFlow";
import WalletScreen from "@/pages/WalletScreen";
import CurrencyScreen from "@/pages/CurrencyScreen";
import InventoryScreen from "@/pages/InventoryScreen";
import CollectionScreen from "@/pages/CollectionScreen";
import SkillsScreen from "@/pages/SkillsScreen";
import NetworkScreen from "@/pages/NetworkScreen";
import ChaosScreen from "@/pages/ChaosScreen";
import TransactionsScreen from "@/pages/TransactionsScreen";
import GameSystem from "@/pages/GameSystem";
import LemmiRunGame from "@/pages/LemmiRunGame";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={GameFlow} />
      <Route path="/wallet" component={WalletScreen} />
      <Route path="/currency" component={CurrencyScreen} />
      <Route path="/inventory" component={InventoryScreen} />
      <Route path="/collection" component={CollectionScreen} />
      <Route path="/skills" component={SkillsScreen} />
      <Route path="/network" component={NetworkScreen} />
      <Route path="/chaos" component={ChaosScreen} />
      <Route path="/transactions" component={TransactionsScreen} />
      <Route path="/game" component={GameSystem} />
      <Route path="/lemmi-run" component={LemmiRunGame} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
