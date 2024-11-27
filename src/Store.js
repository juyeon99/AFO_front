import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./module/AuthModule";
import memberReducer from "./module/MemberModule";
import spiceReducer from "./module/SpicesModule";

// 여러 리듀서를 합치는 경우
const rootReducer = combineReducers({
    auth: authReducer,
    members: memberReducer,
    spices: spiceReducer
});

// 스토어 생성
const store = createStore(
    rootReducer,      // 리듀서를 합친 결과
    applyMiddleware(thunk) // thunk 미들웨어 추가
);

export default store;
