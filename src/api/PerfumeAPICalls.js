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
        
        console.log('향수 목록 조회 완료:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching perfumes:", error);
        throw error;
    }
};

// 향수 상세 조회 - 캐시 적용
const detailCache = new Map();

export const getProductDetail = async (productId) => {
    try {
        const now = Date.now();
        
        // 캐시 확인 (유효 시간 체크 추가)
        const cachedData = detailCache.get(productId);
        if (cachedData && (now - cachedData.timestamp < CACHE_DURATION)) {
            console.log(`향수 ID ${productId}: 캐시된 데이터 사용`);
            return cachedData.data;
        }

        console.log(`향수 ID ${productId}에 대한 상세 정보 요청 시작`);

        // 통합 API 호출
        const response = await apis.get(`/products/${productId}`);
        const productDetail = response.data;
        
        // 통합 데이터 구성 (필요한 데이터가 없는 경우 기본값 제공)
        const combinedData = {
            ...productDetail,
            // 응답에 similarPerfumes가 없을 경우를 대비한 기본값 설정
            similarPerfumes: productDetail.similarPerfumes || { note_based: [], design_based: [] }
        };

        console.log('통합된 데이터 구조:', Object.keys(combinedData));
        
        // 캐시에 저장 (타임스탬프 포함)
        detailCache.set(productId, {
            data: combinedData,
            timestamp: now
        });

        return combinedData;
    } catch (error) {
        console.error("향수 상세 정보 조회 실패:", {
            productId,
            error: error.message,
            stack: error.stack
        });
        
        // 에러 발생 시 캐시된 데이터가 있으면 반환 (그레이스풀 디그레이드)
        const cachedData = detailCache.get(productId);
        if (cachedData) {
            console.warn(`API 오류로 인해 캐시된 데이터 사용 (ID: ${productId})`);
            return cachedData.data;
        }
        
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
// export const getSimilarPerfumes = async (productId) => {
//     try {
//         const response = await apis.get(`/products/${productId}/similar`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching similar perfumes:", error);
//         throw error;
//     }
// };


