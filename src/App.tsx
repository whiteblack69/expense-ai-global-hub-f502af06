
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import ExpensesPage from "./pages/ExpensesPage";
import NotificationsPage from "./pages/NotificationsPage";
import CategoriesPage from "./pages/CategoriesPage";
import RulesPage from "./pages/RulesPage";
import ReceiptAnalysisPage from "./pages/ReceiptAnalysisPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Protected routes within app layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/receipt-analysis" element={<ReceiptAnalysisPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/rules" element={<RulesPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
