import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Book from "./pages/Book";
import Policy from "./pages/Policy";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Documentation from "./pages/Documentation";
import StaffPortal from "./pages/StaffPortal";
import CustomerPortal from "./pages/CustomerPortal";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/book" element={<Book />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/staff" element={<StaffPortal />} />
              <Route path="/portal" element={<CustomerPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;