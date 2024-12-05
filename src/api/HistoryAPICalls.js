import apis from "./Apis";

// 향기 카드 생성 API 호출
export const createScentCardAPI = async (chatId) => {
    const response = await apis.post(`/recommend/history`, null, {
        params: { chatId },
    });
    return response.data; // 응답 데이터 반환
};