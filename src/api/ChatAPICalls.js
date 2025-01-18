import apis from "./Apis";

// 채팅 추천 요청
export const requestRecommendations = async (userInput, imageFile = null, userId = null) => {
    console.log('ChatAPICalls에서 받은 데이터:', {
        userInput: userInput,
        imageUrl: imageFile,
        userId: userId
    });
    try {
        if (!imageFile && (!userInput || !userInput.trim())) {
            throw new Error("이미지 또는 사용자 입력 중 하나는 필수입니다.");
        }

        const formData = new FormData();
        formData.append("content", userInput);
        if (imageFile) formData.append("image", imageFile);
        if (userId) formData.append("memberId", userId);

        const response = await apis.post("/chats", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("추천 요청 중 오류 발생:", error);
        throw new Error(error.response?.data?.message || "추천 요청 중 오류가 발생했습니다.");
    }
};
// 로그인한 회원의 채팅 내역 가져오기
export const getChatHistory = async (memberId) => {
    try {
        const response = await apis.get(`/chats/${memberId}`);
        return response.data; // 응답 데이터 반환
    } catch (error) {
        // 채팅 내역 가져오기 오류 처리
        console.error("채팅 내역 가져오기 오류:", error);
        throw new Error(error.response?.data?.message || "채팅 내역을 가져오는 중 오류가 발생했습니다.");
    }
};