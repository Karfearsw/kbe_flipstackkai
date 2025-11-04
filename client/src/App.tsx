import * as React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ErrorGuidanceProvider } from "@/hooks/use-error-guidance";
import { WebSocketProvider } from "@/hooks/use-websocket";
import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/layout";
import { ErrorBoundary } from "@/components/error-recovery";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page-new";
import LeadsPage from "@/pages/leads-page";
import CallsPage from "@/pages/calls-page";
import TeamPage from "@/pages/team-page";
import AnalyticsPage from "@/pages/analytics-page";
import SettingsPage from "@/pages/settings-page";
import MapPage from "@/pages/map-page";
import CalculatorPage from "@/pages/calculator-page";
import TimesheetPage from "@/pages/timesheet-page";
import ActivitiesPage from "@/pages/activities-page";
import DocumentationPage from "@/pages/documentation-page";
import InvestorPage from "@/pages/investor-page";
import ErrorGuidancePage from "@/pages/error-guidance-page";
import ErrorExamplePage from "@/pages/error-example-page";
import StatusPage from "@/pages/status-page";
import NotesPage from "@/pages/notes";

// Wrapper component for protected routes with layout
const ProtectedPageWithLayout = ({ component: Component }: { component: React.ComponentType }) => {
  return (
    <Layout>
      <Component />
    </Layout>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={() => <ProtectedPageWithLayout component={DashboardPage} />} />
      <ProtectedRoute path="/dashboard" component={() => <ProtectedPageWithLayout component={DashboardPage} />} />
      <ProtectedRoute path="/leads" component={() => <ProtectedPageWithLayout component={LeadsPage} />} />
      <ProtectedRoute path="/calls" component={() => <ProtectedPageWithLayout component={CallsPage} />} />
      <ProtectedRoute path="/team" component={() => <ProtectedPageWithLayout component={TeamPage} />} />
      <ProtectedRoute path="/analytics" component={() => <ProtectedPageWithLayout component={AnalyticsPage} />} />
      <ProtectedRoute path="/settings" component={() => <ProtectedPageWithLayout component={SettingsPage} />} />
      <ProtectedRoute path="/map" component={() => <ProtectedPageWithLayout component={MapPage} />} />
      <ProtectedRoute path="/calculator" component={() => <ProtectedPageWithLayout component={CalculatorPage} />} />
      <ProtectedRoute path="/timesheet" component={() => <ProtectedPageWithLayout component={TimesheetPage} />} />
      <ProtectedRoute path="/activities" component={() => <ProtectedPageWithLayout component={ActivitiesPage} />} />
      <ProtectedRoute path="/status" component={() => <ProtectedPageWithLayout component={StatusPage} />} />
      <ProtectedRoute path="/notes" component={() => <ProtectedPageWithLayout component={NotesPage} />} />
      <ProtectedRoute path="/documentation" component={() => <ProtectedPageWithLayout component={DocumentationPage} />} />
      <ProtectedRoute path="/error-guidance" component={() => <ProtectedPageWithLayout component={ErrorGuidancePage} />} />
      <ProtectedRoute path="/error-examples" component={() => <ProtectedPageWithLayout component={ErrorExamplePage} />} />
      <ProtectedRoute path="/investor" component={InvestorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Minimal global activity tracker for feature usage & user activity
function ActivityTracker() {
  const [location] = useLocation();
  React.useEffect(() => {
    try {
      const key = "featureUsage";
      const raw = localStorage.getItem(key);
      const usage = raw ? JSON.parse(raw) : {};
      usage[location] = (usage[location] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(usage));

      const activityKey = "userActivityEvents";
      const count = Number(localStorage.getItem(activityKey) || "0");
      localStorage.setItem(activityKey, String(count + 1));
    } catch (e) {
      // ignore storage errors
    }
  }, [location]);

  React.useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsedKey = "sessionDurationMs";
      const elapsed = Date.now() - start;
      try {
        localStorage.setItem(elapsedKey, String(elapsed));
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <ErrorGuidanceProvider>
          <AuthProvider>
            <WebSocketProvider>
              <TooltipProvider>
                <ErrorBoundary>
                  <Toaster />
                  <ActivityTracker />
                  <Router />
                </ErrorBoundary>
              </TooltipProvider>
            </WebSocketProvider>
          </AuthProvider>
        </ErrorGuidanceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
