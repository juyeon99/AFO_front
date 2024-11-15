import '../css/LoginInfo.css';

function LoginInfo() {
    return (
        <div className="login-info-container">
            {/* 로고 */}
            <img src="/images/logo.png" alt="Logo" className="login-info-logo" />
            <p className="login-info-subtitle">당신의 향기, 당신의 이야기 - 일상의 특별한 향기</p>

            {/* 입력 폼 박스 */}
            <div className="login-info-box">
                <input type="text" className="login-info-input" placeholder="이름을 입력하세요" />
                
                <div className="login-info-gender">
                    <label>
                        <input type="radio" name="gender" value="female" />
                        여자
                    </label>
                    <label>
                        <input type="radio" name="gender" value="male" />
                        남자
                    </label>
                </div>

                <input type="email" className="login-info-input" placeholder="이메일 자동 입력" />
                <input type="date" className="login-info-input" placeholder="생년월일을 입력하세요" />

                <button className="login-info-button">
                    가입하기
                </button>
            </div>

            <img src="/images/footer.png" alt="푸터 이미지" className="login-footer" />
        </div>
    );
}

export default LoginInfo;
