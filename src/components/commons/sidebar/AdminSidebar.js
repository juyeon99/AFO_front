import React, { useState } from 'react';
import '../../../css/components/AdminSidebar.css'
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import mainPropic from '../../../images/Main-Propic.png';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const [userNickname, setUserNickname] = useState('사용자'); // 사용자 닉네임
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogin = () => {
        // 로그인 처리 로직
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        // 로그아웃 처리 로직
        setIsLoggedIn(false);
    };

    const isActive = location.pathname === '/Admin';

    return (
        <>
            <div className="admin-sidebar-container">
                <button
                    onClick={toggleSidebar}
                    className={`admin-sidebar-menu-button ${isOpen ? 'open' : ''} ${isActive ? 'active' : ''}`}
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className={`admin-sidebar-sidebar ${isOpen ? 'admin-sidebar-sidebar-open' : ''}`}>
                <nav className="admin-sidebar-nav">
                    <a href="/Introduction" className="admin-sidebar-link">소개</a>
                    <a href="/spiceswiki" className="admin-sidebar-link">향로 알아가기</a>
                    <a href="/perfumewiki" className="admin-sidebar-link">향수 알아가기</a>
                    <a href="/chat" className="admin-sidebar-link">향수 추천</a>
                    <a href="/history" className="admin-sidebar-link">향기 히스토리</a>
                    <a href="/member" className="admin-sidebar-link">회원 조회</a>
                    
                    <div className="admin-sidebar-bottom-links">
                        {!isLoggedIn ? (
                            // 비로그인 상태
                            <div className="admin-sidebar-profile-section">
                                <img 
                                    src={mainPropic} 
                                    alt="기본 프로필"    
                                    className="admin-sidebar-profile-img"
                                />
                                <button 
                                    className="admin-sidebar-auth-button login"
                                    onClick={handleLogin}
                                >
                                    로그인/회원가입
                                </button>
                            </div>
                        ) : (
                            // 로그인 상태
                            <>
                                <button 
                                    className="admin-sidebar-auth-button"
                                    onClick={() => window.location.href='/users/withdrawal'}
                                >
                                    • 회원탈퇴
                                </button>
                                <button 
                                    className="admin-sidebar-auth-button"
                                    onClick={handleLogout}
                                >
                                    • 로그아웃
                                </button>
                                <div className="admin-sidebar-profile-section">
                                    <img 
                                        src={mainPropic} 
                                        alt="프로필" 
                                        className="admin-sidebar-profile-img"
                                    />
                                    <span className="admin-sidebar-username">{userNickname}님</span>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {isOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default AdminSidebar;