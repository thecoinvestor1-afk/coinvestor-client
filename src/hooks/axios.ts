import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

axios.defaults.withCredentials = true;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,

  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (
    config: import("axios").InternalAxiosRequestConfig
  ): import("axios").InternalAxiosRequestConfig => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/sign-in";
      }
    } else if (error.response?.status === 403) {
      console.error("Access forbidden");
    } else if (
      error.response?.status !== undefined &&
      error.response.status >= 500
    ) {
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
