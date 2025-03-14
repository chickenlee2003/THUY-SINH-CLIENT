import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Khởi tạo instance của axios
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Sử dụng biến môi trường để cấu hình base URL
  headers: {
    "Content-Type": "application/json", // Mặc định sử dụng JSON
  },
  timeout: 10000, // Timeout sau 10 giây
});

// Interceptor xử lý request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Thêm token vào header nếu có
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    // Xử lý lỗi khi gửi request
    return Promise.reject(error);
  }
);

// Interceptor xử lý response
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về dữ liệu từ response
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi từ response
    if (error.response) {
      // Lỗi từ phía server (status code 4xx, 5xx)
      console.log("API Error:", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Lỗi không nhận được phản hồi từ server
      console.log("No response received:", error.request);
      return Promise.reject({ message: "Không có phản hồi từ server." });
    } else {
      // Lỗi khác
      console.log("Request setup error:", error.message);
      return Promise.reject({ message: "Lỗi khi thiết lập request." });
    }
  }
);

export default apiClient;
