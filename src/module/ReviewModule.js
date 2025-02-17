import { createActions, handleActions } from "redux-actions";
import { 
    getReviewsByProductId, 
    createReview, 
    updateReview, 
    deleteReview 
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
    },
} = createActions({
    REVIEWS: {
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

// Thunk actions
// Thunk 액션
export const fetchReviews = (productId) => async (dispatch) => {
    try {
        dispatch(fetchReviewsStart());
        console.log("리뷰 조회 요청 productId:", productId); // 디버깅용
        const reviews = await getReviewsByProductId(productId);
        console.log("받아온 리뷰 데이터:", reviews); // 디버깅용
        dispatch(fetchReviewsSuccess(reviews));
    } catch (error) {
        console.error("리뷰 조회 실패:", error);
        dispatch(fetchReviewsFail(error.message));
    }
};

export const createNewReview = (reviewData) => async (dispatch) => {
    try {
        dispatch(createReviewStart());
        await createReview(reviewData);
        // 리뷰 생성 후 해당 상품의 리뷰 목록 다시 조회
        const reviews = await getReviewsByProductId(reviewData.productId);
        dispatch(createReviewSuccess(reviews));
    } catch (error) {
        dispatch(createReviewFail(error.message || "리뷰 생성 실패"));
    }
};

export const updateExistingReview = (reviewData) => async (dispatch) => {
    try {
        dispatch(updateReviewStart());
        await updateReview(reviewData);
        // 리뷰 수정 후 해당 상품의 리뷰 목록 다시 조회
        const reviews = await getReviewsByProductId(reviewData.productId);
        dispatch(updateReviewSuccess(reviews));
    } catch (error) {
        dispatch(updateReviewFail(error.message || "리뷰 수정 실패"));
    }
};

export const deleteExistingReview = (reviewId, productId) => async (dispatch) => {
    try {
        dispatch(deleteReviewStart());
        await deleteReview(reviewId);
        // 리뷰 삭제 후 해당 상품의 리뷰 목록 다시 조회
        const reviews = await getReviewsByProductId(productId);
        dispatch(deleteReviewSuccess(reviews));
    } catch (error) {
        dispatch(deleteReviewFail(error.message || "리뷰 삭제 실패"));
    }
};

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