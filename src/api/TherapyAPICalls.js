import apis from "./Apis";

export const responseTherapy = async (language, categoryIndex) => {
    try {
        const response = await apis.post("/diffusers", {
            language: language,
            category_index: categoryIndex
        });
        console.log('API Request:', categoryIndex);  // 요청 데이터 확인
        console.log('API Response:', response.data);  // 응답 데이터 확인
        return response.data;
    } catch (error) {
        console.error("Error getting therapy response:", error);
        throw error;
    }
};