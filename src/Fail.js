import React from "react";
import "./css/Login.css";

function ErrorScreen({ errorMessage, onRetry }) {
    return (
        <div className="login-error">
            <p>에러 발생: {errorMessage || "알 수 없는 오류가 발생했습니다."}</p>
            <button className="retry-button" onClick={onRetry}>
                다시 시도하기
            </button>
        </div>
    );
}

export default ErrorScreen;
