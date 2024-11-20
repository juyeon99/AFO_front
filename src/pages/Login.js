import '../css/Login.css';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleOAuthKakao } from '../module/AuthModule';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { loading, isLoggedIn, error } = useSelector((state) => state.auth); // Redux 상태 가져오기

    // 카카오 OAuth 처리
    useEffect(() => {
        const searchParam = new URLSearchParams(location.search);
        const code = searchParam.get('code'); // 카카오 리다이렉트로 받은 code 확인
        if (code) {
            dispatch(handleOAuthKakao(code))
                .then(() => {
                    alert('로그인 성공!');
                    window.location.href = "/";
                })
                .catch(() => {
                    alert('로그인 실패!');
                    navigate('/fail'); // 실패 시 실패 페이지로 이동
                });
        }
    }, [dispatch, location, navigate]);

    // UI 처리
    const handleLogin = () => {
        // 카카오 로그인 URL로 리디렉트
        window.location.href = "http://localhost:8080/oauth/kakao";
    };

    if (loading) {
        return <div className="login-container">로그인 처리 중...</div>;
    }

    if (error) {
        return <div className="login-container">에러 발생: {error}</div>;
    }

    return (
        <div className="login-container">
            <img src="/images/logo.png" className="login-logo" alt="Logo" />
            <p className="login-subtitle">당신의 향기, 당신의 이야기 - 일상의 특별한 향기</p>

            <div className="login-box">
                <button className="kakao-login-button" onClick={handleLogin}>
                    Sign in with Kakao
                    <img src="/images/kakao.png" alt="Kakao Icon" className="kakao-icon" />
                </button>
                <img src="/images/footer.png" alt="푸터 이미지" className="login_footer" />
            </div>
        </div>
    );
}

export default Login;
