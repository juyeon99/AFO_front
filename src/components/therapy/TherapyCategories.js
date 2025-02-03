import React, { useState, useEffect } from "react";
import TherapyKeywordSelector from "../../components/therapy/TherapyKeywordSelector";
import styles from "../../css/therapy/TherapyCategories.module.css";
import { useNavigate } from 'react-router-dom';

// 향기 테라피의 메인 카테고리 선택 컴포넌트
// 원형 메뉴 형태로 카테고리를 표시하고 선택할 수 있게 함

// 카테고리 데이터 정의
const categories = [
    // 각 카테고리의 이름과 대표 이미지 정의
    { name: "수면 & 회복", image: "https://health.chosun.com/site/data/img_dir/2024/07/19/2024071902007_0.jpg" },
    { name: "집중 & 마인드풀니스", image: "https://www.brainmedia.co.kr/Library/FileDown.aspx?filename=KakaoTalk_20190923_141307132s(4).jpg&filepath=" },
    { name: "활력 & 에너지", image: "https://i0.wp.com/habitdays.com/wp-content/uploads/2024/03/Healthy-lifestyle_man-woman-practicing-yoga-outdoor_23-2148196903.jpg?fit=728%2C485&ssl=1" },
    { name: "평온 & 스트레스 해소", image: "https://cdn.news.hidoc.co.kr/news/photo/202107/25263_60448_0811.jpg" },
    { name: "기쁨 & 긍정", image: "https://img.segye.com/content/image/2016/05/04/20160504514369.jpg" },
    { name: "리프레시 & 클린 에어", image: "https://model.foto.ne.jp/free/img/images_big/m030034.jpg" }
];

// 각 카테고리별 스타일 매핑
const categoryStyles = {
    "수면 & 회복": styles.sleep,
    "집중 & 마인드풀니스": styles.focus,
    "활력 & 에너지": styles.energy,
    "평온 & 스트레스 해소": styles.calm,
    "기쁨 & 긍정": styles.happiness,
    "리프레시 & 클린 에어": styles.refresh,
};

const TherapyCategories = ({ onClose }) => {
    // 선택된 카테고리 상태 관리
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

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

    // 뒤로가기 처리 및 스크롤 위치 조정
    const handleBack = () => {
        setSelectedCategory(null);
        setTimeout(() => {
            const circleMenuElement = document.querySelector(`.${styles.circleMenu}`);
            if (circleMenuElement) {
                const offset = circleMenuElement.offsetTop - window.innerHeight / 3 + circleMenuElement.offsetHeight / 2;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    return (
        <div className={styles.container}>
            {/* 카테고리 선택 전 초기 화면 */}
            {!selectedCategory && (
                <>
                    <img
                        src="/images/logo.png"
                        alt="로고 이미지"
                        className={styles.logo}
                        onClick={() => navigate('/')}
                    />
                    <h2 className={styles.heading}>현재 필요한 상태를 골라보세요.</h2>
                </>
            )}

            {/* 카테고리 선택 영역 */}
            <div className={styles.categoriesContainer}>
                {selectedCategory ? (
                    // 카테고리 선택 후 키워드 선택 화면
                    <TherapyKeywordSelector
                        category={selectedCategory}
                        onBack={handleBack}
                    />
                ) : (
                    // 원형 메뉴로 카테고리 표시
                    <div className={styles.circleMenu}>
                        {categories.map((category, index) => (
                            <div
                                key={category.name}
                                className={`${styles.categoryItem} ${styles[`position${index}`]} ${categoryStyles[category.name]}`}
                                onClick={() => setSelectedCategory(category.name)}
                                data-name={category.name}
                            >
                                <img src={category.image} alt={category.name} className={styles.categoryImage} />
                            </div>
                        ))}
                        <button className={styles.closeButton} onClick={onClose}>CLOSE</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TherapyCategories;
