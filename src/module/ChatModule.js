import { createActions, handleActions } from "redux-actions";
import { requestRecommendations, getChatHistory } from "../api/ChatAPICalls";

// 초기 상태
const initialState = {
    chatMode: "chat", // 현재 모드 ("chat" 또는 "recommendation")
    response: null,   // 서버에서 반환된 응답
    recommendedPerfumes: [], // 추천된 향수 목록
    commonFeeling: null, // 공통 감정
    imageProcessed: null, // 처리된 이미지 결과
    generatedImage: null,  // 생성된 이미지 경로
    loading: false, // 로딩 상태
    error: null,    // 에러 메시지
    chatHistory: [],
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
        const chatData = {
            id: response.id || null,
            mode: response.mode || "chat",
            content: response.content || "",
            imageUrl: response.imageUrl || null,
            recommendations: response.recommendations || [],
            lineId: response.lineId || null,
            timeStamp: new Date().toISOString(), // 백엔드가 timestamp 제공하지 않는 경우
        };

        dispatch(fetchChatSuccess(chatData));

        return response; // 응답 데이터 반환

    } catch (error) {
        dispatch(fetchChatFail(error.response?.data?.message || "서버와 통신 중 오류 발생"));
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
    } catch (error) {
        console.error("채팅 내역 불러오기 실패:", error);
        dispatch(fetchChatHistoryFail(error.message || "채팅 내역을 불러오는 중 오류 발생"));
    }
};

// 리듀서
const chatReducer = handleActions(
    {
        [fetchChatStart]: (state) => {
            console.log("fetchChatStart 상태 변경:", state);
            return {
                ...state,
                loading: true,
                error: null,
            };
        },
        [fetchChatSuccess]: (state, { payload }) => {
            console.log("fetchChatSuccess 상태 변경:", payload);  // 응답 데이터 확인
            return {
                ...state,
                chatMode: payload.mode || payload.response?.mode || "chat",
                response: payload.response || null,
                recommendedPerfumes: Array.isArray(payload.response?.recommendations)
                    ? payload.response.recommendations
                    : [],
                commonFeeling: payload.response?.common_feeling || null,
                imageProcessed: payload.imageProcessed || null,
                generatedImage: payload.generatedImage || null,
                loading: false,
                error: null,
                chatHistory: [
                    ...(state.chatHistory || []),
                    { type: "user", message: payload.userInput },
                    { type: "bot", message: payload.response },
                ],
            };
        },
        [fetchChatFail]: (state, { payload }) => {
            console.log("fetchChatFail 상태 변경:", payload);
            return {
                ...state,
                loading: false,
                error: payload,
            };
        },
        [fetchChatHistoryStart]: (state) => {
            console.log("fetchChatHistoryStart 상태 변경:", state);
            return {
                ...state,
                loading: true,
                error: null,
            };
        },
        [fetchChatHistorySuccess]: (state, { payload }) => {
            console.log("fetchChatHistorySuccess 상태 변경:", payload);
            return {
                ...state,
                loading: false,
                error: null,
                chatHistory: payload, // 서버에서 가져온 채팅 내역으로 갱신
            };
        },
        [fetchChatHistoryFail]: (state, { payload }) => {
            console.log("fetchChatHistoryFail 상태 변경:", payload);
            return {
                ...state,
                loading: false,
                error: payload,
            };
        },
    },
    initialState
);

// 셀렉터
export const selectChatMode = (state) => state.chat.chatMode;
export const selectResponse = (state) => state.chat.response;
export const selectRecommendedPerfumes = (state) => state.chat.recommendedPerfumes;
export const selectCommonFeeling = (state) => state.chat.commonFeeling;
export const selectImageProcessed = (state) => state.chat.imageProcessed;
export const selectGeneratedImage = (state) => state.chat.generatedImage;
export const selectLoading = (state) => state.chat.loading;
export const selectError = (state) => state.chat.error;
export const selectChatHistory = (state) => state.chat.chatHistory;

export default chatReducer;
