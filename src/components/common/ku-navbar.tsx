import { Navbar, Button, Dropdown, Sidebar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useAccountDeletion } from "@/hooks/use-account-deletion";
import { useTheme } from "@/hooks/use-theme";
import { KuButton } from "@/components/form";
import { KuModal } from "@/components/common/ku-modal";
import { useState } from "react";
import {
  HiOutlineMenu,
  HiX,
  HiLogout,
  HiViewGrid,
  HiUser,
  HiCog,
  HiSwitchHorizontal,
  HiSun,
  HiMoon,
} from "react-icons/hi";

const locales = {
  en: "English (US)",
  pt: "Português (BR)",
  es: "Español",
};

export const KuNavbar = () => {
  const { isAuthenticated, logout, user, switchRole } = useAuth();
  const { isDeleted } = useAccountDeletion();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/auth/login");
  };

  const confirmLogout = () => {
    setIsDrawerOpen(false);
    setShowLogoutModal(true);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const activeRoleName =
    user?.activeRole === "company"
      ? "Empresa"
      : user?.activeRole === "person"
      ? "Pessoa"
      : "";

  return (
    <>
      <Navbar fluid rounded className="py-3 px-4">
        <Navbar.Brand></Navbar.Brand>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-2">
          {/* Language Selector */}
          <Dropdown
            inline
            label={i18n.language.split("-")[0].toUpperCase()}
            renderTrigger={() => (
              <Button outline className="!p-2">
                {i18n.language.split("-")[0].toUpperCase()}
              </Button>
            )}
            className="dark:bg-gray-800 dark:border-gray-700"
          >
            <Dropdown.Header className="dark:bg-gray-800 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white font-medium">Select Language</span>
            </Dropdown.Header>
            {Object.entries(locales).map(([value, name]) => (
              <Dropdown.Item 
                key={value} 
                onClick={() => changeLanguage(value)}
                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800"
              >
                <span className="text-gray-900 dark:text-white">{name}</span>
              </Dropdown.Item>
            ))}
          </Dropdown>

          {/* Theme Selector */}
          <Dropdown
            inline
            label={
              <Button outline className="!p-2">
                {isDarkMode ? (
                  <HiSun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <HiMoon className="h-4 w-4 text-gray-600" />
                )}
              </Button>
            }
            renderTrigger={() => (
              <Button outline className="!p-2">
                {isDarkMode ? (
                  <HiSun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <HiMoon className="h-4 w-4 text-gray-600" />
                )}
              </Button>
            )}
          >
            <Dropdown.Header>
              <span>{t("dashboard.topbar.theme")}</span>
            </Dropdown.Header>
            <Dropdown.Item 
              icon={isDarkMode ? HiSun : HiMoon} 
              onClick={toggleTheme}
              className="[&>svg]:text-gray-600 [&>svg]:dark:text-gray-300"
            >
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
          </Dropdown>

          {isAuthenticated ? (
            isDeleted ? (
              <KuButton
                id="nav-logout-deleted"
                type="button"
                actionType="button"
                onClick={() => setShowLogoutModal(true)}
                label={t("nav.logout")}
                variant="danger"
              />
            ) : (
              <Button
                color="light"
                size="sm"
                onClick={() => setIsDrawerOpen(true)}
                className="mr-2"
              >
                <HiOutlineMenu className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">{t("nav.menu")}</span>
              </Button>
            )
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <KuButton
                id="nav-login"
                type="button"
                actionType="link"
                href="/auth/login"
                label={t("nav.login")}
              />
            </div>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          {!isAuthenticated && (
            <>
              <Navbar.Link as={Link} to="/auth/login" className="md:hidden">
                {t("nav.login")}
              </Navbar.Link>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>

      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-gray-900/50"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t("nav.menu")}
              </h5>
              <Button
                color="light"
                className="!p-1"
                onClick={() => setIsDrawerOpen(false)}
              >
                <HiX className="w-6 h-6" />
              </Button>
            </div>
            <Sidebar
              aria-label="Sidebar"
              className="h-full py-4 overflow-y-auto"
            >
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item
                    icon={HiViewGrid}
                    as={Link}
                    to="/dashboard"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Dashboard
                  </Sidebar.Item>
                  <Sidebar.Item
                    icon={HiUser}
                    as={Link}
                    to="/profile/person/new" // This should be dynamic later
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Meu Perfil
                  </Sidebar.Item>
                  <Sidebar.Item
                    icon={HiCog}
                    as={Link}
                    to="/settings"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Configurações
                  </Sidebar.Item>
                </Sidebar.ItemGroup>

                {user &&
                  user.availableRoles &&
                  user.availableRoles.length > 1 && (
                    <Sidebar.ItemGroup>
                      <Sidebar.Item>
                        <span className="font-semibold">
                          Trocar Papel (Ativo: {activeRoleName})
                        </span>
                      </Sidebar.Item>
                      {user.availableRoles
                        .filter((role) => role !== user.activeRole)
                        .map((role) => (
                          <Sidebar.Item
                            key={role}
                            icon={HiSwitchHorizontal}
                            onClick={() => switchRole(role)}
                            className="cursor-pointer"
                          >
                            Ativar {role === "company" ? "Empresa" : "Pessoa"}
                          </Sidebar.Item>
                        ))}
                    </Sidebar.ItemGroup>
                  )}

                <Sidebar.ItemGroup>
                  <Sidebar.Item
                    icon={HiLogout}
                    onClick={confirmLogout}
                    className="cursor-pointer text-red-600 dark:text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                  >
                    {t("nav.logout")}
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>
        </>
      )}

      <KuModal
        show={showLogoutModal}
        title="Confirmar Logout"
        onClose={() => setShowLogoutModal(false)}
      >
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">
            Tem certeza que deseja sair?
          </h3>
          <div className="flex justify-center gap-4">
            <KuButton
              id="cancel-logout"
              type="button"
              actionType="button"
              variant="secondary"
              onClick={() => setShowLogoutModal(false)}
              label="Cancelar"
            />
            <KuButton
              id="confirm-logout"
              type="button"
              actionType="button"
              variant="primary"
              onClick={handleLogout}
              label="Sim, sair"
            />
          </div>
        </div>
      </KuModal>
    </>
  );
};
