import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyWorkspaces } from "@/hooks/useMyWorkspaces";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { 
  Navbar, 
  Sidebar, 
  Dropdown, 
  Avatar, 
  Select,
  Button,
  Spinner
} from "flowbite-react";
import { 
  HiMenuAlt1, 
  HiX, 
  HiUser, 
  HiCog, 
  HiLogout,
  HiHome,
  HiUserGroup,
  HiGlobe,
  HiSun,
  HiMoon,
  HiMenu,
  HiDocumentText,
} from "react-icons/hi";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { workspaces, selectedWorkspaceId, loading: workspacesLoading, switchWorkspace } = useMyWorkspaces();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleWorkspaceChange = async (workspaceId: string) => {
    await switchWorkspace(workspaceId);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        aria-label="Dashboard sidebar"
        className={`fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
          sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between py-2 bg-white dark:bg-gray-800 p-4">
          <div>
            <div className="mb-[33px] flex items-center">
              <a href="/" className="flex items-center">
                <img 
                  src="/src/assets/images/logo.png" 
                  alt="Logo" 
                  className="h-8 w-8 mr-3 dark:invert dark:brightness-0 dark:contrast-100" 
                />
                {!sidebarCollapsed && (
                  <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white">
                    Kunlatek
                  </span>
                )}
              </a>
            </div>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {/* Dashboard - sempre visível */}
                <Sidebar.Item href="/dashboard" icon={HiHome}>
                  <div className="truncate w-[150px]">
                    {!sidebarCollapsed && t("dashboard.sidebar.dashboard")}
                  </div>
                </Sidebar.Item>
                
                {/* Profile - sempre visível */}
                <Sidebar.Item href="/profile" icon={HiUser}>
                  <div className="truncate w-[150px]">
                    {!sidebarCollapsed && t("dashboard.sidebar.profile")}
                  </div>
                </Sidebar.Item>
                
                {/* Project Modules Sidebar Items */}
                
                {/* Collaborators */}
                <Sidebar.Item href="/workspace" icon={HiUserGroup}>
                  <div className="truncate w-[150px]">
                    {!sidebarCollapsed && t("dashboard.sidebar.collaborators")}
                  </div>
                </Sidebar.Item>
                
                {/* Settings - sempre visível */}
                <Sidebar.Item href="/settings" icon={HiCog}>
                  <div className="truncate w-[150px]">
                    {!sidebarCollapsed && t("dashboard.sidebar.settings")}
                  </div>
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item 
                href="#" 
                icon={HiLogout}
                onClick={handleLogout}
                className="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                {!sidebarCollapsed && t("dashboard.sidebar.logout")}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </Sidebar>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'ml-0' : 'ml-64'
      }`}>
        {/* Topbar */}
        <Navbar fluid className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 w-full flex-shrink-0">
          <div className="w-full p-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  color="gray"
                  pill
                  size="sm"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors"
                  onClick={toggleSidebar}
                  title={sidebarCollapsed ? t("dashboard.sidebar.show") : t("dashboard.sidebar.hide")}
                >
                  <span className="sr-only">
                    {sidebarCollapsed ? t("dashboard.sidebar.show") : t("dashboard.sidebar.hide")}
                  </span>
                  {sidebarCollapsed ? <HiMenuAlt1 className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                {/* Workspace Selector */}
                {workspacesLoading ? (
                  <div className="w-48 flex items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <Select 
                    value={selectedWorkspaceId} 
                    onChange={(e) => handleWorkspaceChange(e.target.value)}
                    className="w-48"
                  >
                    {workspaces.map((workspace) => (
                      <option key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </option>
                    ))}
                  </Select>
                )}

                {/* User Menu */}
                <Dropdown 
                  arrowIcon={false} 
                  inline 
                  label={
                    <Avatar 
                      alt="User settings" 
                      rounded 
                      size="sm" 
                      className="w-8 h-8"
                    />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">{user?.email}</span>
                    <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                      {user?.activeRole === 'company' ? 'Empresa' : 'Pessoa'}
                    </span>
                  </Dropdown.Header>

                  {/* Language Options */}
                  <Dropdown.Item icon={HiGlobe} className="[&>svg]:text-gray-600 [&>svg]:dark:text-gray-300">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-gray-900 dark:text-white">{t("dashboard.topbar.language")}</span>
                      <div className="flex gap-1 ml-2">
                        <button 
                          onClick={() => changeLanguage('pt')} 
                          className={`px-2 py-1 text-xs rounded ${
                            i18n.language === 'pt' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          PT
                        </button>
                        <button 
                          onClick={() => changeLanguage('en')} 
                          className={`px-2 py-1 text-xs rounded ${
                            i18n.language === 'en' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          EN
                        </button>
                        <button 
                          onClick={() => changeLanguage('es')} 
                          className={`px-2 py-1 text-xs rounded ${
                            i18n.language === 'es' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          ES
                        </button>
                      </div>
                    </div>
                  </Dropdown.Item>

                  {/* Theme Toggle */}
                  <Dropdown.Item icon={isDarkMode ? HiSun : HiMoon} onClick={toggleTheme} className="[&>svg]:text-gray-600 [&>svg]:dark:text-gray-300">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-gray-900 dark:text-white">
                          {isDarkMode ? t("dashboard.topbar.theme_light") : t("dashboard.topbar.theme_dark")}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {isDarkMode ? t("dashboard.topbar.theme_current_dark") : t("dashboard.topbar.theme_current_light")}
                      </div>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Divider />
                  <Dropdown.Item icon={HiLogout} onClick={handleLogout} className="text-red-600 dark:text-red-400 [&>svg]:text-red-600 [&>svg]:dark:text-red-400">
                    {t("dashboard.topbar.logout")}
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>
          </div>
        </Navbar>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 sm:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
