import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:3000/api" // 로컬 백엔드 주소
    baseURL: import.meta.env.VITE_API_BASE_URL + "/api" // 백엔드 주소
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 로그인 시 저장된 JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;