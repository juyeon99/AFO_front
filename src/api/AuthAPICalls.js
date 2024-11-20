import apis from "./Apis";

// 카카오 로그인 API
export const handleOAuthKakaoAPI = async (code) => {
    const response = await apis.get(`/oauth/login/kakao?code=${code}`);
    return response.data; // 서버 응답 데이터 반환
};