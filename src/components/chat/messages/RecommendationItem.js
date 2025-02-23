import React from 'react';
import styles from '../../../css/chat/RecommendationItem.module.css';

const RecommendationItem = ({ recommendation }) => {
    const { productNameKr, productBrand, productGrade, reason, situation, productImageUrls } = recommendation;

    return (
        <div className={styles.recommendationItem}>
            {productImageUrls && productImageUrls.length > 0 && (
                <img
                    src={productImageUrls[0]}
                    alt={productNameKr}
                    className={styles.productImage}
                />
            )}
            <div className={styles.recommendationContent}>
                <h3 className={styles.productTitle}>{productNameKr}</h3>
                <p className={styles.productInfo}>{productBrand} • {productGrade}</p>
                <p className={styles.recommendReason}>{reason}</p>
                <p className={styles.situation}>{situation}</p>
            </div>
        </div>
    );
};

export default RecommendationItem;
