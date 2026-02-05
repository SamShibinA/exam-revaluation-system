import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

import { AuthProvider, useAuth } from "./context/AuthContext";
import { theme } from "./theme/theme";

// Pages
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ViewMarksPage from "./pages/student/ViewMarksPage";
import ApplyForm from "./pages/student/ApplyForm";
import StudentRequestsPage from "./pages/student/StudentRequestsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage";
import UploadDocumentPage from "./pages/admin/UploadDocumentPage";
import ManageStudentsPage from "./pages/admin/ManageStudentsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
const queryClient = new QueryClient();

// Root redirect component
function RootRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate to={user?.role === "admin" ? "/admin" : "/student"} replace />
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="marks" element={<ViewMarksPage />} />
        <Route path="apply-review" element={<ApplyForm type="review" />} />
        <Route path="apply-revaluation" element={<ApplyForm type="revaluation" />} />
        <Route path="requests" element={<StudentRequestsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="requests" element={<AdminRequestsPage />} />
        <Route path="upload" element={<UploadDocumentPage />} />
        <Route path="students" element={<ManageStudentsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
