import { createActions, handleActions } from "redux-actions";
import { getAllSpices } from "../api/SpicesAPICalls";

// 초기 상태
const initialState = {
    spices: [], 
    loading: false, 
    error: null, 
};

// 액션 생성
export const {
    spices: { fetchSpicesStart, fetchSpicesSuccess, fetchSpicesFail },
} = createActions({
    SPICES: {
        FETCH_SPICES_START: () => {}, // 데이터 요청 시작
        FETCH_SPICES_SUCCESS: (spices) => spices, // 요청 성공
        FETCH_SPICES_FAIL: (error) => error, // 요청 실패
    },
});

export const fetchSpices = () => async (dispatch) => {
    try {
        dispatch(fetchSpicesStart());
        const spices = await getAllSpices();
        dispatch(fetchSpicesSuccess(spices));
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "회원 목록 불러오기 실패";
        dispatch(fetchSpicesFail(errorMessage));
    }
};

// 리듀서
const spiceReducer = handleActions(
    {
        [fetchSpicesStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchSpicesSuccess]: (state, { payload }) => ({
            ...state,
            spices: payload,
            loading: false,
            error: null,
        }),
        [fetchSpicesFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload, 
        }),
    },
    initialState
);

// Selector 함수 사용
// -> 동일한 상태를 여러 컴포넌트에서 사용할 때, Selector 함수로 관리하면 중복 코드 없이 사용 가능
export const selectSpices = (state) => state.spices.spices;
export const selectLoading = (state) => state.spices.loading; 
export const selectError = (state) => state.spices.error;  

export default spiceReducer;
