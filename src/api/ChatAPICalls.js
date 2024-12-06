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

        // 디버깅용 FormData 로그
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        // 서버 요청
        const response = await apis.post("/chats", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("API 응답 데이터:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    }
};

// 로그인한 회원의 채팅 내역 가져오기
export const getChatHistory = async (memberId) => {
    const response = await apis.get(`/chats/${memberId}`);
    return response.data; // 응답 데이터 반환
};
