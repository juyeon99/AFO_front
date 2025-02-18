import { createActions, handleActions } from "redux-actions";
import { getAllPerfumes, modifyPerfumes, deletePerfumes, createPerfumes, getProductDetail } from "../api/PerfumeAPICalls";

// 초기 상태
const initialState = {
    perfumes: [], // 향수 목록
    loading: false, // 로딩 상태
    error: null, //에러 메시지
};

// 액션 생성
export const {
    perfumes: { fetchPerfumeStart,
        fetchPerfumeSuccess,
        fetchPerfumeFail,
        modifyPerfumeStart,
        modifyPerfumeSuccess,
        modifyPerfumeFail,
        deletePerfumeStart,
        deletePerfumeSuccess,
        deletePerfumeFail,
        createPerfumeStart,
        createPerfumeSuccess,
        createPerfumeFail,
        fetchPerfumeByIdStart,
        fetchPerfumeByIdSuccess,
        fetchPerfumeByIdFail,

    },
} = createActions({
    PERFUMES: {
        FETCH_PERFUME_START: () => { },
        FETCH_PERFUME_SUCCESS: (perfumes) => perfumes,
        FETCH_PERFUME_FAIL: (error) => error,
        MODIFY_PERFUME_START: () => { },
        MODIFY_PERFUME_SUCCESS: (perfume) => perfume,
        MODIFY_PERFUME_FAIL: (error) => error,
        DELETE_PERFUME_START: () => { },
        DELETE_PERFUME_SUCCESS: (perfumeId) => perfumeId,
        DELETE_PERFUME_FAIL: (error) => error,
        CREATE_PERFUME_START: () => { },
        CREATE_PERFUME_SUCCESS: (perfume) => perfume,
        CREATE_PERFUME_FAIL: (error) => error,
        FETCH_PERFUME_BY_ID_START: () => { },
        FETCH_PERFUME_BY_ID_SUCCESS: (perfume) => perfume,
        FETCH_PERFUME_BY_ID_FAIL: (error) => error,
    },
});

// redux thunk
export const fetchPerfumes = () => async (dispatch) => {
    try {
        dispatch(fetchPerfumeStart());
        const perfumes = await getAllPerfumes();
        dispatch(fetchPerfumeSuccess(perfumes));
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "향수 목록 불러오기 실패";
        dispatch(fetchPerfumeFail(errorMessage));
    }
};

export const modifyPerfume = (perfumeData) => async (dispatch) => {
    try {
        dispatch(modifyPerfumeStart());
        const updatedPerfume = await modifyPerfumes(perfumeData);
        dispatch(modifyPerfumeSuccess(updatedPerfume));
    } catch (error) {
        dispatch(modifyPerfumeFail(error.message || "향수 수정 실패"));
    }
};

export const deletePerfume = (perfumeId) => async (dispatch) => {
    try {
        dispatch(deletePerfumeStart());
        await deletePerfumes(perfumeId);
        dispatch(deletePerfumeSuccess(perfumeId));
    } catch (error) {
        dispatch(deletePerfumeFail(error.message || "향수 삭제 실패"));
    }
};

export const createPerfume = (perfumeData) => async (dispatch) => {
    try {
        dispatch(createPerfumeStart());
        const newPerfume = await createPerfumes(perfumeData); // API 호출
        dispatch(createPerfumeSuccess(newPerfume));
    } catch (error) {
        dispatch(createPerfumeFail(error.message || "향수 추가 실패"));
    }
};

export const fetchPerfumeById = (productId) => async (dispatch, getState) => {
    try {
        // 이미 해당 향수 데이터가 있는지 확인
        const state = getState();
        const existingPerfume = state.perfumes.perfumes.find(
            p => p.id === parseInt(productId)
        );

        // 이미 데이터가 있고 필요한 모든 정보가 포함되어 있다면 새로운 요청을 하지 않음
        if (existingPerfume && existingPerfume.reviews) {
            return;
        }

        dispatch(fetchPerfumeByIdStart());
        const perfume = await getProductDetail(productId);
        dispatch(fetchPerfumeByIdSuccess(perfume));
    } catch (error) {
        dispatch(fetchPerfumeByIdFail(error.message || "향수 상세 정보 불러오기 실패"));
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
        [modifyPerfumeStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [modifyPerfumeSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: state.perfumes.map((perfume) =>
                perfume.id === payload.id ? payload : perfume
            ),
            loading: false,
            error: null,
        }),
        [modifyPerfumeFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [deletePerfumeStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [deletePerfumeSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: state.perfumes.filter((perfume) => perfume.id !== payload),
            loading: false,
            error: null,
        }),
        [deletePerfumeFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [createPerfumeStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [createPerfumeSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: [...state.perfumes, payload], // 새로 추가된 향수 포함
            loading: false,
            error: null,
        }),
        [createPerfumeFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [fetchPerfumeByIdStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchPerfumeByIdSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: state.perfumes.some(p => p.id === payload.id)
                ? state.perfumes.map(p => (p.id === payload.id ? payload : p))
                : [...state.perfumes, payload],
            loading: false,
            error: null,
        }),
        [fetchPerfumeByIdFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
    },
    initialState
);


export const selectPerfumes = (state) => state.perfumes?.perfumes || [];
export const selectLoading = (state) => state.perfumes?.loading || false;
export const selectError = (state) => state.perfumes?.error || null;

export default perfumeReducer;
