import { Routes, Route } from "react-router-dom";
import LoginPage from "@/features/login/pages/login-page";
import HomePage from "@/features/home/pages/home-page";
import DashboardPage from "@/features/dashboard/pages/dashboard-page";
import ProfilePage from "@/features/profile/pages/person-profile-page";
import ProfileTypeSelectionPage from "@/features/profile/pages/profile-type-selection-page";
import CreateProfilePage from "@/features/profile/pages/create-profile-page";
import RegisterPage from "@/features/register/pages/register-page";
import PreRegisterPage from "@/features/pre-register/pages/pre-register-page";
import ForgotPasswordPage from "@/features/reset-password/pages/forgot-password-page";
import ResetPasswordPage from "@/features/reset-password/pages/reset-password-page";
import SettingsPage from "@/pages/settings/SettingsPage";
import WorkspacePage from "@/features/workspace/pages/workspace.page";
import AddMemberPage from "@/features/workspace/pages/add-member.page";
import MainLayout from "@/components/layout/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import PermissionGuard from "@/components/auth/PermissionGuard";

// Posts
import PostsListPage from "@/pages/posts/PostsListPage";
import PostCreatePage from "@/pages/posts/PostCreatePage";
import PostEditPage from "@/pages/posts/PostEditPage";
import PostViewPage from "@/pages/posts/PostViewPage";

// Roles
import RolesListPage from "@/pages/roles/RolesListPage";
import RoleCreatePage from "@/pages/roles/RoleCreatePage";
import RoleEditPage from "@/pages/roles/RoleEditPage";

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
          
          {/* Posts Routes */}
          <Route path="/posts" element={
            <PermissionGuard requiredPermission="canViewPosts">
              <PostsListPage />
            </PermissionGuard>
          } />
          <Route path="/posts/new" element={
            <PermissionGuard requiredPermission="canCreatePosts">
              <PostCreatePage />
            </PermissionGuard>
          } />
          <Route path="/posts/:id" element={
            <PermissionGuard requiredPermission="canViewPosts">
              <PostViewPage />
            </PermissionGuard>
          } />
          <Route path="/posts/:id/edit" element={
            <PermissionGuard requiredPermission="canEditPosts">
              <PostEditPage />
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
              <RoleEditPage />
            </PermissionGuard>
          } />
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
