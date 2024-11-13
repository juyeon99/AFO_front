import React from 'react';
import '../../../css/components/Footer.css'

const Footer = () => {
    // 네비게이션 링크 데이터
    const navLinks = [
        { title: '소개', path: '/intro' },
        { title: '향료 알아가기', path: '/fragrance' },
        { title: '향수 알아가기', path: '/perfume' },
        { title: '맞춤 향수 추천', path: '/recommend' },
        { title: '향기 히스토리', path: '/history' },
        { title: '자주 묻는 질문 (FAQ)', path: '/faq' }
    ];

    // 소셜 미디어 링크 데이터
    const socialLinks = [
        { title: '[ 인스타그램 ]', path: '#' },
        { title: '[ 페이스북 ]', path: '#' },
        { title: '[ 트위터 ]', path: '#' },
        { title: '[ 유튜브 ]', path: '#' },
        { title: '[ 깃허브 ]', path: '#' }
    ];

    // 법적 링크 데이터
    const legalLinks = [
        { title: '개인정보 처리방침', path: '/privacy' },
        { title: '이용 약관', path: '/terms' },
        { title: '쿠키 정책', path: '/cookies' }
    ];

    // 링크 클릭 핸들러
    const handleLinkClick = (e, path) => {
        // 실제 라우팅 구현 전까지 preventDefault
        e.preventDefault();
        console.log(`Navigating to: ${path}`);
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <nav className="footer-nav">
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            onClick={(e) => handleLinkClick(e, link.path)}
                        >
                            {link.title}
                        </a>
                    ))}
                </nav>

                <div className="footer-social">
                    {socialLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            onClick={(e) => handleLinkClick(e, link.path)}
                        >
                            {link.title}
                        </a>
                    ))}
                </div>

                <div className="footer-legal">
                    {legalLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            onClick={(e) => handleLinkClick(e, link.path)}
                        >
                            {link.title}
                        </a>
                    ))}
                </div>

                <div className="footer-info">
                    회사명: 방향 | 서비스명: 방향(芳香) | 위치: 서울특별시 강남구 테헤란로 123 사당차 동북빌딩<br />
                    통신판매업 신고번호: 제 2024-서울강남-1234호 대표자: 홍길동 | 고객센터: 02-1234-5678<br />
                    이메일: support@banghyang.com
                </div>
            </div>
        </footer>
    );
};

export default Footer;