import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api" // 백엔드 주소
});

export default api;