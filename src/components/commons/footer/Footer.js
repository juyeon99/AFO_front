import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../../css/components/Footer.css';
import banghyangLogo from '../../../images/banghyangLogo.png';
import footerLogo from '../../../images/footerLogo.png';

const Footer = () => {
    const location = useLocation();
    const isMainPage = location.pathname === '/';

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
            <footer className="footer">
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
                        <nav className="footer-navlinks">
                            <div className="footer-nav">
                                <a href="/intro">소개</a>
                                <span className="separator">|</span>
                                <a href="/fragrance">향료 알아가기</a>
                                <span className="separator">|</span>
                                <a href="/PerfumeList">향수 알아가기</a>
                                <span className="separator">|</span>
                                <a href="/recommend">맞춤 향수 추천</a>
                                <span className="separator">|</span>
                                <a href="/history">향기 히스토리</a>
                                <span className="separator">|</span>
                                <a href="/FAQ">자주 묻는 질문 (FAQ)</a>
                            </div>
                        </nav>

                        <div className="footer-social">
                            {socialLinks.map((link, index) => (
                                <a key={index} href={link.path}>
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
                                <a href="/PrivacyPolicy" className="PrivacyPolicy">
                                    <b>개인정보 처리방침</b>
                                </a>
                                <span className="separator">|</span>
                                <a href="/TermsofUse" className="TermsofUse">
                                    <b>이용약관</b>
                                </a>
                                <span className="separator">|</span>
                                <a href="/CookiePolicy" className="CookiePolicy">
                                    <b>쿠키 정책</b>
                                </a>
                            </div>

                            <div className="footer-copyright">
                                © 2024 방향. All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;