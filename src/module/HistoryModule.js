import { createActions, handleActions } from "redux-actions";
import { createScentCardAPI } from "../api/HistoryAPICalls"; // 향기 카드 API

// 초기 상태
const initialState = {
    scentCard: null, // 생성된 향기 카드 데이터
    loading: false,  // 로딩 상태
    error: null,     // 에러 메시지
};


// 액션 생성
export const {
    history: {
        createScentCardStart,
        createScentCardSuccess,
        createScentCardFail,
    },
} = createActions({
    HISTORY: {
        CREATE_SCENT_CARD_START: () => {},
        CREATE_SCENT_CARD_SUCCESS: (scentCard) => scentCard,
        CREATE_SCENT_CARD_FAIL: (error) => error,
    },
});

// 향기 카드 생성
export const createScentCard = (chatId) => async (dispatch) => {
    try {
        dispatch(createScentCardStart());

        const scentCard = await createScentCardAPI(chatId); // HistoryAPICalls.js API 호출
        dispatch(createScentCardSuccess(scentCard));
        return scentCard;
    } catch (error) {
        dispatch(createScentCardFail(error.message || "향기 카드 생성 중 오류 발생"));
        throw error;
    }
};

const historyReducer = handleActions(
    {
        [createScentCardStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [createScentCardSuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            scentCard: payload,
        }),
        [createScentCardFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
    },
    initialState
);

export default historyReducer;


