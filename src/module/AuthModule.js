import { createActions, handleActions } from "redux-actions";
import { handleOAuthKakaoAPI } from "../api/AuthAPICalls";

// 초기 상태
const initialState = {
    user: null,         // 사용자 정보
    token: null,        // 인증 토큰
    isLoggedIn: false,  // 로그인 상태
    loading: false,     // 로딩 상태
    error: null,        // 에러 메시지
    role: null,         // 사용자 권한
};

// 액션 생성
export const {
    auth: { loginSuccess, loginFail, logout, setLoading },
} = createActions({
    AUTH: {
        LOGIN_SUCCESS: (data) => data,    // 로그인 성공
        LOGIN_FAIL: (error) => error,    // 로그인 실패
        LOGOUT: () => {},                // 로그아웃
        SET_LOADING: (status) => status, // 로딩 상태 업데이트
    },
});

// Thunk 함수: 카카오 OAuth 로그인 처리
export const handleOAuthKakao = (code) => async (dispatch) => {
    try {
        dispatch(setLoading(true)); // 로딩 상태 시작
        const data = await handleOAuthKakaoAPI(code); // API 호출
        dispatch(loginSuccess(data)); // 로그인 성공 처리
    } catch (error) {
        dispatch(loginFail(error.message || "카카오 로그인 실패")); // 로그인 실패 처리
    } finally {
        dispatch(setLoading(false)); // 로딩 상태 종료
    }
};

// 리듀서
const authReducer = handleActions(
    {
        [loginSuccess]: (state, { payload }) => ({
            ...state,
            user: payload.user,
            token: payload.token,
            role: payload.role,
            isLoggedIn: true,
            loading: false,
            error: null,
        }),
        [loginFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [logout]: () => ({
            user: null,
            token: null,
            role: null,
            isLoggedIn: false,
            loading: false,
            error: null,
        }),
        [setLoading]: (state, { payload }) => ({
            ...state,
            loading: payload,
        }),
    },
    initialState
);

export default authReducer;
