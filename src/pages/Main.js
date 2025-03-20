import '../css/Main.css';
import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom'
import DashboardModal from './admin/DashboardModal';
import { ChartColumnIncreasing } from "lucide-react";
import ColorLoadingScreen from "../components/loading/ColorLoadingScreen"
import { useNavigate } from "react-router-dom";
import ImageCropper from "../pages/scentlens/image/ImageCropper";
import axios from "axios";

function Main() {
    const [scrollY, setScrollY] = useState(0);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [introInView, setIntroInView] = useState(false);
    const [additionalInView1, setAdditionalInView1] = useState(false);
    const [additionalInView2, setAdditionalInView2] = useState(false);
    const [fadeInSectionInView, setFadeInSectionInView] = useState(false);
    const [role, setRole] = useState(null);

    const videoRef = useRef(null);
    const introSectionRef = useRef(null);
    const additionalSectionRef1 = useRef(null);
    const additionalSectionRef2 = useRef(null);
    const fadeInSectionRef = useRef(null);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const navigate = useNavigate();

    const storedLanguage = localStorage.getItem('language') || 'english';
    const [language, setLanguage] = useState(storedLanguage);

    // Language change handler
    const handleLanguageChange = (newLanguage) => {
        if (newLanguage !== localStorage.getItem('language')) {
            localStorage.setItem('language', newLanguage);
            console.log("Language changed to:", newLanguage);
            window.location.reload();
        }
    };

    const handleImageUpload = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                // imageRef.current = null; // 이전 이미지 참조 초기화
                setIsModalOpen(true); // 모달 열기
            };
            reader.readAsDataURL(file); // 이미지 파일 읽기
        }
        document.getElementById("file-input").value = ""; // 파일 입력값 초기화
    }

    // 크롭 완료 시 처리
    const handleCropComplete = async (croppedImage) => {
        if (!croppedImage) return;
        setIsLoading(true);

        try {
            const blob = await fetch(croppedImage).then((r) => r.blob());
            const file = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("http://localhost:8080/scentlens/get_image_search_result", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response", response);

            // 결과를 저장하거나 다른 페이지로 이동
            setIsLoading(false);
            setIsModalOpen(false);
            navigate("/scentlens", { state: { perfumes: response.data.products } });
        } catch (error) {
            console.error("Error", error);
            setIsLoading(false);
        }
    };

    // 취소 버튼 처리
    const handleCancel = () => {
        setImageSrc(null);
        setIsModalOpen(false);
    };

    const handlePageTransition = () => {
        const mainPage = document.querySelector(".main-page");
        mainPage.classList.add("page-transition");
        setTimeout(() => {
            navigate("/scentlens")
        }, 1000); // 애니메이션 시간 후 페이지 이동
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            setShowScrollTopButton(window.scrollY > 300); // 스크롤이 300px 이상이면 버튼 표시
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onloadeddata = () => setLoaded(true);
        }
    }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('auth'));
        if (storedUser && storedUser.role) {
            setRole(storedUser.role); // 사용자 역할 저장
        }
    }, []);

    // Intersection Observer 설정
    useEffect(() => {
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.target === introSectionRef.current) {
                    setIntroInView(entry.isIntersecting);
                } else if (entry.target === additionalSectionRef1.current) {
                    setAdditionalInView1(entry.isIntersecting);
                } else if (entry.target === additionalSectionRef2.current) {
                    setAdditionalInView2(entry.isIntersecting);
                } else if (entry.target === fadeInSectionRef.current) {
                    setFadeInSectionInView(entry.isIntersecting);
                }
            });
        };

        const observerOptions = {
            threshold: 0.1,
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (introSectionRef.current) observer.observe(introSectionRef.current);
        if (additionalSectionRef1.current) observer.observe(additionalSectionRef1.current);
        if (additionalSectionRef2.current) observer.observe(additionalSectionRef2.current);
        if (fadeInSectionRef.current) observer.observe(fadeInSectionRef.current);

        return () => {
            if (introSectionRef.current) observer.unobserve(introSectionRef.current);
            if (additionalSectionRef1.current) observer.unobserve(additionalSectionRef1.current);
            if (additionalSectionRef2.current) observer.unobserve(additionalSectionRef2.current);
            if (fadeInSectionRef.current) observer.unobserve(fadeInSectionRef.current);
        };
    }, []);

    const videoOpacity = loaded ? Math.max(1 - scrollY / 300, 0) : 1;
    const overlayOpacity = Math.min(scrollY / 300, 1);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // 부드럽게 스크롤
        });
    };

    // 각 섹션 스타일 (Intersection Observer 상태에 따라 변경)
    const introSectionStyle = {
        opacity: introInView ? 1 : 0,
        transform: introInView ? 'translateY(0px)' : 'translateY(50px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
    };

    const additionalSectionStyle1 = {
        opacity: additionalInView1 ? 1 : 0,
        transform: additionalInView1 ? 'translateY(0px)' : 'translateY(50px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
    };

    const additionalSectionStyle2 = {
        opacity: additionalInView2 ? 1 : 0,
        transform: additionalInView2 ? 'translateY(0px)' : 'translateY(50px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
    };

    const fadeInSectionStyle = {
        opacity: fadeInSectionInView ? 1 : 0,
        transform: fadeInSectionInView ? 'translateY(0px)' : 'translateY(50px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
    };

    const texts = {
        korean: {
            mainTitle: '"일상에 자연스럽게 스며드는 향기, 당신의 순간을 향기로 완성하세요."',
            title: "매 순간을 특별하게 만드는 힘, 센티크에서 당신만의 향을 찾아보세요.",
            intro: "향은 단순히 맡는 것을 넘어 우리의 감정, 기억, 그리고 하루를 채워주는 강력한 매개체입니다.",
            additional1: "센티크는 단순한 향 추천이 아닙니다.",
            additional2: "당신이 입력한 이미지와 텍스트를 통해 맞춤 향을 추천할 뿐만 아니라, 향과 어울리는 색을 통해 향을 시각적으로 느끼는 감각적 경험을 선사합니다.",
            additional3: "오직 센티크에서만 만날 수 있는 나만의 향기, 지금 바로 찾아보세요.",
        },
        english: {
            mainTitle: '"A scent that blends seamlessly into your daily life\n— complete your moments with fragrance."',
            title: "The power to make every moment special — find your unique scent with Scentique.",
            intro: "Fragrance goes beyond mere scent. It evokes emotions, preserves memories, and enriches our everyday experiences.",
            additional1: "Scentique is more than just a fragrance recommendation service.",
            additional2: "Beyond personalized scent recommendations based on your images and text, we create a multisensory experience by visually bringing your recommended fragrance to life.",
            additional3: "Uncover a scent that is uniquely yours — exclusively at Scentique, waiting for you.",
        },
    };

    return (
        <>
            <div className="main-video-container">
                <div className="main-header">
                    {/* <img src={language === 'english' ? "/images/logo-w-en.png" : "/images/logo-w-kr.png"} alt="logo" className="main-logo-image" /> */}
                    <img src="/images/logo-w-en.png" alt="main logo" className="main-logo-image" />
                    <div className="language-buttons">
                        <p className="language-btn" onClick={() => handleLanguageChange("korean")}>한국어</p>
                        <p>|</p>
                        <p className="language-btn" onClick={() => handleLanguageChange("english")}>En</p>
                    </div>
                </div>

                {/* 관리자 문구 */}
                {role === 'ADMIN' && (
                    <>
                        <div className="admin-banner">
                            관리자입니다.
                        </div>
                        <button
                            className="dashboard-button"
                            onClick={() => setIsDashboardOpen(true)}
                        >
                            사용자 대시보드 <ChartColumnIncreasing size={20} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                        </button>
                        <DashboardModal
                            isOpen={isDashboardOpen}
                            onClose={() => setIsDashboardOpen(false)}
                        />
                    </>
                )}

                <video
                    ref={videoRef}
                    className="main-background-video"
                    src="/videos/main.mp4"
                    autoPlay
                    muted
                    loop
                    style={{ opacity: videoOpacity }}
                ></video>
                <div
                    className="main-overlay"
                    style={{
                        backgroundColor: `rgba(239, 237, 237, ${overlayOpacity})`,
                    }}
                ></div>
                
                <h1 className="main-title">
                    {language === 'english' ? (
                            <>
                                "A scent that blends seamlessly into your daily life —
                                <br />
                                complete your moments with fragrance."
                            </>
                        )
                        : texts.korean.mainTitle}
                </h1>

                <div className="main-content" style={{ opacity: videoOpacity }}>
                    <div className="main-buttons-container">
                        <NavLink to="/chat">
                            <button className="main-start-button">CHAT</button>
                        </NavLink>

                        <button
                            className="main-start-button"
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            IMAGE
                        </button>
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                        />
                    </div>
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }} // 파일 선택기 숨기기
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                </div>
            </div>

            {/* 모달창 */}
            {isModalOpen && (
                <div className="scentlens-modal">
                    <div className="scentlens-modal-content">
                        {imageSrc && (
                            <ImageCropper
                                image={imageSrc}
                                onCropComplete={handleCropComplete}
                                onCancel={handleCancel}
                            />
                        )}
                    </div>
                </div>
            )}

            {isLoading && <ColorLoadingScreen />}

            <div
                id="intro-section"
                className="intro-section"
                ref={introSectionRef}
                style={introSectionStyle}
            >
                <h2>{language === 'english' ? texts.english.title : texts.korean.title}</h2>
                <div className="intro-content-wrapper">
                    <div className="intro-item1">
                        <img src="/images/1.png" alt="intro 1" className="intro-image" />
                        <h3>{language === "english" ? "Positive Emotions and Energy Boost" : "긍정적인 감정과 에너지 상승"}</h3>
                        <p>
                            {language === 'english' ? (
                                <>
                                    Fragrance fills you with confidence<br />and helps you start your day with energy.
                                </>
                            ) : (
                                <>
                                    향은 자신감을 채워주고 <br />활기찬 하루로 시작할 수 있도록 <br />나의 삶에 도움을 줍니다.
                                </>
                            )}
                        </p>
                    </div>
                    {language === 'english' ? (
                        <>
                            <div className="intro-item2">
                                <img src="/images/3.png" alt="intro 2" className="intro-image" />
                                <h3>Memory Enhancement and Focus Improvement</h3>
                                <p>Certain fragrances stimulate memory,<br />helping you recall important moments, and enhance focus, improving work and study efficiency.</p>
                            </div>
                            <div className="intro-item3">
                                <img src="/images/2.png" alt="intro 3" className="intro-image" />
                                <h3>Stress Relief and Mental Balance</h3>
                                <p>Try soothing your stressed mind with fragrance. The gentle flow of fragrance will calm and stabilize your mind.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="intro-item2">
                                <img src="/images/2.png" alt="intro 2" className="intro-image" />
                                <h3>스트레스 완화와 심신 안정</h3>
                                <p>스트레스 받은 오늘의 마음을<br />향으로 다스려보세요. 잔잔히 흘러오는 향기는 <br />여러분의 마음을 편안하게 안정시켜줄 것입니다.</p>
                            </div>
                            <div className="intro-item3">
                                <img src="/images/3.png" alt="intro 3" className="intro-image" />
                                <h3>기억력 향상과 집중력 강화</h3>
                                <p>특정 향기는 기억력을 자극해 <br />중요한 순간을 기억하도록 돕고, 집중력을 높여 <br />일과 학습 효율을 향상시킵니다.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div
                className="additional-section"
                ref={additionalSectionRef1}
                style={additionalSectionStyle1}
            >
                <h2>{language === 'english' ? (
                    <>
                        Fragrance goes beyond mere scent.<br/>It evokes emotions, preserves memories, and enriches our everyday experiences.
                    </>
                    ) : texts.korean.intro}</h2>
                <h3>●</h3>
                <h3>●</h3>
                <h3>●</h3>
            </div>

            <div
                className="additional-section"
                ref={additionalSectionRef2}
                style={additionalSectionStyle2}
            >
                <h2 className="additional-h2">{language === 'english' ? texts.english.additional1 : texts.korean.additional1}</h2>
                <div className="additional-images">
                    <img src="/images/infoSub1.png" alt="additional image 1" className="additional-image" />
                    <img src="/images/infoSub2.png" alt="additional image 2" className="additional-image" />
                </div>
                <div className="fade-in-section" ref={fadeInSectionRef} style={fadeInSectionStyle}>
                    <h2 className="additional-h2">
                        {language === 'english' ? (
                            <>
                                Beyond <span className="highlight">personalized scent recommendations</span> based on your images and text,<br />
                                we create a <span className="highlight">multisensory experience</span> by <span className="highlight">visually</span> bringing your recommended fragrance to life.
                            </>
                        )
                        : (
                            <>
                                당신이 입력한 이미지와 텍스트를 통해 <span className="highlight">맞춤 향을 추천</span>할 뿐만 아니라,<br />
                                <span className="highlight">향과 어울리는 색</span>을 통해 <span className="highlight">향을 시각적</span>으로 느끼는 감각적 경험을 선사합니다.
                            </>
                        )}
                    </h2>
                    <h1>•</h1>
                    <h1>•</h1>
                    <h2 className="additional-h2">
                    {language === 'english' ? (
                            <>
                                Uncover a <span className="highlight">scent that is uniquely yours</span> — exclusively at <span className="highlight">Scentique</span>, waiting for you.
                            </>
                        )
                        : (
                            <>
                                오직 <span className="highlight">센티크에서만 만날 수 있는 나만의 향기</span>, 지금 바로 찾아보세요.
                            </>
                        )}
                    </h2>
                </div>
                <img src="/images/footer.png" alt="footer-image" className="footer-image" />
            </div>

            {/* 위로 올라가기 버튼 */}
            {showScrollTopButton && (
                <button className="scroll-to-top-button" onClick={handleScrollToTop}>
                    ▲
                </button>
            )}
        </>
    );
}

export default Main;
