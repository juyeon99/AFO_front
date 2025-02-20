import { createActions, handleActions } from "redux-actions";
import { 
    createReview, 
    updateReview, 
    deleteReview,
    getReviewsByProductId,
    getReviewsByMemberId
} from "../api/ReviewAPICalls";


const initialState = {
    reviews: [],
    loading: false,
    error: null,
};

export const {
    reviews: {
        fetchReviewsStart,
        fetchReviewsSuccess,
        fetchReviewsFail,
        createReviewStart,
        createReviewSuccess,
        createReviewFail,
        updateReviewStart,
        updateReviewSuccess,
        updateReviewFail,
        deleteReviewStart,
        deleteReviewSuccess,
        deleteReviewFail,
        resetReviews,
        fetchMemberReviewsStart,
        fetchMemberReviewsSuccess,
        fetchMemberReviewsFail,
    },
} = createActions({
    REVIEWS: {
        // 액션 정의 (변경 없음)
        FETCH_REVIEWS_START: () => {},
        FETCH_REVIEWS_SUCCESS: (reviews) => reviews,
        FETCH_REVIEWS_FAIL: (error) => error,
        CREATE_REVIEW_START: () => {},
        CREATE_REVIEW_SUCCESS: (review) => review,
        CREATE_REVIEW_FAIL: (error) => error,
        UPDATE_REVIEW_START: () => {},
        UPDATE_REVIEW_SUCCESS: (review) => review,
        UPDATE_REVIEW_FAIL: (error) => error,
        DELETE_REVIEW_START: () => {},
        DELETE_REVIEW_SUCCESS: (reviewId) => reviewId,
        DELETE_REVIEW_FAIL: (error) => error,
        RESET_REVIEWS: () => {},
        FETCH_MEMBER_REVIEWS_START: () => {},
        FETCH_MEMBER_REVIEWS_SUCCESS: (reviews) => reviews,
        FETCH_MEMBER_REVIEWS_FAIL: (error) => error,
    },
});

//Thunk 액션
export const fetchReviews = (productId) => async (dispatch) => {
    try {
        dispatch(fetchReviewsStart());
        
        // 캐시 처리 추가
        const cacheKey = `reviews_${productId}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
            // 캐시된 데이터가 있으면 즉시 반환
            dispatch(fetchReviewsSuccess(JSON.parse(cachedData)));
            
            // 백그라운드에서 최신 데이터 업데이트
            const productDetail = await getReviewsByProductId(productId);
            const reviews = productDetail || [];
            sessionStorage.setItem(cacheKey, JSON.stringify(reviews));
            dispatch(fetchReviewsSuccess(reviews));
        } else {
            // 캐시된 데이터가 없으면 API 호출
            const productDetail = await getReviewsByProductId(productId);
            const reviews = productDetail || [];
            sessionStorage.setItem(cacheKey, JSON.stringify(reviews));
            dispatch(fetchReviewsSuccess(reviews));
        }
    } catch (error) {
        console.error("리뷰 조회 실패:", error);
        dispatch(fetchReviewsFail(error.message || "리뷰 조회 중 오류가 발생했습니다"));
    }
};

export const fetchMemberReviews = (memberId) => async (dispatch) => {
    try {
        dispatch(fetchMemberReviewsStart());
        const reviews = await getReviewsByMemberId(memberId);
        dispatch(fetchMemberReviewsSuccess(reviews));
    } catch (error) {
        dispatch(fetchMemberReviewsFail(error.message));
    }
};

export const createNewReview = (reviewData) => async (dispatch, getState) => {
    try {
        dispatch(createReviewStart());
        
        // 낙관적 업데이트: 먼저 UI 업데이트
        const tempReview = { ...reviewData, id: 'temp_' + Date.now() };
        dispatch(createReviewSuccess([...selectReviews(getState()), tempReview]));
        
        // API 호출
        await createReview(reviewData);
        
        // 실제 데이터로 업데이트
        const productDetail = await getReviewsByProductId(reviewData.productId);
        const updatedReviews = productDetail || [];
        
        // 캐시 업데이트
        sessionStorage.setItem(`reviews_${reviewData.productId}`, JSON.stringify(updatedReviews));
        dispatch(createReviewSuccess(updatedReviews));
    } catch (error) {
        dispatch(createReviewFail(error.message || "리뷰 생성 실패"));
    }
};

// 리뷰 수정 후 리뷰 조회 API로 최신 리뷰 가져오기
export const updateExistingReview = (reviewData) => async (dispatch) => {
    try {
        dispatch(updateReviewStart());
        
        console.log('ReviewModule: Updating review with data:', reviewData); // 데이터 확인용 로그
        
        // API 호출
        await updateReview(reviewData);
        
        // 성공 시 리뷰 목록 업데이트
        const updatedReviews = await getReviewsByMemberId(reviewData.memberId);
        dispatch(updateReviewSuccess(updatedReviews));
        
        return true; // 성공 시 true 반환
    } catch (error) {
        console.error('ReviewModule: Error updating review:', error);
        dispatch(updateReviewFail(error.message || "리뷰 수정 실패"));
        throw error;
    }
};

// 리뷰 삭제 후 리뷰 조회 API로 최신 리뷰 가져오기
export const deleteExistingReview = (reviewId, productId) => async (dispatch, getState) => {
    try {
        dispatch(deleteReviewStart());
        
        // 낙관적 업데이트
        const currentReviews = selectReviews(getState());
        const optimisticReviews = currentReviews.filter(review => review.id !== reviewId);
        dispatch(deleteReviewSuccess(optimisticReviews));
        
        // API 호출
        await deleteReview(reviewId);
        
        // 실제 데이터로 업데이트
        const productDetail = await getReviewsByProductId(productId);
        const updatedReviews = productDetail || [];
        
        // 캐시 업데이트
        sessionStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
        dispatch(deleteReviewSuccess(updatedReviews));
    } catch (error) {
        dispatch(deleteReviewFail(error.message || "리뷰 삭제 실패"));
    }
};

// 리듀서는 변경 없음
const reviewReducer = handleActions(
    {
        [fetchReviewsStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchReviewsSuccess]: (state, { payload }) => ({
            ...state,
            reviews: payload,
            loading: false,
            error: null,
        }),
        [fetchReviewsFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [createReviewSuccess]: (state, { payload }) => ({
            ...state,
            reviews: payload,
            loading: false,
            error: null,
        }),
        [updateReviewSuccess]: (state, { payload }) => ({
            ...state,
            reviews: payload,
            loading: false,
            error: null,
        }),
        [deleteReviewSuccess]: (state, { payload }) => ({
            ...state,
            reviews: payload,
            loading: false,
            error: null,
        }),
        [resetReviews]: (state) => ({
            ...state,
            reviews: [],
            loading: false,
            error: null,
        }),
        [fetchMemberReviewsStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchMemberReviewsSuccess]: (state, { payload }) => ({
            ...state,
            reviews: payload,
            loading: false,
            error: null,
        }),
        [fetchMemberReviewsFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
    },
    initialState
);

export const selectReviews = (state) => state.reviews.reviews;
export const selectReviewLoading = (state) => state.reviews.loading;
export const selectReviewError = (state) => state.reviews.error;

export default reviewReducer;