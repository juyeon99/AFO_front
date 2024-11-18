import React, { useState } from 'react';
import '../../../css/components/AdminSidebar.css'
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState('사용자');
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
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
                            <div className="admin-sidebar-profile-section">
                                <img 
                                    src="/images/Main-Propic.png"
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
                                        src="/images/Main-Propic.png"
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