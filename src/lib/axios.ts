// src/lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.10.150:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
