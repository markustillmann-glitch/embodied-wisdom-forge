import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Modell from "./pages/Modell";
import Seminare from "./pages/Seminare";
import Oria from "./pages/Oria";
import OriaApps from "./pages/OriaApps";
import OriaYouth from "./pages/OriaYouth";
import OriaLandkarte from "./pages/OriaLandkarte";
import OriaRelationships from "./pages/OriaRelationships";
import Resonanzradar from "./pages/Resonanzradar";
import DailyCheckin from "./pages/DailyCheckin";
import LifeCheckin from "./pages/LifeCheckin";
import LifeCheckinModell from "./pages/LifeCheckinModell";
import Team from "./pages/Team";
import Security from "./pages/Security";
import Anleitung from "./pages/Anleitung";
import Impressum from "./pages/Impressum";
import Auth from "./pages/Auth";
import Coach from "./pages/Coach";
import CoachOverview from "./pages/CoachOverview";
import MemoryVault from "./pages/MemoryVault";
import UserProfile from "./pages/UserProfile";
import Admin from "./pages/Admin";
import UserAnalytics from "./pages/UserAnalytics";
import ProfileAssistant from "./pages/ProfileAssistant";
import NotFound from "./pages/NotFound";
import OriaUnternehmen from "./pages/OriaUnternehmen";
import SeminarMehrwerte from "./pages/SeminarMehrwerte";
import OriaModell from "./pages/OriaModell";
import OriaPositionierung from "./pages/OriaPositionierung";
import Ueberforderung from "./pages/Ueberforderung";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/modell" element={<Modell />} />
              <Route path="/seminare" element={<Seminare />} />
              <Route path="/oria" element={<Oria />} />
              <Route path="/oria-apps" element={<OriaApps />} />
              <Route path="/resonanzradar" element={<Resonanzradar />} />
              <Route path="/daily-checkin" element={<DailyCheckin />} />
              <Route path="/oria-landkarte" element={<OriaLandkarte />} />
              <Route path="/oria-youth" element={<OriaYouth />} />
              <Route path="/oria-relationships" element={<OriaRelationships />} />
              <Route path="/life-checkin" element={<LifeCheckin />} />
              <Route path="/life-checkin-modell" element={<LifeCheckinModell />} />
              <Route path="/team" element={<Team />} />
              <Route path="/sicherheit" element={<Security />} />
              <Route path="/anleitung" element={<Anleitung />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/oria-coach" element={<CoachOverview />} />
              <Route path="/coach" element={<Coach />} />
              <Route path="/vault" element={<MemoryVault />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile-assistant" element={<ProfileAssistant />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/user-analytics" element={<UserAnalytics />} />
              <Route path="/oria-unternehmen" element={<OriaUnternehmen />} />
              <Route path="/seminar-mehrwerte" element={<SeminarMehrwerte />} />
              <Route path="/oria-modell" element={<OriaModell />} />
              <Route path="/oria-positionierung" element={<OriaPositionierung />} />
              <Route path="/ueberforderung" element={<Ueberforderung />} />
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
