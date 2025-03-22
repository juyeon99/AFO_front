import React, { useState, useEffect } from "react";
import styles from "../../css/therapy/TherapyCategories.module.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ColorLoadingScreen from '../../components/loading/ColorLoadingScreen';
import { fetchTherapyResponse, selectLoading } from '../../module/TherapyModule';

// 향기 테라피의 메인 카테고리 선택 컴포넌트
// 원형 메뉴 형태로 카테고리를 표시하고 선택할 수 있게 함

const language = localStorage.getItem('language') || 'english';

// 카테고리 데이터 정의
const categories = [
    // 각 카테고리의 이름과 대표 이미지 정의
    { name: language === 'english' ? "Sleep & Recovery" : "수면 & 회복", image: "https://health.chosun.com/site/data/img_dir/2024/07/19/2024071902007_0.jpg" },
    { name: language === 'english' ? "Focus & Mindfulness" : "집중 & 마인드풀니스", image: "https://www.brainmedia.co.kr/Library/FileDown.aspx?filename=KakaoTalk_20190923_141307132s(4).jpg&filepath=" },
    { name: language === 'english' ? "Vitality & Energy" : "활력 & 에너지", image: "https://i0.wp.com/habitdays.com/wp-content/uploads/2024/03/Healthy-lifestyle_man-woman-practicing-yoga-outdoor_23-2148196903.jpg?fit=728%2C485&ssl=1" },
    { name: language === 'english' ? "Calm & Stress Relief" : "평온 & 스트레스 해소", image: "https://cdn.news.hidoc.co.kr/news/photo/202107/25263_60448_0811.jpg" },
    { name: language === 'english' ? "Joy & Positivity" : "기쁨 & 긍정", image: "https://img.segye.com/content/image/2016/05/04/20160504514369.jpg" },
    { name: language === 'english' ? "Refresh & Clean Air" : "리프레시 & 클린 에어", image: "https://model.foto.ne.jp/free/img/images_big/m030034.jpg" }
];

// 각 카테고리별 스타일 매핑
const categoryStyles = {
    [language === 'english' ? "Sleep & Recovery" : "수면 & 회복"]: styles.sleep,
    [language === 'english' ? "Focus & Mindfulness" : "집중 & 마인드풀니스"]: styles.focus,
    [language === 'english' ? "Vitality & Energy" : "활력 & 에너지"]: styles.energy,
    [language === 'english' ? "Calm & Stress Relief" : "평온 & 스트레스 해소"]: styles.calm,
    [language === 'english' ? "Joy & Positivity" : "기쁨 & 긍정"]: styles.happiness,
    [language === 'english' ? "Refresh & Clean Air" : "리프레시 & 클린 에어"]: styles.refresh,
};

const TherapyCategories = ({ onClose }) => {
    // 선택된 카테고리 상태 관리
    const [selectedCategory, setSelectedCategory] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);

    // 컴포넌트가 마운트될 때 자동 스크롤
    useEffect(() => {
        const scrollToCategories = () => {
            const categoriesElement = document.querySelector(`.${styles.categoriesContainer}`);
            if (categoriesElement) {
                // 부드러운 스크롤 효과
                window.scrollTo({
                    top: categoriesElement.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        };

        // setTimeout을 사용하여 컴포넌트가 완전히 렌더링된 후 스크롤
        setTimeout(scrollToCategories, 100);
    }, []);

    // 카테고리 선택 핸들러 추가
    const handleCategorySelect = async (categoryName, categoryIndex) => {
        try {
            // API 요청 (loading 상태는 reducer에서 자동으로 처리됨)
            await dispatch(fetchTherapyResponse(language, categoryIndex));

            // API 요청이 성공하면 페이지 이동
            navigate('/therapy/recommend', {
                state: {
                    category: categoryName,
                    keyword: { name: categoryName }
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const texts = {
        korean: {
            loading: "디퓨저를 찾는 중...",
            title: "현재 필요한 상태를 골라보세요."
        },
        english: {
            loading: "Searching for diffusers...",
            title: "Select the state you need."
        },
    };

    return (
        <div className={styles.container}>
            {loading && (
                <ColorLoadingScreen loadingText={language === 'english' ? texts.english.loading : texts.korean.loading} />
            )}

            {/* 카테고리 선택 전 초기 화면 */}
            {!selectedCategory && (
                <>
                    <img
                        src="/images/logo-en.png"
                        alt="logo"
                        className={styles.logo}
                        onClick={() => navigate('/')}
                    />
                    <h2 className={styles.heading}>{language === 'english' ? texts.english.title : texts.korean.title}</h2>
                </>
            )}

            {/* 카테고리 선택 영역 */}
            <div className={styles.categoriesContainer}>
                <div className={styles.circleMenu}>
                    {categories.map((category, index) => (
                        <div
                            key={category.name}
                            className={`${styles.categoryItem} ${styles[`position${index}`]} ${categoryStyles[category.name]}`}
                            onClick={() => handleCategorySelect(category.name, index)}
                            data-name={category.name}
                        >
                            <img src={category.image} alt={category.name} className={styles.categoryImage} />
                        </div>
                    ))}
                    <button className={styles.closeButton} onClick={onClose}>CLOSE</button>
                </div>
            </div>
        </div>
    );
};

export default TherapyCategories;
