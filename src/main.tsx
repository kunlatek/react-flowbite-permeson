import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import { BrowserRouter } from "react-router-dom";
import ToastProvider from "./contexts/toast-provider";
import { AccountDeletionProvider } from "./contexts/account-deletion-pprovider";
import { AuthProvider } from "./contexts/auth-provider";
import { ThemeProvider } from "./contexts/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AccountDeletionProvider>
              <App />
            </AccountDeletionProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
