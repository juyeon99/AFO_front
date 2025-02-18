import { createActions, handleActions } from "redux-actions";
import { 
    createReview, 
    updateReview, 
    deleteReview 
} from "../api/ReviewAPICalls";
import { getProductDetail } from "../api/PerfumeAPICalls";// 통합 API 호출 함수 import

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
    },
});

// 수정된 Thunk 액션 - 통합 API 사용
export const fetchReviews = (productId) => async (dispatch) => {
    try {
        dispatch(fetchReviewsStart());
        console.log("리뷰 조회 요청 시작 (productId:", productId, ")");
        
        // 통합 API 호출로 변경
        const productDetail = await getProductDetail(productId);
        const reviews = productDetail.reviews || [];
        
        console.log("통합 API에서 추출한 리뷰 데이터:", reviews);
        dispatch(fetchReviewsSuccess(reviews));
    } catch (error) {
        console.error("리뷰 조회 실패:", error);
        dispatch(fetchReviewsFail(error.message || "리뷰 조회 중 오류가 발생했습니다"));
    }
};

// 리뷰 생성 후 통합 API로 최신 리뷰 가져오기
export const createNewReview = (reviewData) => async (dispatch) => {
    try {
        dispatch(createReviewStart());
        await createReview(reviewData);
        
        // 리뷰 생성 후 통합 API로 최신 데이터 조회
        const productDetail = await getProductDetail(reviewData.productId);
        const updatedReviews = productDetail.reviews || [];
        
        dispatch(createReviewSuccess(updatedReviews));
    } catch (error) {
        dispatch(createReviewFail(error.message || "리뷰 생성 실패"));
    }
};

// 리뷰 수정 후 통합 API로 최신 리뷰 가져오기
export const updateExistingReview = (reviewData) => async (dispatch) => {
    try {
        dispatch(updateReviewStart());
        await updateReview(reviewData);
        
        // 통합 API로 최신 데이터 조회
        const productDetail = await getProductDetail(reviewData.productId);
        const updatedReviews = productDetail.reviews || [];
        
        dispatch(updateReviewSuccess(updatedReviews));
    } catch (error) {
        dispatch(updateReviewFail(error.message || "리뷰 수정 실패"));
    }
};

// 리뷰 삭제 후 통합 API로 최신 리뷰 가져오기
export const deleteExistingReview = (reviewId, productId) => async (dispatch) => {
    try {
        dispatch(deleteReviewStart());
        await deleteReview(reviewId);
        
        // 통합 API로 최신 데이터 조회
        const productDetail = await getProductDetail(productId);
        const updatedReviews = productDetail.reviews || [];
        
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
    },
    initialState
);

export const selectReviews = (state) => state.reviews.reviews;
export const selectReviewLoading = (state) => state.reviews.loading;
export const selectReviewError = (state) => state.reviews.error;

export default reviewReducer;