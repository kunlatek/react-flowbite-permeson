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
import WorkspacePage from "@/pages/workspace/WorkspacePage";
import MainLayout from "@/components/layout/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

// Posts
import PostsListPage from "@/pages/posts/PostsListPage";
import PostCreatePage from "@/pages/posts/PostCreatePage";
import PostEditPage from "@/pages/posts/PostEditPage";

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
          <Route path="/workspace" element={<WorkspacePage />} />
          
          {/* Posts Routes */}
          <Route path="/posts" element={<PostsListPage />} />
          <Route path="/posts/new" element={<PostCreatePage />} />
          <Route path="/posts/:id/edit" element={<PostEditPage />} />
        </Route>

        {/* Other Protected Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
