import React, { useState } from 'react';
import '../../css/components/Sidebar.css'
import { Menu } from 'lucide-react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../module/AuthModule';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 회원탈퇴/로그아웃 메뉴 열림 상태
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    // 사용자 닉네임 가져오기 (없으면 기본값 '사용자')
    const userNickname = user?.name || '사용자';
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // 메뉴 열림/닫힘
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
        dispatch(logout()); // Redux 상태 초기화
        setIsMenuOpen(false); // 메뉴 닫기
        setIsOpen(false); // 사이드바 닫기
        navigate('/login'); // 로그아웃 후 메인 페이지로 이동
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
                                    src="/images/Main-Propic.png"
                                    alt="기본 프로필"
                                    className="sidebar-profile-img"
                                />
                                <NavLink to="/login">
                                    <button className="sidebar-auth-button login">로그인/회원가입</button>
                                </NavLink>
                            </div>
                        ) : (
                            // 로그인 상태
                            <>
                                <div className="sidebar-profile-section">
                                    <img
                                        src="/images/Main-Propic.png"
                                        alt="프로필"
                                        className="sidebar-profile-img"
                                    />
                                    <span className="sidebar-username">{userNickname}님</span>

                                    {/* 사용자 이름 클릭 시 메뉴 열기 */}
                                    <button
                                        className="sidebar-auth-button"
                                        onClick={toggleMenu}
                                    >
                                        {isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                                    </button>
                                </div>

                                {/* 회원탈퇴/로그아웃 메뉴 */}
                                {isMenuOpen && (
                                    <div className="sidebar-menu">
                                        <button
                                            className="sidebar-auth-button"
                                        >
                                            회원탈퇴
                                        </button>
                                        <button
                                            className="sidebar-auth-button"
                                            onClick={handleLogout}
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                )}
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