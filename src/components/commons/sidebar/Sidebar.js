import React, { useState } from 'react';
import '../../../css/components/Sidebar.css'
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import mainPropic from '../../../images/Main-Propic.png';

const Sidebar = () => {
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

    const isActive = location.pathname === '/';

    return (
        <>
            <div className="sidebar-container">
                <button
                    onClick={toggleSidebar}
                    className={`sidebar-menu-button ${isOpen ? 'open' : ''} ${isActive ? 'active' : ''}`}
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className={`sidebar-sidebar ${isOpen ? 'sidebar-sidebar-open' : ''}`}>
                <nav className="sidebar-nav">
                <a href="#" className="sidebar-link"
                        onClick={(e) => {
                        e.preventDefault(); // 기본 링크 동작 방지
                        const target = document.getElementById('intro-section'); // 해당 섹션의 id를 가져옴
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 부드럽게 스크롤
                        }
                        setIsOpen(false); // 사이드바 닫기
                    }}>소개</a>
                    <a href="/spiceslist" className="sidebar-link">향료 알아가기</a>
                    <a href="/perfumelist" className="sidebar-link">향수 알아가기</a>
                    <a href="/chat" className="sidebar-link">향수 추천</a>
                    <a href="/history" className="sidebar-link">향기 히스토리</a>
                    
                    <div className="sidebar-bottom-links">
                        {!isLoggedIn ? (
                            // 비로그인 상태
                            <div className="sidebar-profile-section">
                                <img 
                                    src={mainPropic} 
                                    alt="기본 프로필" 
                                    className="sidebar-profile-img"
                                />
                                <button 
                                    className="sidebar-auth-button login"
                                    onClick={handleLogin}
                                >
                                    로그인/회원가입
                                </button>
                            </div>
                        ) : (
                            // 로그인 상태
                            <>
                                <button 
                                    className="sidebar-auth-button"
                                    onClick={() => window.location.href='/users/withdrawal'}
                                >
                                    • 회원탈퇴
                                </button>
                                <button 
                                    className="sidebar-auth-button"
                                    onClick={handleLogout}
                                >
                                    • 로그아웃
                                </button>
                                <div className="sidebar-profile-section">
                                    <img 
                                        src={mainPropic} 
                                        alt="프로필" 
                                        className="sidebar-profile-img"
                                    />
                                    <span className="sidebar-username">{userNickname}님</span>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default Sidebar;