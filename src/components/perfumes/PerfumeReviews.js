import React, { useState, useEffect } from 'react';
import styles from '../../css/perfumes/PerfumeReviews.module.css';
import perfumeData from '../../data/PerfumeData';
import ReviewSlider from '../../components/perfumes/ReviewSlider';
import SimilarPerfumes from '../../components/perfumes/SimilarPerfumes';

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
                e.preventDefault();

                const sliderLine = document.querySelector(`.${styles.sliderLine}`);
                const rect = sliderLine.getBoundingClientRect();

                const cardWidth = 196 + 37; // 카드 너비 + gap
                const containerWidth = 1362 - 40; // 컨테이너 너비

                // 전체 스크롤 가능한 너비 계산
                const totalWidth = cardWidth * (allReviews.length - 1); // 전체 카드의 스크롤 가능한 너비
                const maxScrollable = Math.max(0, totalWidth); // 음수 방지

                const mouseX = e.clientX;
                const sliderStart = rect.left;
                const sliderWidth = rect.width - 100;

                const relativeX = mouseX - sliderStart;
                const percentage = Math.max(0, Math.min(100, (relativeX / sliderWidth) * 100));

                requestAnimationFrame(() => {
                    // 스크롤 위치 계산 및 경계값 처리
                    const newOffset = Math.min((percentage / 100) * maxScrollable, maxScrollable);

                    // 슬라이더와 카드 위치 업데이트
                    setSliderLeft(percentage);
                    setCardOffset(newOffset);
                });
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        // 성능 최적화를 위한 passive 이벤트 리스너
        window.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, allReviews.length]);

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


            {/* 유사 향수 섹션 추가 */}
            <div className={styles.similarPerfumesSection}>
                <SimilarPerfumes perfumeId={perfumeId} />
            </div>
        </div>
    );
};

export default PerfumeReviews;