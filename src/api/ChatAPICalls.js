import apis from "./Apis";

export const requestRecommendations = async (userInput, imageFile = null, userId = null) => {
    try {
        const formData = new FormData();

        // 필수 필드 추가
        if (!userInput || userInput.trim() === "") {
            throw new Error("userInput이 비어 있습니다. 필수 입력값입니다.");
        }
        formData.append("content", userInput);

        if (userId) {
            formData.append("memberId", userId);
        }

        if (imageFile) {
            formData.append("image", imageFile);
        }

        // 디버깅용 FormData 로그 (파일명만 출력)
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: ${value.name}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        // 서버 요청
        const response = await apis.post("/chats", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("API 응답 데이터:", response.data);
        return response.data;
    } catch (error) {
        // 상세한 에러 메시지 출력
        console.error("추천 요청 중 오류 발생:", error);
        throw new Error(error.response?.data?.message || "추천 요청 중 알 수 없는 오류가 발생했습니다.");
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