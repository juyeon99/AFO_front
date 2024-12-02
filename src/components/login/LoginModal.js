import React from 'react';

const NonMemberLoginModal = ({ navigate, setShowLoginModal }) => (
    <div className="non-member-modal-overlay">
        <div className="non-member-modal-content">
            <h2>로그인 후 이용해주세요</h2>
            <p>더 많은 추천을 받으시려면 로그인이 필요합니다.</p>
            <button className="non-member-login-button" onClick={() => navigate('/login')}>로그인</button>
            <button className="non-member-close-button" onClick={() => setShowLoginModal(false)}>닫기</button>
        </div>
    </div>
);

export default NonMemberLoginModal;
