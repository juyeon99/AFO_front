import apis from "./Apis";

// 향수 조회
export const getAllPerfumes = async () => {
    try {
        const response = await apis.get("/perfumes");
        return response.data;
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        throw error;
    }
};

// 향수 수정
export const modifyPerfumes = async (perfumeData) => {
    try {
        // perfumeData에서 id를 추출하여 URL에 포함
        const response = await apis.put(`/perfumes/${perfumeData.id}`, perfumeData);
        return response.data;
    } catch (error) {
        console.error("Error modifying perfume:", error);
        throw error;
    }
};

// 향수 삭제
export const deletePerfumes = async (perfumeId) => {
    try {
        const response = await apis.delete("/perfumes", { data: { id: perfumeId } });
        return response.data;
    } catch (error) {
        console.error("Error deleting perfume:", error);
        throw error;
    }
};

