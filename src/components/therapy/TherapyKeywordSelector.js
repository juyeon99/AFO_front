import React, { useState, useEffect } from "react";
import TherapyKeywordDescription from "./TherapyKeywordDescription";
import styles from "../../css/therapy/TherapyKeywordSelector.module.css";
import { useNavigate } from 'react-router-dom';
import {
    FaMoon, FaCouch, FaBed,  // 수면 & 회복
    FaBook, FaBriefcase, FaBrain,  // 집중 & 마인드풀니스
    FaSun, FaRunning, FaSmile,  // 활력 & 에너지
    FaHeart, FaCloud, FaSpa,  // 평온 & 스트레스 해소
    FaBalanceScale, FaLaughBeam, FaStar,  // 기쁨 & 긍정
    FaWind, FaLeaf, FaSeedling  // 리프레시 & 클린 에어
} from 'react-icons/fa';

// 향기 테라피 키워드 선택 컴포넌트
// 사용자가 선택한 카테고리에 따른 세부 키워드들을 보여주고 선택할 수 있게 함

// 각 카테고리별 스타일 매핑
const categoryStyles = {
    "수면 & 회복": styles.sleep,
    "집중 & 마인드풀니스": styles.focus,
    "활력 & 에너지": styles.energy,
    "평온 & 스트레스 해소": styles.calm,
    "기쁨 & 긍정": styles.happiness,
    "리프레시 & 클린 에어": styles.refresh,
};

// 각 카테고리별 키워드와 설명 데이터
const keywordData = {
    "수면 & 회복": [
        { name: "숙면", description: "깊고 따뜻한 감각으로 몸과 마음을 감싸는 향" },
        { name: "긴장 완화", description: "몸의 긴장을 풀어 이완되는 부드러운 향" },
        { name: "불면증 완화", description: "수면을 돕고 긴장을 해소하는 포근한 향" }
    ],
    "집중 & 마인드풀니스": [
        { name: "학습 집중", description: "머리를 맑게 하고 집중력을 높이는 향" },
        { name: "업무 몰입", description: "에너지를 유지하며 몰입감을 높이는 향" },
        { name: "정신 명료함", description: "사고를 또렷하게 정리해주는 깔끔한 향" }
    ],
    "활력 & 에너지": [
        { name: "아침 리프레시", description: "하루를 상쾌하게 시작하는 신선한 향" },
        { name: "운동 전후", description: "에너지를 끌어올리고 몸을 깨우는 향" },
        { name: "기분 전환", description: "피로를 날리고 활력을 주는 상큼한 향" }
    ],
    "평온 & 스트레스 해소": [
        { name: "내면의 안정", description: "불안감을 덜어내고 평온한 기운을 주는 향" },
        { name: "긴장 완화", description: "스트레스를 풀어주고 깊은 안정감을 주는 향" },
        { name: "힐링 & 회복", description: "마음을 치유하고 재충전을 돕는 자연적인 향" }
    ],
    "기쁨 & 긍정": [
        { name: "감정 밸런스", description: "기분을 안정시키고 균형을 유지하는 향" },
        { name: "밝은 기분", description: "생기 넘치는 활력으로 기분을 밝혀주는 향" },
        { name: "행복한 기억", description: "따뜻한 추억과 편안함을 떠올리게 하는 향" }
    ],
    "리프레시 & 클린 에어": [
        { name: "공기 정화", description: "깨끗한 환경을 조성하는 신선한 향" },
        { name: "머리 맑음", description: "두뇌를 맑고 깨끗하게 해주는 청량한 향" },
        { name: "리셋 & 새로움", description: "새로운 시작을 준비하는 상쾌한 향" }
    ]
};

// 각 키워드에 매칭되는 아이콘 매핑
const keywordIcons = {
    // 수면 & 회복
    "숙면": FaMoon,
    "긴장 완화": FaCouch,
    "불면증 완화": FaBed,

    // 집중 & 마인드풀니스
    "학습 집중": FaBook,
    "업무 몰입": FaBriefcase,
    "정신 명료함": FaBrain,

    // 활력 & 에너지
    "아침 리프레시": FaSun,
    "운동 전후": FaRunning,
    "기분 전환": FaSmile,

    // 평온 & 스트레스 해소
    "내면의 안정": FaHeart,
    "긴장 완화": FaCloud,
    "힐링 & 회복": FaSpa,

    // 기쁨 & 긍정
    "감정 밸런스": FaBalanceScale,
    "밝은 기분": FaLaughBeam,
    "행복한 기억": FaStar,

    // 리프레시 & 클린 에어
    "공기 정화": FaWind,
    "머리 맑음": FaLeaf,
    "리셋 & 새로움": FaSeedling
};

// 각 카테고리별 관련 태그 데이터
const categoryTags = {
    "수면 & 회복": "#편안한수면 #깊은휴식 #이완 #포근한느낌",
    "집중 & 마인드풀니스": "#집중력상승 #정신맑음 #생산성향상 #몰입유도",
    "활력 & 에너지": "#에너지충전 #활력업 #기분전환 #리프레시",
    "평온 & 스트레스 해소": "#마음의평화 #긴장완화 #불안감해소 #감정안정",
    "기쁨 & 긍정": "#밝은기분 #행복감 #긍정에너지 #감정균형",
    "리프레시 & 클린 에어": "#공기정화 #맑은느낌 #새로운시작 #상쾌한기운"
};

const TherapyKeywordSelector = ({ category, onBack }) => {
    // 선택된 키워드 상태 관리
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    const navigate = useNavigate();

    // 컴포넌트 마운트 시 스크롤 위치 조정
    useEffect(() => {
        const scrollToKeywords = () => {
            const backArrowElement = document.querySelector(`.${styles.backArrow}`);
            if (backArrowElement) {
                const offset = backArrowElement.offsetTop + 130; // 화살표 위에 20px 여백
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        };
        setTimeout(scrollToKeywords, 100);
    }, []);

    // 키워드 클릭 핸들러
    const handleKeywordClick = (keyword) => {
        if (selectedKeyword?.name === keyword.name) {
            setSelectedKeyword(null);  // 이미 선택된 카드 클릭 시 선택 해제
        } else {
            setSelectedKeyword(keyword);    // 새로운 키워드 선택
        }
    };

    return (
        <div className={styles.container}>
            {/* 로고 및 헤더 영역 */}
            <img
                src="/images/logo.png"
                alt="로고 이미지"
                className={styles.logo}
                onClick={() => navigate('/')}
            />
            <div className={styles.header}>
                <span className={styles.backArrow} onClick={onBack}>←</span>
                <h1 className={styles.mainTitle}>필요한 효과를 선택하세요.</h1>
            </div>

            {/* 카테고리 제목 및 태그 영역 */}
            <h2 className={styles.subTitle}>{category}</h2>
            <p className={styles.tags}>{categoryTags[category]}</p>
            <div className={styles.divider}></div>

            {/* 키워드 그리드 영역 */}
            <div className={styles.keywordGrid}>
                {keywordData[category]?.map((keyword, index) => {
                    const IconComponent = keywordIcons[keyword.name];
                    return (
                        <div
                            key={index}
                            className={`${styles.keywordCard} ${categoryStyles[category]} ${selectedKeyword?.name === keyword.name ? styles.selected : ''}`}
                            onClick={() => handleKeywordClick(keyword)}
                        >
                            {/* 키워드 아이콘 */}
                            {IconComponent && (
                                <IconComponent
                                    size={80}
                                    className={styles.keywordImage}
                                />
                            )}
                            {/* 키워드 카드 구분선 */}
                            <div className={styles.cardUnderline} />
                            {/* 키워드 텍스트 */}
                            <p className={styles.keywordText}>{keyword.name}</p>
                        </div>
                    );
                })}
            </div>

            {/* 선택된 키워드 설명 영역 */}
            {selectedKeyword && (
                <TherapyKeywordDescription keyword={selectedKeyword} />
            )}

            {/* 결정 버튼 */}
            <button className={styles.confirmButton}>
                결정하기
            </button>
        </div>
    );
};

export default TherapyKeywordSelector;
