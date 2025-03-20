import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/components/Footer.css';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaGithub } from "react-icons/fa";

const Footer = ({language}) => {
    const location = useLocation();
    const isMainPage = location.pathname === '/';

    // 소셜 미디어 링크 데이터
    const socialLinks = [
        { title: 'instagram', icon: <FaInstagram />, path: '#' },
        { title: 'facebook', icon: <FaFacebook />, path: '#' },
        { title: 'x', icon: <FaTwitter />, path: 'https://x.com/its_me_jenny__?s=21' },
        { title: 'youtube', icon: <FaYoutube />, path: 'https://www.youtube.com/@AllForOne-1216' },
        { title: 'github', icon: <FaGithub />, path: 'https://github.com/juyeon99/AFO_AIserver' }
    ];

    const handleScrollToIntro = (e) => {
        e.preventDefault(); // Prevent default link behavior

        if (location.pathname === "/") {
            // Already on the main page, just scroll
            scrollToIntro();
        } else {
            // Navigate to "/" first, then scroll after page load
            navigate("/");
            setTimeout(scrollToIntro, 500); // Delay to ensure page loads
        }
    };

    const scrollToIntro = () => {
        const target = document.getElementById("intro-section");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const navigate = useNavigate();

    const texts = {
        slogan: { en: "The Fragrance That's Truly Yours", ko: "당신만의 특별한 향기" },
        intro: { en: "Introduction", ko: "소개" },
        spices: { en: "Explore Notes", ko: "향료 알아가기" },
        perfumes: { en: "Explore Perfumes", ko: "향수 알아가기" },
        recommendation: { en: "AI Perfume Recommendation", ko: "AI 향수 추천" },
        history: { en: "Fragrance History", ko: "향기 히스토리" },
        therapy: { en: "Aromatherapy", ko: "향 테라피" },
        faq: { en: "FAQ", ko: "자주 묻는 질문 (FAQ)" },
        privacyPolicy: { en: "Privacy Policy", ko: "개인정보 처리방침" },
        termsOfService: { en: "Terms of Service", ko: "이용약관" },
        cookiePolicy: { en: "Cookie Policy", ko: "쿠키 정책" }
    };

    return (
        <>
            <footer className="footer">
                <img 
                    src="/images/logo-en.png" 
                    alt="logo" 
                    className="footer-main-logo-image"
                    onClick={() => {
                        navigate('/'); // 경로 변경
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // 스크롤 맨 위로 이동
                    }}
                    style={{ cursor: 'pointer' }}
                />
                <div className="footer-container">

                    <div className="footer-textbox">
                        <div className="footer-slogan">{language === 'english' ? texts.slogan.en : texts.slogan.ko}</div>
                        <nav className="footer-navlinks">
                            <div className="footer-nav">
                                <a href="#" onClick={handleScrollToIntro}>{language === 'english' ? texts.intro.en : texts.intro.ko}</a>
                                <span className="separator">|</span>
                                <a href="/perfumeList">{language === 'english' ? texts.perfumes.en : texts.perfumes.ko}</a>
                                <span className="separator">|</span>
                                <a href="/spiceslist">{language === 'english' ? texts.spices.en : texts.spices.ko}</a>
                                <span className="separator">|</span>
                                <a href="/chat">{language === 'english' ? texts.recommendation.en : texts.recommendation.ko}</a>
                                <span className="separator">|</span>
                                <a href="/history">{language === 'english' ? texts.history.en : texts.history.ko}</a>
                                <span className="separator">|</span>
                                <a href="/therapy">{language === 'english' ? texts.therapy.en : texts.therapy.ko}</a>
                                <span className="separator">|</span>
                                <a href="/FAQ">{language === 'english' ? texts.faq.en : texts.faq.ko}</a>
                            </div>
                        </nav>

                        <div className="footer-social">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.path !== '#' ? link.path : undefined} // 깃허브만 링크 활성화
                                    onClick={(e) => {
                                        if (link.path === '#') {
                                            e.preventDefault();
                                        }
                                    }}
                                    target={link.path !== '#' ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    style={{ fontSize: '24px', color: '#000', textDecoration: 'none' }}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div> 

                        <div className="footer-company-info">
                            {language === 'english' ? (
                                <>
                                    Company Name: AFO | Service Name: Sentique | Location: 123 Teheran-ro, Gangnam-gu, Seoul, South Korea | Business Registration Number: 123-45-67890<br />
                                    E-commerce Registration Number: 제 2024-서울강남-1234호 | Representative: Gil-dong Hong | Customer Service: 02-1234-5678 | Email: support@sentique.com
                                </>
                                ) : (
                                <>
                                    회사명: AFO | 서비스명: Sentique | 위치: 서울특별시 강남구 테헤란로 123 | 사업자 등록번호: 123-45-67890<br />
                                    통신판매업 신고번호: 제 2024-서울강남-1234호 | 대표자: 홍길동 | 고객센터: 02-1234-5678 | 이메일: support@sentique.com
                                </>
                            )}
                            
                        </div>

                        <div className="footer-bottom-block">
                            <div className="footer-legal">
                                <a href="/PrivacyPolicy" className="PrivacyPolicy">
                                    <b>{language === 'english' ? texts.privacyPolicy.en : texts.privacyPolicy.ko}</b>
                                </a>
                                <span className="separator">|</span>
                                <a href="/TermsofUse" className="TermsofUse">
                                    <b>{language === 'english' ? texts.termsOfService.en : texts.termsOfService.ko}</b>
                                </a>
                                <span className="separator">|</span>
                                <a href="/CookiePolicy" className="CookiePolicy">
                                    <b>{language === 'english' ? texts.cookiePolicy.en : texts.cookiePolicy.ko}</b>
                                </a>
                            </div>

                            <div className="footer-copyright">
                                © 2024 Sentique. All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
