import apis from "./Apis";

// 향수 조회
export const getAllPerfumes = async () => {
    try {
        const response = await apis.get("/products");
        return response.data;
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        throw error;
    }
};

// 향수 수정 
export const modifyPerfumes = async (perfumeData) => {
    try {
        const response = await apis.put(`/products`, perfumeData);
        console.log("히하이ㅏ링라ㅣ아링", response)
        return response.data;
    } catch (error) {
        console.error("Error modifying perfume:", error);
        throw error;
    }
};

// 향수 삭제
export const deletePerfumes = async (productId) => {
    try {
        const response = await apis.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting perfume:", error);
        throw error;
    }
};

// 향수 추가
export const createPerfumes = async (perfumeData) => {
    try {
        const response = await apis.post('/products', perfumeData); 
        return response.data;
    } catch (error) {
        console.error("Error creating perfume:", error);
        throw error;
    }
}

