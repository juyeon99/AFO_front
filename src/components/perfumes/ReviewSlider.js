import React from 'react';
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
    const handleSliderClick = (e) => {
        if (!e.target.className.includes(styles.sliderHandle)) {
            const sliderLine = e.currentTarget;
            const rect = sliderLine.getBoundingClientRect();
            const clickPosition = e.clientX - rect.left;
            const maxPosition = rect.width - 100;

            const percentage = (clickPosition / maxPosition) * 100;
            const boundedPercentage = Math.max(0, Math.min(percentage, 100));

            const cardWidth = 196 + 37;
            const maxScroll = (allReviews.length - CARDS_PER_PAGE) * cardWidth;
            const newOffset = Math.min((boundedPercentage / 100) * maxScroll, maxScroll);

            setSliderLeft(boundedPercentage);
            setCardOffset(newOffset);

            const approximatePage = Math.floor((newOffset / maxScroll) * totalPages) + 1;
            if (approximatePage !== currentPage && approximatePage > 0 && approximatePage <= totalPages) {
                setCurrentPage(approximatePage);
            }
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        e.preventDefault();

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
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);

        const cardWidth = 196 + 37;
        const maxScroll = (allReviews.length - CARDS_PER_PAGE) * cardWidth;
        const newOffset = ((pageNumber - 1) / (totalPages - 1)) * maxScroll;

        setCardOffset(Math.min(newOffset, maxScroll));
        setSliderLeft(((pageNumber - 1) / (totalPages - 1)) * 100);
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