import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Seminare from "./pages/Seminare";
import Oria from "./pages/Oria";
import Impressum from "./pages/Impressum";
import Auth from "./pages/Auth";
import Coach from "./pages/Coach";
import MemoryVault from "./pages/MemoryVault";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/seminare" element={<Seminare />} />
              <Route path="/oria" element={<Oria />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/coach" element={<Coach />} />
              <Route path="/vault" element={<MemoryVault />} />
              <Route path="/profile" element={<UserProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
