import '../css/Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login-info'); // LoginInfo 페이지로 이동
    };
    
    return (
        <div className="login-container">
            <img src="/images/logo.png" alt="Google Icon" className="login-logo" />
            <p className="login-subtitle">당신의 향기, 당신의 이야기 - 일상의 특별한 향기</p>

            <div className="login-box">
                <button className="google-login-button" onClick={handleLogin}>
                    Sign in with kakao
                    <img src="/images/kakao.png" alt="Google Icon" className="kakao-icon" />
                </button>
                <img src="/images/footer.png" alt="푸터 이미지" className="login_footer" />
            </div>
            
        </div>
    );
}

export default Login;
