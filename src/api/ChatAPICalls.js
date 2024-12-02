import apis from "./Apis";

export const requestRecommendations = async (userInput, imageFile = null) => {
    try {
        const formData = new FormData();
        formData.append("user_input", userInput);
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
