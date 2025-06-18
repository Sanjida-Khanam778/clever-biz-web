// src/lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.10.150:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
