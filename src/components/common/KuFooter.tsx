import { Footer } from "flowbite-react";
import { useTranslation } from "react-i18next";

export default function KuFooter() {
  const { t } = useTranslation();

  return (
    <Footer container className="rounded-none bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="mb-4 md:mb-0">
            <a href="/" className="flex items-center space-x-3">
              <img
                src="/src/assets/images/logo.png"
                alt="Logo"
                className="h-8 dark:invert dark:brightness-0 dark:contrast-100"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                {t("footer.brand_name")}
              </span>
            </a>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              {t("footer.description")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <Footer.Title title={t("footer.company_title")} className="text-gray-900 dark:text-white" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {t("footer.company_link1")}
                </Footer.Link>
                <Footer.Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {t("footer.company_link2")}
                </Footer.Link>
                <Footer.Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {t("footer.company_link3")}
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title={t("footer.legal_title")} className="text-gray-900 dark:text-white" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {t("footer.legal_link1")}
                </Footer.Link>
                <Footer.Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {t("footer.legal_link2")}
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title={t("footer.support_title")} className="text-gray-900 dark:text-white" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {t("footer.support_link1")}
                </Footer.Link>
                <Footer.Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {t("footer.support_link2")}
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider className="my-6 border-gray-200 dark:border-gray-700" />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by={t("footer.copyright")}
            year={new Date().getFullYear()}
            className="text-gray-600 dark:text-gray-400"
          />
        </div>
      </div>
    </Footer>
  );
}
