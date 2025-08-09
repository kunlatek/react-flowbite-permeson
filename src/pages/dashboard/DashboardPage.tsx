import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { 
  Navbar, 
  Sidebar, 
  Dropdown, 
  Avatar, 
  Select,
  Card,
  Button
} from "flowbite-react";
import { 
  HiMenuAlt1, 
  HiX, 
  HiUser, 
  HiCog, 
  HiLogout,
  HiHome,
  HiMail,
  HiGlobe,
  HiSun,
  HiMoon
} from "react-icons/hi";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('personal');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme switching logic
    console.log('Theme toggled:', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        aria-label="Dashboard sidebar"
        className={`fixed left-0 top-0 z-40 h-screen transition-transform ${
          sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        } sm:translate-x-0`}
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <Sidebar.Logo href="/" img="/src/assets/images/logo.png" imgAlt="Logo">
              {!sidebarCollapsed && <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                Kunlatek
              </span>}
            </Sidebar.Logo>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item href="/dashboard" icon={HiHome} active>
                  {t("dashboard.sidebar.dashboard")}
                </Sidebar.Item>
                <Sidebar.Item href="/profile" icon={HiUser}>
                  {t("dashboard.sidebar.profile")}
                </Sidebar.Item>
                <Sidebar.Item href="/invitations" icon={HiMail}>
                  {t("dashboard.sidebar.invitations")}
                </Sidebar.Item>
                <Sidebar.Item href="/settings" icon={HiCog}>
                  {t("dashboard.sidebar.settings")}
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
                {t("dashboard.sidebar.logout")}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </Sidebar>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'sm:ml-0' : 'sm:ml-64'}`}>
        {/* Topbar */}
        <Navbar fluid className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="w-full p-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  color="gray"
                  pill
                  size="sm"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  onClick={toggleSidebar}
                >
                  <span className="sr-only">Open sidebar</span>
                  {sidebarCollapsed ? <HiX className="h-6 w-6" /> : <HiMenuAlt1 className="h-6 w-6" />}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                {/* Workspace Selector */}
                <Select
                  value={selectedWorkspace}
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                  className="w-48"
                >
                  <option value="personal">{t("dashboard.topbar.workspace_personal")}</option>
                  <option value="company">{t("dashboard.topbar.workspace_company")}</option>
                </Select>

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
                    <span className="block text-sm font-medium">{user?.email}</span>
                    <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                      {user?.activeRole === 'company' ? 'Empresa' : 'Pessoa'}
                    </span>
                  </Dropdown.Header>
                  
                  {/* Language Options */}
                  <Dropdown.Item icon={HiGlobe}>
                    <div className="flex items-center justify-between w-full">
                      <span>{t("dashboard.topbar.language")}</span>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => changeLanguage('pt')}
                          className={`px-2 py-1 text-xs rounded ${
                            i18n.language === 'pt' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          PT
                        </button>
                        <button
                          onClick={() => changeLanguage('en')}
                          className={`px-2 py-1 text-xs rounded ${
                            i18n.language === 'en' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          EN
                        </button>
                        <button
                          onClick={() => changeLanguage('es')}
                          className={`px-2 py-1 text-xs rounded ${
                            i18n.language === 'es' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          ES
                        </button>
                      </div>
                    </div>
                  </Dropdown.Item>

                  {/* Theme Toggle */}
                  <Dropdown.Item icon={isDarkMode ? HiSun : HiMoon} onClick={toggleTheme}>
                    <div className="flex items-center justify-between w-full">
                      <span>{t("dashboard.topbar.theme")}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isDarkMode ? t("dashboard.topbar.theme_light") : t("dashboard.topbar.theme_dark")}
                      </span>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Divider />
                  <Dropdown.Item icon={HiLogout} onClick={handleLogout} className="text-red-600">
                    {t("dashboard.topbar.logout")}
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>
          </div>
        </Navbar>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Welcome Section */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
                {t("dashboard.welcome_title")}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t("dashboard.welcome_message")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
