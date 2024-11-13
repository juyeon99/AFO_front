import React, { useState } from 'react';
import '../../../css/components/Sidebar.css'
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // 현재 URL 경로

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // 현재 경로가 '/'일 경우 색을 반전
    const isActive = location.pathname === '/';

    return (
        <>
            <div className="sidebar-container">
                <button
                    onClick={toggleSidebar}
                    className={`sidebar-menu-button ${isOpen ? 'open' : ''} ${isActive ? 'active' : ''}`} // 현재 페이지일 때 'active' 클래스 추가
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className={`sidebar-sidebar ${isOpen ? 'sidebar-sidebar-open' : ''}`}>
                <nav className="sidebar-nav">
                    <a href="/Introduction" className="sidebar-link">소개</a>
                    <a href="/spiceswiki" className="sidebar-link">향로 알아가기</a>
                    <a href="/perfumewiki" className="sidebar-link">향수 알아가기</a>
                    <a href="/chat" className="sidebar-link">향수 추천</a>
                    <a href="/histories" className="sidebar-link">향기 히스토리</a>
                    <div className="sidebar-bottom-links">
                        <a href="/users/signup" className="sidebar-link">• 회원가입</a>
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