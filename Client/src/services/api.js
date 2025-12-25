import axios from "axios";
import { getStoredTokens, storeTokens, clearTokens } from "../utils/tokenManager";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

let isRefreshing = false;
let failedRequestsQueue = [];

// Procesa las solicitudes en cola después de la renovación del token
const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedRequestsQueue = [];
};

// Interceptor de solicitud para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getStoredTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores y refresh automático
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = getStoredTokens();

      if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      const response = await axios.post(
        "http://localhost:3000/user/refresh",
        { refreshToken }
      );

      const { accessToken } = response.data;

      storeTokens(accessToken, refreshToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();

      window.dispatchEvent(new CustomEvent("session-expired"));

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
