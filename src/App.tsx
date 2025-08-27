import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import game flow and screens
import GameFlow from "@/pages/GameFlow";
import MainHub from "@/pages/MainHub";
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
      <Route path="/mainhub" component={MainHub} />
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
        {/* Maintenance Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">UNDER MAINTENANCE</h1>
            <p className="text-xl text-gray-300 mb-2">Lemmi Run - Web3</p>
            <p className="text-lg text-gray-400">We're working to improve your experience</p>
            <p className="text-sm text-gray-500 mt-4">Please check back soon</p>
          </div>
        </div>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
