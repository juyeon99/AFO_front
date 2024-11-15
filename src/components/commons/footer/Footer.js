import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../../css/components/Footer.css';
import banghyangLogo from '../../../images/banghyangLogo.png';
import footerLogo from '../../../images/footerLogo.png';

const Footer = () => {
    const location = useLocation();
    const isMainPage = location.pathname === '/';

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

    return (
        <>
            {!isMainPage && (
                <div className="footer-logo-outer">
                    <img 
                        src={footerLogo}
                        alt="상단 푸터 로고"
                        className="footer-top-logo"
                    />
                </div>
            )}
            <Footer className="footer">
                <div className="footer-container">
                    <div className="footer-logo-section">
                        <img 
                            src={banghyangLogo}
                            alt="방향 로고"
                            className="footer-logo"
                        />
                    </div>

                    <div className="footer-textbox">
                        <div className="footer-slogan">당신만의 특별한 향기</div>
                        <nav className="footer-nav">
                            {navLinks.map((link, index) => (
                                <React.Fragment key={index}>
                                    <a href={link.path}>
                                        {link.title}
                                    </a>
                                    {index < navLinks.length - 1 && <span className="separator">|</span>}
                                </React.Fragment>
                            ))}
                        </nav>

                        <div className="footer-social">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.path}
                                >
                                    {link.title}
                                </a>
                            ))}
                        </div>

                        <div className="footer-company-info">
                            회사명: 올포원 | 서비스명: 방향(訪香) | 위치: 서울특별시 강남구 테헤란로 123 | 사업자 등록번호: 123-45-67890<br/>
                            통신판매업 신고번호: 제 2024-서울강남-1234호 | 대표자: 홍길동 | 고객센터: 02-1234-5678 | 이메일: support@banghyang.com
                        </div>

                        <div className="footer-bottom-block">
                            <div className="footer-legal">
                                <a href="/privacyPolicy" className="privacyPolicy">
                                    <b>개인정보 처리방침</b>
                                </a>
                                <span className="separator">|</span>
                                <a href="/termsOfUse" className="termsOfUse">
                                    <b>이용약관</b>
                                </a>
                                <span className="separator">|</span>
                                <a href="/cookies" className="cookiePolicy">
                                    <b>쿠키 정책</b>
                                </a>
                            </div>

                            <div className="footer-copyright">
                                © 2024 방향. All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </Footer>
        </>
    );
};

export default Footer;
