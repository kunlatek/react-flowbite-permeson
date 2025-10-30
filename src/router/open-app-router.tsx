import { Routes, Route } from "react-router-dom";
import LoginWithPreRegisterPage from "@/modules/login/pages/login-with-pre-register-page";
import PreRegisterPage from "@/modules/pre-register/pages/pre-register-page";
import HomePage from "@/modules/home/pages/home-page";
import DashboardPage from "@/modules/dashboard/pages/dashboard-page";
import ProfilePage from "@/modules/profile/pages/person-profile-page";
import ProfileTypeSelectionPage from "@/modules/profile/pages/profile-type-selection-page";
import CreateProfilePage from "@/modules/profile/pages/create-profile-page";
import RegisterPage from "@/modules/register/pages/register-page";
import ForgotPasswordPage from "@/modules/reset-password/pages/forgot-password-page";
import ResetPasswordPage from "@/modules/reset-password/pages/reset-password-page";
import SettingsPage from "@/modules/settings/pages/settings-page";
import WorkspacePage from "@/modules/workspace/pages/workspace-page";
import AddMemberPage from "@/modules/workspace/pages/add-member-page";
import { AuthLayout, OpenDashboardLayout, MainLayout } from "@/components/layout";
import ProtectedRoute from "./protected-route";
import { PermissionGuard } from "@/components/auth/permission-guard";

export const OpenAppRouter = () => {
  return (
    <Routes>
      {/* Rotas Públicas com Layout Principal */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Rotas de Autenticação com Layout de Autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginWithPreRegisterPage />} />
        <Route path="/auth/pre-register" element={<PreRegisterPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/reset-password/:token"
          element={<ResetPasswordPage />}
        />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard with its own Layout */}
        <Route element={<OpenDashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/workspace" element={
            <PermissionGuard requiredPermission="canViewWorkspaces">
              <WorkspacePage />
            </PermissionGuard>
          } />
          <Route path="/workspace/add-member" element={
            <PermissionGuard requiredPermission="canCreateWorkspaces">
              <AddMemberPage />
            </PermissionGuard>
          } />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* RAPIDA: ROUTES */}
        </Route>

        {/* Profile Setup Routes */}
        <Route element={<MainLayout />}>
          <Route path="/profile/type-selection" element={<ProfileTypeSelectionPage />} />
          <Route path="/profile/setup" element={<CreateProfilePage />} />
        </Route>

      </Route>
    </Routes>
  );
}
