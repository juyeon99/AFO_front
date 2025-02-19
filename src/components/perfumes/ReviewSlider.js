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
    onMouseDown,
    setCurrentPage,
    setSliderLeft,
    setCardOffset
}) => {
    const sliderRef = useRef(null);
    const [maxScroll, setMaxScroll] = useState(0);

    useEffect(() => {
        if (allReviews.length > 0) {
            const cardWidth = 196 + 37;
            const totalWidth = allReviews.length * cardWidth;
            const visibleWidth = CARDS_PER_PAGE * cardWidth;
            setMaxScroll(Math.max(0, totalWidth - visibleWidth));
        }
    }, [allReviews.length, CARDS_PER_PAGE]);

    const handleSliderClick = (e) => {
        if (!e.target.className.includes(styles.sliderHandle)) {
            const sliderLine = e.currentTarget;
            const rect = sliderLine.getBoundingClientRect();
            
            // 클릭 위치 계산
            const clickPosition = e.clientX - rect.left;
            const sliderWidth = rect.width - 100; // 핸들 너비 고려
            
            // 백분율 계산 (0-100%)
            const percentage = Math.max(0, Math.min(100, (clickPosition / sliderWidth) * 100));
            
            // 오프셋 계산
            const newOffset = (percentage / 100) * maxScroll;
            
            // 상태 업데이트
            setSliderLeft(percentage);
            setCardOffset(Math.min(newOffset, maxScroll));
            
            // 페이지 계산
            if (totalPages > 1) {
                const newPage = Math.ceil((percentage / 100) * totalPages);
                setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        const percentage = totalPages > 1 ? ((pageNumber - 1) / (totalPages - 1)) * 100 : 0;
        const newOffset = (percentage / 100) * maxScroll;
        
        setCurrentPage(pageNumber);
        setSliderLeft(percentage);
        setCardOffset(newOffset);
    };

    return (
        <div className={styles.sliderContainer}>
            <div
                ref={sliderRef}
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