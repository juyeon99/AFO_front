import React from 'react';
import { motion } from 'framer-motion';
import styles from '../../../css/scentlens/PerfumeCard.module.css';
import brandEnData from "../../../data/brands_en.json";

// PerfumeCard 컴포넌트 : 개별 향수 정보를 카드 형태로 표시
const PerfumeCard = ({ perfume, currentTheme }) => {
    const language = localStorage.getItem('language') || 'english';
    
    const brandLookup = Object.fromEntries(
        brandEnData.map(({ brand_kr, brand_en }) => [brand_kr, brand_en])
    );
    
    // perfume이 없거나 url이 없는 경우 처리
    if (!perfume || !perfume.url) {
        console.error('향수 데이터가 없거나 불완전합니다:', perfume);
        return (
            <motion.div
                className={`${styles.perfume_card} ${currentTheme ? styles[currentTheme] : ''}`}
                whileHover={{ scale: 1.02 }}
            >
                <div className={styles.perfume_info}>
                    <h3 className={styles.perfume_name}>{language === 'english' ? "Loading data..." : "데이터 로딩 중..."}</h3>
                    <p className={styles.perfume_description}>{language === 'english' ? "Fetching perfume information..." : "향수 정보를 불러오는 중입니다."}</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`${styles.perfume_card} ${currentTheme ? styles[currentTheme] : ''}`}
            whileHover={{ scale: 1.02 }}
        >
            <motion.img
                src={perfume.url}
                alt={perfume.name || 'Perfume Image'}
                className={styles.perfume_image}
            />
            <div className={styles.perfume_info}>
                <h3 className={styles.perfume_name}>{perfume.name || (language === 'english' ? "No Name" : "이름 없음")}</h3>
                <p className={styles.perfume_brand}>{(language === "english" ? brandLookup[perfume.brand] || perfume.brand : perfume.brand) || (language === 'english' ? "No Brand Information" : "브랜드 정보 없음")}</p>
                <p className={styles.perfume_description}>{perfume.content || (language === 'english' ? "No Description" : "설명 없음")}</p>
            </div>
        </motion.div>
    );
};

export default PerfumeCard;