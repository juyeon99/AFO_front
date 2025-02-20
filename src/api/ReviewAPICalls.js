import apis from "./Apis";

// 특정 향수의 리뷰 목록 조회
export const getReviewsByProductId = async (productId) => {
    try {
        const response = await apis.get(`/reviews/product/${productId}`);
        console.log("response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

// 특정 회원의 리뷰 목록 조회
export const getReviewsByMemberId = async (memberId) => {
    try {
        // memberId 유효성 검사
        if (!memberId) {
            throw new Error('Invalid memberId');
        }

        console.log('Requesting reviews with memberId:', memberId);

        const response = await apis.get(`/reviews/member/${memberId}`);
        console.log("Member reviews response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching member reviews:", error);
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
        console.log('Updating review with data:', reviewData); // 데이터 확인용 로그
        const response = await apis.put(`/reviews`, {
            content: reviewData.content,
            productId: reviewData.productId,
            memberId: reviewData.memberId
        });
        console.log('Update response:', response.data); // 응답 확인용 로그
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