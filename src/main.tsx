import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import ToastProvider from "./contexts/ToastProvider";
import { AccountDeletionProvider } from "./contexts/AccountDeletionProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AccountDeletionProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AccountDeletionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
