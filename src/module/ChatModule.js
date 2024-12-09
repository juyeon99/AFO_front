import { createActions, handleActions } from "redux-actions";
import { requestRecommendations, getChatHistory } from "../api/ChatAPICalls";

// 초기 상태
const initialState = {
    chatMode: "chat", 
    response: null, 
    recommendedPerfumes: [],
    chatHistory: [], 
    loading: false,
    error: null,
};

// 액션 생성
export const {
    chat: {
        fetchChatStart,
        fetchChatSuccess,
        fetchChatFail,
        fetchChatHistoryStart,
        fetchChatHistorySuccess,
        fetchChatHistoryFail,
    },
} = createActions({
    CHAT: {
        FETCH_CHAT_START: () => { },
        FETCH_CHAT_SUCCESS: (response) => response,
        FETCH_CHAT_FAIL: (error) => error,
        FETCH_CHAT_HISTORY_START: () => { },
        FETCH_CHAT_HISTORY_SUCCESS: (chatHistory) => chatHistory,
        FETCH_CHAT_HISTORY_FAIL: (error) => error,
    },
});

// 채팅 응답
export const fetchChatResponse = (userInput, imageFile = null) => async (dispatch) => {
    try {
        dispatch(fetchChatStart()); // 로딩 상태 시작

        // 로컬 스토리지에서 사용자 정보 확인
        const localAuth = JSON.parse(localStorage.getItem("auth"));
        const userId = localAuth?.id || null; // 로그인된 경우에만 id 가져옴

        // 서버 요청
        const response = await requestRecommendations(userInput, imageFile, userId);
        console.log("API 응답 데이터:", response);

        // 4. 응답 데이터에서 필요한 필드 추출
        const chatMessage = response.mode === "chat" ? {
            id: response.id,
            type: "AI",
            content: response.content,
            timestamp: new Date().toISOString(),
            mode: "chat",
        } : {
            id: response.id,
            mode: "recommendation",
            type: "AI",
            lineId: response.lineId,
            imageUrl: response.imageUrl,
            recommendations: response.recommendations,
            timestamp: new Date().toISOString(),
        };

        dispatch(fetchChatSuccess(chatMessage));
        return chatMessage

    } catch (error) {
        dispatch(fetchChatFail(error.message || "추천 요청 중 오류 발생"));
    }
};

// 전체 채팅 기록
export const fetchChatHistory = () => async (dispatch) => {
    try {
        dispatch(fetchChatHistoryStart()); // 로딩 시작

        // 로컬 스토리지에서 사용자 정보 확인
        const localAuth = JSON.parse(localStorage.getItem("auth"));
        const memberId = localAuth?.id;

        if (!memberId) {
            throw new Error("로그인한 사용자 정보가 없습니다.");
        }

        // 서버에서 채팅 내역 가져오기
        const chatHistory = await getChatHistory(memberId);
        console.log("채팅 내역 API 응답:", chatHistory);

        dispatch(fetchChatHistorySuccess(chatHistory));
        return chatHistory

    } catch (error) {
        console.error("채팅 내역 불러오기 실패:", error);
        dispatch(fetchChatHistoryFail(error.message || "채팅 내역을 불러오는 중 오류 발생"));
        return null;
    }
};

// 리듀서
const chatReducer = handleActions(
    {
        [fetchChatStart]: (state) => ({ ...state, loading: true, error: null }),
        [fetchChatSuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            response: payload,
            chatHistory: [...state.chatHistory, payload],
        }),
        [fetchChatFail]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
        [fetchChatHistoryStart]: (state) => ({ ...state, loading: true, error: null }),
        [fetchChatHistorySuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            chatHistory: payload,
        }),
        [fetchChatHistoryFail]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
    },
    initialState
);

// 셀렉터
export const selectChatMode = (state) => state.chat.chatMode;
export const selectResponse = (state) => state.chat.response;
export const selectChatHistory = (state) => state.chat.chatHistory;
export const selectLoading = (state) => state.chat.loading;

export default chatReducer;
