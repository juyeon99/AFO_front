import React, { useRef, useState, useEffect } from 'react';
import styles from '../../css/perfumes/PerfumeReviews.module.css';

const ReviewSlider = ({
    currentPage,
    totalPages,
    isDragging,
    sliderLeft,
    cardOffset,
    allReviews,
    CARDS_PER_PAGE,
    onSliderClick,
    onMouseDown,
    onMouseMove,
    onPageChange,
    setCurrentPage,
    setSliderLeft,
    setCardOffset
}) => {
    const sliderRef = useRef(null);
    const [maxScroll, setMaxScroll] = useState(0);

    useEffect(() => {
        if (sliderRef.current) {
            const cardWidth = 196 + 37;
            const visibleWidth = CARDS_PER_PAGE * cardWidth;
            const totalWidth = allReviews.length * cardWidth;
            setMaxScroll(Math.max(0, totalWidth - visibleWidth)); // 이동 가능한 최대 거리 계산
        }
    }, [allReviews.length, CARDS_PER_PAGE]);

    const handleSliderClick = (e) => {
        if (!e.target.className.includes(styles.sliderHandle)) {
            const sliderLine = e.currentTarget;
            const rect = sliderLine.getBoundingClientRect();
            
            // 전체 카드 너비와 보이는 영역 너비 계산
            const cardWidth = 196 + 37;
            const totalWidth = allReviews.length * cardWidth;
            const visibleWidth = CARDS_PER_PAGE * cardWidth;
            const maxScroll = Math.max(0, totalWidth - visibleWidth);

            // 클릭 위치에 따른 비율 계산
            const clickPosition = e.clientX - rect.left;
            const sliderWidth = rect.width - 100; // 핸들 너비 고려
            
            // 카드 수에 따른 이동 거리 조정
            const moveRatio = visibleWidth / totalWidth;
            const adjustedPosition = clickPosition / moveRatio;
            const percentage = (adjustedPosition / sliderWidth) * 100;
            
            const boundedPercentage = Math.max(0, Math.min(percentage, 100));
            const newOffset = (boundedPercentage / 100) * maxScroll;

            setSliderLeft(boundedPercentage);
            setCardOffset(Math.min(newOffset, maxScroll));

            // 페이지 번호 업데이트
            const approximatePage = Math.ceil((newOffset / maxScroll) * totalPages);
            if (approximatePage !== currentPage && approximatePage > 0 && approximatePage <= totalPages) {
                setCurrentPage(approximatePage);
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        
        const cardWidth = 196 + 37;
        const totalWidth = allReviews.length * cardWidth;
        const visibleWidth = CARDS_PER_PAGE * cardWidth;
        const maxScroll = Math.max(0, totalWidth - visibleWidth);
        
        // 카드 수에 따른 이동 거리 조정
        const moveRatio = visibleWidth / totalWidth;
        const percentage = ((pageNumber - 1) / (totalPages - 1)) * 100;
        const adjustedPercentage = percentage * moveRatio;
        
        setSliderLeft(adjustedPercentage);
        setCardOffset((percentage / 100) * maxScroll);
    };

    return (
        <div className={styles.sliderContainer}>
            <div
                className={styles.sliderLine}
                onClick={handleSliderClick}
                onMouseDown={onMouseDown}
            >
                <div
                    className={styles.sliderHandle}
                    style={{
                        left: `${sliderLeft}%`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                />
            </div>
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <div
                        key={`page-${idx}`}
                        className={`${styles.paginationDot} ${currentPage === idx + 1 ? styles.active : ''}`}
                        onClick={() => handlePageChange(idx + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewSlider;