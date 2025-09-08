import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true, // important for cookies
});

// Optional: response interceptor (can add refresh-token logic here later)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can globally catch 401 here if needed
    return Promise.reject(error);
  }
);

export default api;
