import axios from "axios";

// Axios 인스턴스 생성
const apis = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080", // 공통 URL 설정
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
    console.log("Request Sent:", config); // 요청 로그
    return config;
});

// 응답 인터셉터: 에러 처리
apis.interceptors.response.use(
    (response) => response, // 정상 응답
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized: Token expired or invalid");
            localStorage.removeItem("token"); // 토큰 제거
            window.location.href = "/login"; // 로그인 페이지로 이동
        }
        return Promise.reject(error); // 다른 에러 반환
    }
);

export default apis;
