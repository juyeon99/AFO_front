import React from 'react';
import styles from '../../css/perfumes/PerfumeReviews.module.css';

const PerfumeReviews = ({ perfumeId }) => {
    // 가상의 리뷰 데이터
    const reviews = [
        {
            id: 1,
            type: "expert",
            reviewer: "조향사 김OO",
            content: "클래식한 향이 매력적인 향수입니다.",
        },
        {
            id: 2,
            type: "user",
            reviewer: "위쌈바",
            content: "오래 지속되고 은은한 향이 좋아요",
        }
    ];

    return (
        <div className={styles.reviewsContainer}>
            <div className={styles.reviewsHeader}>
                <h3>리뷰</h3>
                <button className={styles.writeReviewBtn}>리뷰 작성하기</button>
            </div>

            <div className={styles.reviewSections}>
                <div className={styles.expertReviews}>
                    <h4>조향사 리뷰</h4>
                    {reviews
                        .filter(review => review.type === "expert")
                        .map(review => (
                            <div key={review.id} className={styles.reviewCard}>
                                <p className={styles.reviewer}>{review.reviewer}</p>
                                <p className={styles.content}>{review.content}</p>
                            </div>
                        ))}
                </div>

                <div className={styles.userReviews}>
                    <h4>사용자 리뷰</h4>
                    {reviews
                        .filter(review => review.type === "user")
                        .map(review => (
                            <div key={review.id} className={styles.reviewCard}>
                                <p className={styles.reviewer}>{review.reviewer}</p>
                                <p className={styles.content}>{review.content}</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default PerfumeReviews;