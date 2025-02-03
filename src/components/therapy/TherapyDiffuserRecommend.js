import React from 'react';
import styles from '../../css/therapy/TherapyDiffuserRecommend.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import diffuserData from '../../data/DiffuserData';

const TherapyDiffuserRecommend = () => {
    const navigate = useNavigate();
    // 이전 페이지에서 전달된 상태값을 받기 위한 location 훅
    const location = useLocation();
    // location.state에서 category와 keyword 추출 (값이 없을 경우 빈 객체 사용)
    const { category, keyword } = location.state || {};

    // 선택된 카테고리와 키워드에 해당하는 디퓨저 데이터 가져오기
    const selectedData = diffuserData[category]?.[keyword.name];

    // 데이터가 없는 경우 에러 메시지 표시
    if (!selectedData) {
        return <div>데이터를 찾을 수 없습니다.</div>;
    }

    return (
        <div className={styles.container}>
            {/* 헤더 영역: 로고 */}
            <div className={styles.header}>
                <img
                    src="/images/logo.png"
                    alt="로고"
                    className={styles.logo}
                    onClick={() => navigate('/')}
                />
            </div>

            {/* 메인 컨텐츠 */}
            <h1 className={styles.mainTitle}>키워드에 적합한 디퓨저를 추천합니다.</h1>
            {/* 선택된 카테고리 태그 표시 */}
            <p className={styles.categoryTag}>{selectedData.title}</p>

            {/* 디퓨저 추천 영역 */}
            <div className={styles.diffuserGrid}>
                {/* 선택된 데이터의 제품들을 매핑하여 카드로 표시 */}
                {selectedData.products.map((product, index) => (
                    <div key={index} className={styles.diffuserCard}>
                        <div className={styles.cardInner}>
                            {/* 카드 앞면: 제품 이미지와 이름 */}
                            <div className={styles.cardFront}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={styles.diffuserImage}
                                />
                                <div className={styles.divider}></div>
                                <p className={styles.diffuserName}>
                                    {product.name} {product.volume}
                                </p>
                            </div>
                            {/* 카드 뒷면: 제품 설명 */}
                            <div className={styles.cardBack}>
                                <p className={styles.diffuserDescription}>
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 루틴 설명 박스 */}
            <div className={styles.routineBox}>
                <p className={styles.routineText}>{selectedData.routine}</p>
            </div>
        </div>
    );
};

export default TherapyDiffuserRecommend;