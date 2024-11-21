import { createActions, handleActions } from "redux-actions";
import { handleOAuthKakaoAPI } from "../api/AuthAPICalls";

// 초기 상태
const initialState = {
    user: null,
    token: null,
    role: null,
    isLoggedIn: false,
    loading: false,
    error: null,
};

// 액션 생성
export const {
    auth: { loginSuccess, loginFail, logout, setLoading },
} = createActions({
    AUTH: {
        LOGIN_SUCCESS: (data) => data,    // 로그인 성공
        LOGIN_FAIL: (error) => error,    // 로그인 실패
        LOGOUT: () => { },                // 로그아웃
        SET_LOADING: (status) => status, // 로딩 상태 업데이트
    },
});

// Thunk 액션: 초기화
export const initializeAuth = () => (dispatch) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    if (token) {
        dispatch(loginSuccess({ user, token, role }));
    }
};

// Thunk 함수: 카카오 OAuth 로그인 처리
export const handleOAuthKakao = (code) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { user, token, role } = await handleOAuthKakaoAPI(code);
        localStorage.setItem(
            "auth",
            JSON.stringify({ user, token, role }) // 로컬 스토리지 저장
        );
        dispatch(loginSuccess({ user, token, role }));
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "카카오 로그인 실패";
        dispatch(loginFail(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem("auth"); // 로컬 스토리지 데이터 삭제
    dispatch(logout());
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
