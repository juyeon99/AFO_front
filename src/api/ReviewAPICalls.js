import apis from "./Apis";

// 특정 향수의 리뷰 목록 조회
export const getReviewsByProductId = async (productId) => {
    try {
        // memberId가 있는 경우 (로그인 상태)
        const auth = JSON.parse(localStorage.getItem('auth'));
        const memberId = auth?.id;

        // QueryParam 방식으로 변경
        const response = await apis.get('/reviews', {
            params: {
                productId: productId,
                memberId: memberId || null
            }
        });
        
        console.log("Reviews response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

// 리뷰 생성
export const createReview = async (reviewData) => {
    try {
        console.log('Creating review with data:', reviewData);
        const response = await apis.post("/reviews", {
            memberId: reviewData.memberId,
            productId: reviewData.productId,
            content: reviewData.content
        });
        console.log("Review creation response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error);
        throw error;
    }
};

// 리뷰 수정
export const updateReview = async (reviewData) => {
    try {
        const response = await apis.put("/reviews", reviewData);
        return response.data;
    } catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
};

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
    try {
        const response = await apis.delete(`/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
};