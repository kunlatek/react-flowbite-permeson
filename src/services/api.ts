import axios from "axios";
import { browser } from "@/utils/browser";
import i18n from "@/i18n";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (browser) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const lang = i18n.language;
      if (lang) {
        config.headers['Accept-Language'] = lang;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    /*if (browser && response && response.status === 401) {
      // Clear storage and redirect to home when token is invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }*/

    return Promise.reject(error);
  }
);

export default api;
