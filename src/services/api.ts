import axios from "axios";
import { browser } from "@/utils/browser";

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
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (browser && response && response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/auth/login");
    }

    return Promise.reject(error);
  }
);

export default api;
