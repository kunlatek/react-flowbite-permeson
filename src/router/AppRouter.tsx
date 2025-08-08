import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/login/LoginPage";
import HomePage from "@/pages/home/HomePage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import RegisterCompletionPage from "@/pages/auth/RegisterCompletionPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ProfileSelectPage from "@/pages/profile/select/ProfileSelectPage";
import CreatePersonProfilePage from "@/pages/profile/person/CreatePersonProfilePage";
import EditPersonProfilePage from "@/pages/profile/person/EditPersonProfilePage";
import CreateCompanyProfilePage from "@/pages/profile/company/CreateCompanyProfilePage";
import EditCompanyProfilePage from "@/pages/profile/company/EditCompanyProfilePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import InvitationListPage from "@/pages/invitation/InvitationListPage";
import CreateInvitationPage from "@/pages/invitation/CreateInvitationPage";
import EditInvitationPage from "@/pages/invitation/EditInvitationPage";
import MainLayout from "@/components/layout/MainLayout";
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
        <Route
          path="/auth/register-completion"
          element={<RegisterCompletionPage />}
        />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/reset-password/:token"
          element={<ResetPasswordPage />}
        />
      </Route>

      {/* Rotas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/profile/select" element={<ProfileSelectPage />} />
          <Route
            path="/profile/person/new"
            element={<CreatePersonProfilePage />}
          />
          <Route
            path="/profile/person/:id"
            element={<EditPersonProfilePage />}
          />
          <Route
            path="/profile/company/new"
            element={<CreateCompanyProfilePage />}
          />
          <Route
            path="/profile/company/:id"
            element={<EditCompanyProfilePage />}
          />

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
