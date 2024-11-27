import { createActions, handleActions } from "redux-actions";
import { getAllPerfumes } from "../api/PerfumeAPICalls";

// 초기 상태
const initialState = {
    perfumes: [], // 향수 목록
    loading: false, // 로딩 상태
    error: null, //에러 메시지
};

// 액션 생성
export const {
    perfumes: {fetchPerfumeStart, fetchPerfumeSuccess, fetchPerfumeFail },
} = createActions({
    PERFUMES: {
        FETCH_PERFUME_START: () => {},
        FETCH_PERFUME_SUCCESS: (perfumes)  => perfumes, // 요청 성공
        FETCH_PERFUME_FAIL: (error) => error,
    },
});

// redux thunk
export const fetchPerfumes = () => async (dispatch) => {
    try{
        dispatch(fetchPerfumeStart());
        const perfumes = await getAllPerfumes();
        dispatch(fetchPerfumeSuccess(perfumes));
    } catch (error) {
        const errorMessage = 
        error.response?.data?.message || error.message || "향수 목록 불러오기 실패";
        dispatch(fetchPerfumeFail(errorMessage));
    }
};

// 리듀서
const perfumeReducer = handleActions(
    {
        [fetchPerfumeStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchPerfumeSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: payload, // 향수 목록
            loading: false,
            error: null,
        }),
        [fetchPerfumeFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload, // 에러 메시지
        }),
    },
    initialState
);


export const selectPerfumes = (state) => state.perfumes.perfumes;
export const selectLoading = (state) => state.perfumes.loading;
export const selectError = (state) => state.perfumes.error;

export default perfumeReducer;
