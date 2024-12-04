import apis from "./Apis";

export const requestRecommendations = async (userInput, imageFile = null, userId = null) => {
    try {
        const formData = new FormData();
        formData.append("user_input", userInput);
        
        // userId가 존재할 경우에만 추가
        if (userId) {
            formData.append("userId", userId);
        }
        
        if (imageFile) {
            formData.append("image", imageFile);
        }
        
        // 디버깅용: FormData의 내용을 출력
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        const response = await apis.post("/recommend", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("API 응답:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    } 
};

// 로그인한 회원의 채팅 내역 가져오기
export const getChatHistory = async (memberId) => {
    const response = await apis.get(`/recommend/${memberId}`);
    return response.data; // 응답 데이터 반환
};
