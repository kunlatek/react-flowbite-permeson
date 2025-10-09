import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/login/LoginPage";
import HomePage from "@/pages/home/HomePage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import ProfileTypeSelectionPage from "@/pages/profile/ProfileTypeSelectionPage";
import ProfileSetupPage from "@/pages/profile/ProfileSetupPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PreRegisterPage from "@/pages/auth/PreRegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import WorkspacePage from "@/pages/workspace/WorkspacePage";
import AddMemberPage from "@/pages/workspace/AddMemberPage";
import MainLayout from "@/components/layout/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

// Posts
import PostsListPage from "@/pages/posts/PostsListPage";
import PostCreatePage from "@/pages/posts/PostCreatePage";
import PostEditPage from "@/pages/posts/PostEditPage";
import PostViewPage from "@/pages/posts/PostViewPage";

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
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/workspace/add-member" element={<AddMemberPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Posts Routes */}
          <Route path="/posts" element={<PostsListPage />} />
          <Route path="/posts/new" element={<PostCreatePage />} />
          <Route path="/posts/:id" element={<PostViewPage />} />
          <Route path="/posts/:id/edit" element={<PostEditPage />} />
        </Route>

        {/* Profile Setup Routes */}
        <Route element={<MainLayout />}>
          <Route path="/profile/type-selection" element={<ProfileTypeSelectionPage />} />
          <Route path="/profile/setup" element={<ProfileSetupPage />} />
        </Route>

      </Route>
    </Routes>
  );
}
