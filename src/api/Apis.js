import axios from "axios";

// Axios 인스턴스 생성
const apis = axios.create({
    baseURL: "http://localhost:8080", // 공통 URL 설정
    headers: {
        "Content-Type": "application/json", // JSON 형식
    },
});

// 요청 인터셉터: 인증 토큰 추가
apis.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // 토큰 가져오기
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`; // Authorization 헤더 추가
    }
    return config;
});

export default apis;
