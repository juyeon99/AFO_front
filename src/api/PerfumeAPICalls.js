import apis from "./Apis";

// 향수 조회
export const getAllPerfumes = async () => {
    try {
        const response = await apis.get("/products");
        console.log("향수 조회 응답:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        throw error;
    }
};

// 향수 상세 조회 (유사 향수와 리뷰 포함)
export const getProductDetail = async (productId) => {
    try {
        // 병렬로 모든 요청을 실행
        const [productResponse, similarResponse, reviewsResponse] = await Promise.all([
            apis.get(`/products/${productId}`),
            apis.get(`/products/${productId}/similar`).catch(error => {
                console.warn("유사 향수 조회 실패:", error);
                return { data: [] }; // 실패시 빈 배열 반환
            }),
            apis.get(`/reviews/product/${productId}`).catch(error => {
                console.warn("리뷰 조회 실패:", error);
                return { data: [] }; // 실패시 빈 배열 반환
            })
        ]);

        // 응답 데이터 통합
        const combinedData = {
            ...productResponse.data,
            similarPerfumes: similarResponse.data,
            reviews: reviewsResponse.data
        };

        console.log("통합된 향수 데이터:", combinedData);
        return combinedData;

    } catch (error) {
        console.error("Error fetching product detail:", error);
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

// 유사 향수 조회
export const getSimilarPerfumes = async (productId) => {
    try {
        const response = await apis.get(`/products/${productId}/similar`);
        return response.data;
    } catch (error) {
        console.error("Error fetching similar perfumes:", error);
        throw error;
    }
};


