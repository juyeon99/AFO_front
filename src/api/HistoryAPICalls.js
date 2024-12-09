import apis from "./Apis";

// 향기 카드 생성 API 호출
export const createScentCardAPI = async (chatId) => {
    const response = await apis.post(`/histories`, null, {
        params: { chatId },
    });
    return response.data; // 응답 데이터 반환
};

// 향기 카드 가져오기 API 호출
export const fetchHistoryAPI = async (memberId) => {
    const response = await apis.get(`/histories/${memberId}`);
    return response.data; // 서버에서 받은 데이터 반환
};