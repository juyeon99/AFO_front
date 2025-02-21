import React, { useState, useEffect } from 'react';
import styles from '../../css/perfumes/PerfumeReviews.module.css';
import ReviewSlider from '../../components/perfumes/ReviewSlider';
import { useSelector, useDispatch } from 'react-redux';
import { selectPerfumes } from '../../module/PerfumeModule';
import { fetchReviews, selectReviews, createNewReview } from '../../module/ReviewModule';
import ReviewModal from './ReviewModal';
import { fetchUserLikedReviews, createHeart, deleteHeart } from '../../api/PerfumeAPICalls';

const PerfumeReviews = ({ perfumeId }) => {
    const dispatch = useDispatch();

    const [selectedReview, setSelectedReview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [sliderLeft, setSliderLeft] = useState(0);
    const [cardOffset, setCardOffset] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [likedReviews, setLikedReviews] = useState([]);

    const perfumes = useSelector(selectPerfumes);
    const perfume = perfumes?.find(p => p.id === perfumeId);
    const reviews = useSelector(selectReviews) ?? [];

    const auth = JSON.parse(localStorage.getItem('auth'));
    const userId = auth?.id;

    const CARDS_PER_PAGE = 5;
    const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);

    useEffect(() => {
        if (perfumeId) {
            dispatch(fetchReviews(perfumeId));
        }
    }, [perfumeId, dispatch]);

    useEffect(() => {
        if (reviews.length > 0) {
            setCurrentPage(totalPages);
            setSliderLeft(0);
            setCardOffset(0);
        }
    }, [reviews.length, CARDS_PER_PAGE]);

    useEffect(() => {
        if (perfumeId && userId) {
            loadLikedReviews();
        }
    }, [perfumeId, userId]);

    const loadLikedReviews = async () => {
        if (!userId) return;
        try {
            const likedReviewIds = await fetchUserLikedReviews(userId);
            setLikedReviews(likedReviewIds);
        } catch (error) {
            console.error("좋아요 데이터 불러오기 실패:", error);
        }
    };

    const handleToggleHeart = async (reviewId) => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            if (likedReviews.includes(reviewId)) {
                await deleteHeart(reviewId);
                setLikedReviews(prev => prev.filter(id => id !== reviewId));
            } else {
                await createHeart(userId, reviewId);
                setLikedReviews(prev => [...prev, reviewId]);
            }
            await loadLikedReviews();
        } catch (error) {
            console.error("좋아요 처리 실패:", error);
        }
    };

    const handleReviewSubmit = async () => {
        if (!userId) {
            alert('리뷰를 작성하려면 로그인이 필요합니다.');
            return;
        }

        try {
            await dispatch(createNewReview({
                productId: perfumeId,
                memberId: userId,
                content: reviewContent
            }));

            setReviewContent('');
            setIsModalOpen(false); // 모달 닫기

            // 리뷰 목록 즉시 새로고침
            await dispatch(fetchReviews(perfumeId));
        } catch (error) {
            console.error("리뷰 작성 실패:", error);
            alert('리뷰 작성에 실패했습니다.');
        }
    };

    // 모달 닫기 핸들러 수정
    const handleModalClose = async () => {
        setIsModalOpen(false);
        if (userId) {
            await dispatch(fetchReviews(perfumeId));
            await loadLikedReviews();
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const cardWidth = 196 + 37;
        const maxOffset = (reviews.length - CARDS_PER_PAGE) * cardWidth;

        let newOffset = cardOffset + (e.clientX - startX);
        newOffset = Math.max(0, Math.min(newOffset, maxOffset));

        setCardOffset(newOffset);
        setSliderLeft((newOffset / maxOffset) * 100);

        const newPage = Math.ceil(newOffset / (cardWidth * CARDS_PER_PAGE)) + 1;
        if (newPage !== currentPage) setCurrentPage(newPage);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, cardOffset, reviews.length, totalPages]);

    return (
        <div className={styles.reviewsContainer}>
            <div className={styles.topReviewsSection}>
                <div className={styles.topReviewCard}>
                    <h4>사용자 리뷰 Top 1</h4>
                    <div className={styles.reviewContent}>
                        <p>{reviews?.[0]?.content || "사용자 리뷰가 없습니다."}</p>
                    </div>
                </div>
            </div>

            <div className={styles.reviewListSection}>
                <button className={styles.writeReviewBtn} onClick={() => setIsModalOpen(true)}>
                    리뷰 작성하기
                </button>

                <ReviewModal isOpen={isModalOpen} onClose={handleModalClose} perfume={perfume} onSubmit={handleReviewSubmit} />

                <div className={styles.reviewCardsContainer}>
                    <div className={styles.reviewCards} style={{ transform: `translateX(-${cardOffset}px)` }}>
                        {reviews.map(review => (
                            <div key={review.id} className={`${styles.reviewCard} ${likedReviews.includes(review.id) ? styles.likedBorder : ''}`}>
                                <p className={styles.reviewContent}>{review.content}</p>
                                <p className={styles.reviewerName}>{review.name}</p>
                                <button className={likedReviews.includes(review.id) ? styles.heartActive : styles.heart}
                                    onClick={() => handleToggleHeart(review.id)}>
                                    🙂
                                </button>
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
                    allReviews={reviews}
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
