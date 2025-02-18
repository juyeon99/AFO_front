import { createActions, handleActions } from "redux-actions";
import { getBookmarkedPerfumes, toggleBookmark, deleteBookmark } from "../api/BookmarkAPICalls";

const initialState = {
    bookmarkedPerfumes: [],
    recommendedPerfumes: [],
    loading: false,
    error: null,
};

export const {
    bookmark: {
        fetchBookmarkStart,
        fetchBookmarkSuccess,
        fetchBookmarkFail,
        toggleBookmarkStart,
        toggleBookmarkSuccess,
        toggleBookmarkFail,
        deleteBookmarkStart,
        deleteBookmarkSuccess,
        deleteBookmarkFail,
    },
} = createActions({
    BOOKMARK: {
        FETCH_BOOKMARK_START: () => ({}),
        FETCH_BOOKMARK_SUCCESS: (data) => (data),
        FETCH_BOOKMARK_FAIL: (error) => (error),
        TOGGLE_BOOKMARK_START: () => ({}),
        TOGGLE_BOOKMARK_SUCCESS: (data) => (data),
        TOGGLE_BOOKMARK_FAIL: (error) => (error),
        DELETE_BOOKMARK_START: () => ({}),
        DELETE_BOOKMARK_SUCCESS: (productId) => (productId),
        DELETE_BOOKMARK_FAIL: (error) => (error),
    },
});

// Thunk 액션 생성자
export const fetchBookmarks = (memberId) => async (dispatch) => {
    try {
        dispatch(fetchBookmarkStart());
        const data = await getBookmarkedPerfumes(memberId);
        dispatch(fetchBookmarkSuccess(data));
    } catch (error) {
        dispatch(fetchBookmarkFail(error.message));
    }
};

export const handleToggleBookmark = (productId, memberId) => async (dispatch) => {
    try {
        dispatch(toggleBookmarkStart());
        const data = await toggleBookmark(productId, memberId);
        dispatch(toggleBookmarkSuccess(data));
    } catch (error) {
        dispatch(toggleBookmarkFail(error.message));
    }
};

export const handleDeleteBookmark = (productId, memberId) => async (dispatch) => {
    try {
        dispatch(deleteBookmarkStart());
        await deleteBookmark(productId, memberId);
        dispatch(deleteBookmarkSuccess(productId));
    } catch (error) {
        dispatch(deleteBookmarkFail(error.message));
    }
};

const bookmarkReducer = handleActions(
    {
        [fetchBookmarkStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchBookmarkSuccess]: (state, { payload }) => ({
            ...state,
            bookmarkedPerfumes: payload.bookmarkedPerfumes,
            recommendedPerfumes: payload.recommendedPerfumes,
            loading: false,
        }),
        [fetchBookmarkFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        // ... 다른 리듀서들
    },
    initialState
);

export default bookmarkReducer;