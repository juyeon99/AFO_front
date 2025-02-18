import apis from "./Apis";

// 캐시를 위한 변수
let perfumesCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

// 향수 조회 - 캐시 적용
export const getAllPerfumes = async () => {
    try {
        const now = Date.now();
        
        // 캐시가 있고 유효한 경우
        if (perfumesCache && (now - lastFetchTime < CACHE_DURATION)) {
            return perfumesCache;
        }

        const response = await apis.get("/products");
        perfumesCache = response.data;
        lastFetchTime = now;
        
        return response.data;
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        throw error;
    }
};

// 향수 상세 조회 - 캐시 적용
// 향수 상세 조회 - 캐시 적용
const detailCache = new Map();

export const getProductDetail = async (productId) => {
    try {
        // 캐시 확인
        const cachedData = detailCache.get(productId);
        if (cachedData) {
            console.log('캐시된 데이터 사용:', cachedData);
            return cachedData;
        }

        console.log(`향수 ID ${productId}에 대한 상세 정보 요청 시작`);

        const [productResponse, similarResponse, reviewsResponse] = await Promise.all([
            apis.get(`/products/${productId}`),
            apis.get(`/products/${productId}/similar`).catch(() => ({ data: [] })),
            apis.get(`/reviews/product/${productId}`).catch(() => ({ data: [] }))
        ]);

        console.log('개별 응답 데이터:', {
            product: productResponse.data,
            similar: similarResponse.data,
            reviews: reviewsResponse.data
        });

        const combinedData = {
            ...productResponse.data,
            similarPerfumes: similarResponse.data,
            reviews: reviewsResponse.data
        };

        console.log('통합된 데이터:', combinedData);

        // 캐시에 저장
        detailCache.set(productId, combinedData);

        return combinedData;
    } catch (error) {
        console.error("향수 상세 정보 조회 실패:", {
            productId,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

// 향수 수정 
export const modifyPerfumes = async (perfumeData) => {
    try {
        const response = await apis.put(`/products`, perfumeData);
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


