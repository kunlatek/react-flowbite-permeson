import { Routes, Route } from "react-router-dom";
import LoginPage from "@/modules/login/pages/login-page";
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
import { AuthLayout, DashboardLayout, MainLayout } from "@/components/layout";
import ProtectedRoute from "./protected-route";
import { PermissionGuard } from "@/components/auth/permission-guard";

// Roles
import RolesListPage from "@/modules/roles/pages/roles-list-page";
import RoleCreatePage from "@/modules/roles/pages/role-create-page";
import RoleUpdatePage from "@/modules/roles/pages/role-update-page";

// Invitations
import InvitationListPage from "@/modules/invitation/pages/invitation-list-page";
import InvitationCreatePage from "@/modules/invitation/pages/create-invitation-page";
import InvitationUpdatePage from "@/modules/invitation/pages/update-invitation-page";

export const AppRouter = () => {
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
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard with its own Layout */}
        <Route element={<DashboardLayout />}>
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

          {/* Invitations Routes */}
          <Route path="/invitations" element={
            <PermissionGuard requiredPermission="canViewInvitations">
              <InvitationListPage />
            </PermissionGuard>
          } />
          <Route path="/invitations/new" element={
            <PermissionGuard requiredPermission="canCreateInvitations">
            <InvitationCreatePage />
            </PermissionGuard>
          } />
          <Route path="/invitations/:id/edit" element={
            <PermissionGuard requiredPermission="canEditInvitations">
              <InvitationUpdatePage />
            </PermissionGuard>
          } />
          
          {/* Roles Routes */}
          <Route path="/roles" element={
            <PermissionGuard requiredPermission="canViewRoles">
              <RolesListPage />
            </PermissionGuard>
          } />
          <Route path="/roles/new" element={
            <PermissionGuard requiredPermission="canCreateRoles">
              <RoleCreatePage />
            </PermissionGuard>
          } />
          <Route path="/roles/:id/edit" element={
            <PermissionGuard requiredPermission="canEditRoles">
              <RoleUpdatePage />
            </PermissionGuard>
          } />

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
