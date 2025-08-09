import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import { BrowserRouter } from "react-router-dom";
import ToastProvider from "./contexts/ToastProvider";
import { AccountDeletionProvider } from "./contexts/AccountDeletionProvider";
import { AuthProvider } from "./contexts/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AccountDeletionProvider>
            <App />
          </AccountDeletionProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
