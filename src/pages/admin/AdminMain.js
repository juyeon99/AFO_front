import '../../css/pages/admin/AdminMain.css';
import React, { useEffect, useState, useRef } from 'react';
import Login from '../Login'
import { NavLink } from 'react-router-dom'

function AdminMain() {
    const [scrollY, setScrollY] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [introInView, setIntroInView] = useState(false);
    const [additionalInView1, setAdditionalInView1] = useState(false);
    const [additionalInView2, setAdditionalInView2] = useState(false);
    const [fadeInSectionInView, setFadeInSectionInView] = useState(false);

    const videoRef = useRef(null);
    const introSectionRef = useRef(null);
    const additionalSectionRef1 = useRef(null);
    const additionalSectionRef2 = useRef(null);
    const fadeInSectionRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onloadeddata = () => setLoaded(true);
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

    return (
        <>
            <div className="adminmain-video-container">
            <div className="admin-label">관리자입니다</div>
                <img src="/images/logo-w.png" alt="1번 이미지" className="adminmain-logo-image" />
                <video
                    ref={videoRef}
                    className="adminmain-background-video"
                    src="/videos/main.mp4"
                    autoPlay
                    muted
                    loop
                    style={{ opacity: videoOpacity }}
                ></video>
                <div
                    className="adminmain-overlay"
                    style={{
                        backgroundColor: `rgba(239, 237, 237, ${overlayOpacity})`,
                    }}
                ></div>
                <h1 className="adminmain-title">"일상에 자연스럽게 스며드는 향기, 당신의 순간을 향기로 완성하세요."</h1>
                <div className="adminmain-content" style={{ opacity: videoOpacity }}>
                    <NavLink to="/chat">
                        <button className="adminmain-start-button">START ▶</button>
                    </NavLink>
                </div>
            </div>

            <div
                className="adminmain-intro-section"
                ref={introSectionRef}
                style={introSectionStyle}
            >
                <h2>매 순간을 특별하게 만드는 힘, 방향에서 당신만의 향을 찾아보세요.</h2>
                <div className="adminmain-intro-content-wrapper">
                    <div className="adminmain-intro-item1">
                        <img src="/images/1.png" alt="1번 이미지" className="adminmain-intro-image" />
                        <h3>긍정적인 감정과 에너지 상승</h3>
                        <p>향은 자신감을 채워주고 <br />활기찬 하루로 시작할 수 있도록 <br />나의 삶에 도움을 줍니다.</p>
                    </div>
                    <div className="adminmain-intro-item2">
                        <img src="/images/2.png" alt="2번 이미지" className="adminmain-intro-image" />
                        <h3>스트레스 완화와 심신 안정</h3>
                        <p>스트레스 받은 오늘의 마음을<br />향으로 다스려보세요. 잔잔히 흘러오는 향기는 <br />여러분의 마음을 편안하게 안정시켜줄 것입니다.</p>
                    </div>
                    <div className="adminmain-intro-item3">
                        <img src="/images/3.png" alt="3번 이미지" className="adminmain-intro-image" />
                        <h3>기억력 향상과 집중력 강화</h3>
                        <p>특정 향기는 기억력을 자극해 <br />중요한 순간을 기억하도록 돕고, 집중력을 높여 <br />일과 학습 효율을 향상시킵니다.</p>
                    </div>
                </div>
            </div>

            <div
                className="adminmain-additional-section"
                ref={additionalSectionRef1}
                style={additionalSectionStyle1}
            >
                <h2>향은 단순히 맡는 것을 넘어 우리의 감정, 기억, 그리고 하루를 채워주는 강력한 매개체입니다.</h2>
                <h3>●</h3>
                <h3>●</h3>
                <h3>●</h3>
            </div>

            <div
                className="adminmain-additional-section"
                ref={additionalSectionRef2}
                style={additionalSectionStyle2}
            >
                <h2 className="adminmain-additional-h2">방향은 단순한 향 추천이 아닙니다.</h2>
                <div className="adminmain-additional-images">
                    <img src="/images/infoSub1.png" alt="추가 이미지 1" className="adminmain-additional-image" />
                    <img src="/images/infoSub2.png" alt="추가 이미지 2" className="adminmain-additional-image" />
                </div>
                <div className="adminmain-fade-in-section" ref={fadeInSectionRef} style={fadeInSectionStyle}>
                    <h2 className="adminmain-additional-h2">당신이 입력한 이미지와 텍스트를 통해 <span className="adminmain-highlight">맞춤 향을 추천</span>할 뿐만 아니라,<br />
                        <span className="adminmain-highlight">향과 어울리는 색</span>을 통해 <span className="adminmain-highlight">향을 시각적</span>으로 느끼는 감각적 경험을 선사합니다.</h2>
                    <h1>•</h1>
                    <h1>•</h1>
                    <h2 className="adminmain-additional-h2">오직 <span className="adminmain-highlight">방향에서만 만날 수 있는 나만의 향기</span>, 지금 바로 찾아보세요.</h2>
                </div>
            </div>
        </>
    );
}

export default AdminMain;
