// File: /services/apiClient.js
import axios from "axios";

// Khởi tạo instance của axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Lấy URL từ biến môi trường
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout request sau 10 giây
});

// Thêm interceptor xử lý request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Thêm token nếu có
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm interceptor xử lý response
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
