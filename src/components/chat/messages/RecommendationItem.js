import React from 'react';
import styles from '../../../css/chat/RecommendationItem.module.css';
import { useRecommendation } from '../../../pages/chat/hooks/useRecommendation';
import StarIcon from '@mui/icons-material/Star';  // 일반 추천
import StyleIcon from '@mui/icons-material/Style'; // 패션
import HomeIcon from '@mui/icons-material/Home';   // 인테리어
import SpaIcon from '@mui/icons-material/Spa';     // 테라피
import { SCENT_FILTERS } from '../../../pages/chat/hooks/useRecommendation';
import SaveScentButton from './SaveScentButton';

const RecommendationItem = ({ imageUrl, recommendations, openImageModal, chatId }) => {
    console.log('RecommendationItem chatId:', chatId);

    // lineId로 해당하는 향수 계열 찾기
    // filters를 직접 사용
    const getLineName = (lineId) => {
        if (!lineId) return '';
        const filter = SCENT_FILTERS.find(f => f.id === parseInt(lineId));
        return filter ? filter.name : '';
    };

    const getRecommendationTypeInfo = (type) => {
        switch (type) {
            case 1:
                return {
                    icon: <StarIcon sx={{ fontSize: 28, color: '#fa9522' }} />,  // 일반 추천 아이콘
                    label: 'Perfume Recommendation',
                    subLabel: '당신을 위한 맞춤 향수 추천',
                    className: styles.generalRecommendation,
                    theme: '#fa9522'
                };
            case 2:
                return {
                    icon: <StyleIcon sx={{ fontSize: 28, color: '#ff6bf8' }} />,  // 패션 아이콘
                    label: 'Fashion & Fragrance',
                    subLabel: '패션과 조화로운 향수 추천',
                    className: styles.fashionRecommendation,
                    theme: '#ff6bf8'
                };
            case 3:
                return {
                    icon: <HomeIcon sx={{ fontSize: 28, color: '#51CF66' }} />,  // 인테리어 아이콘
                    label: 'Space & Scent',
                    subLabel: '공간을 채우는 향기 추천',
                    className: styles.interiorRecommendation,
                    theme: '#51CF66'
                };
            case 4:
                return {
                    icon: <SpaIcon sx={{ fontSize: 28, color: '#845EF7' }} />,  // 테라피 아이콘
                    label: 'Aroma Therapy',
                    subLabel: '당신의 삶을 위한 테라피 향수',
                    className: styles.therapyRecommendation,
                    theme: '#845EF7'
                };
            default:
                return {
                    icon: <StarIcon sx={{ fontSize: 28, color: '#007AFF' }} />,
                    label: 'Perfume Recommendation',
                    subLabel: '당신을 위한 맞춤 향수 추천',
                    className: styles.generalRecommendation,
                    theme: '#007AFF'
                };
        }
    };

    const typeInfo = getRecommendationTypeInfo(recommendations[0]?.type || 1);

    return (
        <div className={`${styles.recommendationContainer} ${typeInfo.className}`}>
            <div className={styles.recommendationType} style={{ '--theme-color': typeInfo.theme }}>
                <div className={styles.typeHeader}>
                    {typeInfo.icon}
                    <div className={styles.typeTitles}>
                        <h3 className={styles.typeLabel}>{typeInfo.label}</h3>
                        <p className={styles.typeSubLabel}>{typeInfo.subLabel}</p>
                    </div>
                </div>
                <div className={styles.typeDivider} />
            </div>

            {/* 공통 이미지 영역 */}
            {imageUrl && (
                <div
                    className={styles.commonImageWrapper}
                    onClick={() => {
                        console.log('Image clicked:', imageUrl);
                        if (typeof openImageModal === 'function') {
                            openImageModal(imageUrl); // 이미지 URL을 전달
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={imageUrl}
                        alt="향 이미지"
                        className={styles.commonImage}
                    />
                </div>
            )}

            {/* 제품 카드 그리드 */}
            <div className={styles.cardGrid}>
                {recommendations.map((product, index) => (
                    <div key={index} className={styles.recommendationCard}>
                        <img
                            src={product.productImageUrls?.[0]}
                            alt={product.productNameKr}
                            className={styles.productImage}
                        />
                        <div className={styles.cardContent}>
                            {/* lineId를 향수 계열 이름으로 변환하여 표시 */}
                            {product.lineId && (
                                <p className={styles.productLine}>
                                    {getLineName(product.lineId)}
                                </p>
                            )}
                            <p className={styles.productBrand}>{product.productBrand}</p>
                            <h3 className={styles.productTitle}>{product.productNameKr}</h3>
                            <p className={styles.productGrade}>{product.productGrade}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 통합된 설명 박스 */}
            <div className={styles.unifiedDescriptionBox}>
                <div className={styles.reasonSection}>
                    <h4 className={styles.descriptionTitle}>추천 이유</h4>
                    {recommendations.map((product, index) => (
                        <div key={index} className={styles.descriptionItem}>
                            <span className={styles.productLabel}>{product.productNameKr}</span>
                            <p className={styles.descriptionText}>{product.reason}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.situationSection}>
                    <h4 className={styles.descriptionTitle}>사용 상황</h4>
                    {recommendations.map((product, index) => (
                        <div key={index} className={styles.descriptionItem}>
                            <span className={styles.productLabel}>{product.productNameKr}</span>
                            <p className={styles.descriptionText}>{product.situation}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 향기 기록하기 버튼 */}
            <SaveScentButton chatId={chatId} />
        </div>
    );
};

export default RecommendationItem;
