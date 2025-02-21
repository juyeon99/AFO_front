import React, { useState, useEffect } from 'react';
import styles from '../../css/perfumes/PerfumeReviews.module.css';
import ReviewSlider from '../../components/perfumes/ReviewSlider';
import { useSelector, useDispatch } from 'react-redux';
import { selectPerfumes } from '../../module/PerfumeModule';
import { fetchReviews, selectReviews, createNewReview } from '../../module/ReviewModule';
import ReviewModal from './ReviewModal';
import { fetchUserLikedReviews, createHeart, deleteHeart } from '../../api/PerfumeAPICalls';
import { Heart } from 'lucide-react';

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
    const [heartCounts, setHeartCounts] = useState({});

    useEffect(() => {
        if (perfumeId) {
            dispatch(fetchReviews(perfumeId));
        }
    }, [perfumeId, dispatch]);

    // 리뷰 데이터가 변경될 때마다 슬라이더 상태 업데이트
    useEffect(() => {
        if (reviews.length > 0) {
            const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
            const cardWidth = 196 + 37;
            const maxScroll = (reviews.length - CARDS_PER_PAGE) * cardWidth;

            // 새 리뷰가 추가되면 마지막 페이지로 이동
            setCurrentPage(totalPages);
            setSliderLeft(100);
            setCardOffset(maxScroll);
        } else {
            setCurrentPage(1);
            setSliderLeft(0);
            setCardOffset(0);
        }
    }, [reviews.length]);

    useEffect(() => {
        if (perfumeId && userId) {
            loadLikedReviews();
        }
    }, [perfumeId, userId]);

    // 슬라이더 마우스 이벤트 핸들링
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                const sliderLine = document.querySelector(`.${styles.sliderLine}`);
                if (!sliderLine) return;

                const rect = sliderLine.getBoundingClientRect();
                const newPosition = e.clientX - rect.left;
                const maxPosition = rect.width - 100;

                const boundedPosition = Math.max(0, Math.min(newPosition, maxPosition));
                const percentage = (boundedPosition / maxPosition) * 100;

                const cardWidth = 196 + 37;
                const maxScroll = (reviews.length - CARDS_PER_PAGE) * cardWidth;
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
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, currentPage, reviews.length, totalPages]);

    const loadLikedReviews = async () => {
        if (!userId) return;
        try {
            const likedReviewIds = await fetchUserLikedReviews(userId);
            setLikedReviews(likedReviewIds);
            
            // 각 리뷰의 좋아요 수 가져오기
            const counts = {};
            reviews.forEach(review => {
                counts[review.id] = review.heartCount || 0;
            });
            setHeartCounts(counts);
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
                // 좋아요 취소 시 카운트 감소
                setHeartCounts(prev => ({
                    ...prev,
                    [reviewId]: Math.max(0, (prev[reviewId] || 1) - 1)
                }));
            } else {
                await createHeart(userId, reviewId);
                setLikedReviews(prev => [...prev, reviewId]);
                // 좋아요 시 카운트 증가
                setHeartCounts(prev => ({
                    ...prev,
                    [reviewId]: (prev[reviewId] || 0) + 1
                }));
            }
            await loadLikedReviews(); // 서버와 동기화
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
            setIsModalOpen(false);
            await dispatch(fetchReviews(perfumeId));
        } catch (error) {
            console.error("리뷰 작성 실패:", error);
            alert('리뷰 작성에 실패했습니다.');
        }
    };

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

                <ReviewModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    perfume={perfume}
                    onSubmit={handleReviewSubmit}
                />

                <div className={styles.reviewCardsContainer}>
                    <div
                        className={styles.reviewCards}
                        style={{ transform: `translateX(-${cardOffset}px)` }}
                    >
                        {reviews.map(review => (
                            <div
                                key={review.id}
                                className={`${styles.reviewCard} ${likedReviews.includes(review.id) ? styles.likedBorder : ''}`}
                            >
                                <img
                                    src={perfume?.imageUrlList?.[0]}
                                    alt="향수 이미지"
                                    className={styles.perfumeThumb}
                                />
                                <div className={styles.divider} />
                                <p className={styles.reviewContent}>{review.content}</p>
                                <p className={styles.reviewerName}>{review.memberName}</p>
                                <button
                                    className={likedReviews.includes(review.id) ? styles.heartActive : styles.heart}
                                    onClick={() => handleToggleHeart(review.id)}
                                >
                                    <Heart 
                                        size={20} 
                                        fill={likedReviews.includes(review.id) ? "#FF0000" : "none"}
                                        color={likedReviews.includes(review.id) ? "#FF0000" : "#000000"}
                                    />
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