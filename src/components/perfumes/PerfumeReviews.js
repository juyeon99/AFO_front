import React, { useState, useEffect } from 'react';
import styles from '../../css/perfumes/PerfumeReviews.module.css';
import perfumeData from '../../data/PerfumeData';
import ReviewSlider from '../../components/perfumes/ReviewSlider';

const PerfumeReviews = ({ perfumeId }) => {
    const [selectedReview, setSelectedReview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [sliderLeft, setSliderLeft] = useState(0);
    const [cardOffset, setCardOffset] = useState(0);

    const perfume = perfumeData.find(p => p.id === perfumeId);
    const { expert: expertReviews, user: userReviews } = perfume.reviews;

    const expertTopReview = expertReviews[0];
    const userTopReview = userReviews[0];

    const allReviews = Array.from(
        new Set(
            [...expertReviews, ...userReviews].map(review => JSON.stringify({
                content: review.content,
                reviewer: review.reviewer,
                type: review.type
            }))
        )
    ).map(str => JSON.parse(str));

    const CARDS_PER_PAGE = 5;
    const totalPages = Math.ceil(allReviews.length / CARDS_PER_PAGE);

    const getCurrentPageReviews = () => {
        // 전체 리뷰를 반환
        return allReviews;
    };

    const handleMouseDown = (e) => {
        if (e.target.className.includes(styles.sliderHandle)) {
            setIsDragging(true);
            setStartX(e.clientX);
        }
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                const sliderLine = document.querySelector(`.${styles.sliderLine}`);
                const rect = sliderLine.getBoundingClientRect();
                
                const newPosition = e.clientX - rect.left;
                const maxPosition = rect.width - 100;
                
                const boundedPosition = Math.max(0, Math.min(newPosition, maxPosition));
                const percentage = (boundedPosition / maxPosition) * 100;
                
                const cardWidth = 196 + 37;
                const maxScroll = (allReviews.length - CARDS_PER_PAGE) * cardWidth;
                const newOffset = Math.min((percentage / 100) * maxScroll, maxScroll);
                
                setSliderLeft(percentage);
                setCardOffset(newOffset);

                const approximatePage = Math.floor((newOffset / maxScroll) * totalPages) + 1;
                if (approximatePage !== currentPage && approximatePage > 0 && approximatePage <= totalPages) {
                    setCurrentPage(approximatePage);
                }
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, currentPage, allReviews.length, totalPages]);

    return (
        <div className={styles.reviewsContainer}>
            <div className={styles.topReviewsSection}>
                <div className={styles.topReviewCard}>
                    <h4>조향사 리뷰 top1</h4>
                    <div className={styles.reviewContent}>
                        <p>{expertTopReview.content}</p>
                    </div>
                </div>
                <div className={styles.topReviewCard}>
                    <h4>사용자 리뷰 top1</h4>
                    <div className={styles.reviewContent}>
                        <p>{userTopReview.content}</p>
                    </div>
                </div>
            </div>

            <div className={styles.reviewListSection}>
                <div className={styles.reviewsHeader}>
                    <button className={styles.writeReviewBtn}>리뷰 작성하기</button>
                </div>

                <div className={styles.reviewCardsContainer}>
                    <div
                        className={styles.reviewCards}
                        style={{ transform: `translateX(-${cardOffset}px)` }}
                    >
                        {getCurrentPageReviews().map((review, index) => (
                            <div
                                key={`review-${index}`}
                                className={`${styles.reviewCard} ${selectedReview === index ? styles.selected : ''}`}
                                onClick={() => setSelectedReview(index)}
                            >
                                <img
                                    src={perfume.imageUrls[0]}
                                    alt="향수 이미지"
                                    className={styles.perfumeThumb}
                                />
                                <div className={styles.divider} />
                                <p className={styles.reviewContent}>{review.content}</p>
                                <p className={styles.reviewerName}>{review.reviewer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <ReviewSlider
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isDragging={isDragging}
                    sliderLeft={sliderLeft}
                    cardOffset={cardOffset}
                    allReviews={allReviews}
                    CARDS_PER_PAGE={CARDS_PER_PAGE}
                    onMouseDown={handleMouseDown}
                    setCurrentPage={setCurrentPage}
                    setSliderLeft={setSliderLeft}
                    setCardOffset={setCardOffset}
                />
            </div>
        </div>
    );
};

export default PerfumeReviews;