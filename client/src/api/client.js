import axios from "axios";
import { API_BASE_URL } from "../config";
import { getToken, clearToken } from "../auth/token";
import { flash } from "../ui/flash";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const code = err?.response?.data?.code;

    // 🚨 Kick-on-action: ONLY triggers after an API call fails
    if (
      (status === 401 || status === 403) &&
      (code === "USER_BLOCKED" || code === "USER_DELETED")
    ) {
      clearToken();

      const msg =
        code === "USER_BLOCKED"
          ? "Your account was blocked. Please log in again."
          : "Your account was deleted. Please log in again.";

      flash(msg, "warning");

      // Redirect without needing a hook
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  },
);
