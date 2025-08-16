import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/login/LoginPage";
import HomePage from "@/pages/home/HomePage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ResendActivationPage from "@/pages/auth/ResendActivationPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import InvitationListPage from "@/pages/invitation/InvitationListPage";
import CreateInvitationPage from "@/pages/invitation/CreateInvitationPage";
import EditInvitationPage from "@/pages/invitation/EditInvitationPage";
import MainLayout from "@/components/layout/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Rotas Públicas com Layout Principal */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Rotas de Autenticação com Layout de Autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/reset-password/:token"
          element={<ResetPasswordPage />}
        />
        <Route path="/auth/resend-activation" element={<ResendActivationPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard with its own Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Other Protected Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/invitations" element={<InvitationListPage />} />
          <Route path="/invitations/new" element={<CreateInvitationPage />} />
          <Route
            path="/invitations/:id/edit"
            element={<EditInvitationPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
