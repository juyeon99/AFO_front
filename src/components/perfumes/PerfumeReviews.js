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
    const [sliderLeft, setSliderLeft] = useState(0);
    const [cardOffset, setCardOffset] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [likedReviews, setLikedReviews] = useState([]);

    const perfumes = useSelector(selectPerfumes);
    const perfume = perfumes?.find(p => p.id === perfumeId);
    const reviews = useSelector(selectReviews) || [];

    // ✅ 로그인 정보 로컬 스토리지에서 가져오기
    const auth = JSON.parse(localStorage.getItem('auth'));
    const userId = auth?.id;

    // ✅ 리뷰 목록 불러오기
    useEffect(() => {
        if (perfumeId) {
            dispatch(fetchReviews(perfumeId));
        }
    }, [perfumeId, dispatch]);

    // ✅ 사용자가 좋아요한 리뷰 목록 불러오기
    useEffect(() => {
        if (perfumeId && userId) {
            loadLikedReviews();
        }
    }, [perfumeId, userId]);

    // ✅ 좋아요(하트)한 리뷰 불러오기
    const loadLikedReviews = async () => {
        if (!userId) {
            console.warn("로그인 정보가 없습니다. 좋아요 데이터를 불러올 수 없습니다.");
            return;
        }

        try {
            const likedReviewIds = await fetchUserLikedReviews(userId);
            setLikedReviews(likedReviewIds);
        } catch (error) {
            console.error("좋아요 데이터를 불러오는데 실패했습니다.", error);
        }
    };

    // ✅ 좋아요(하트) 버튼 클릭 시 처리
    const handleToggleHeart = async (reviewId) => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
    
        console.log(`🔍 [좋아요 토글] reviewId=${reviewId}, likedReviews=${likedReviews}`);
    
        try {
            if (likedReviews.includes(reviewId)) {
                console.log(`🗑️ [좋아요 삭제 요청] reviewId=${reviewId}`);
                await deleteHeart(reviewId);
                setLikedReviews(prev => prev.filter(id => id !== reviewId));
            } else {
                console.log(`❤️ [좋아요 추가 요청] userId=${userId}, reviewId=${reviewId}`);
                await createHeart(userId, reviewId);
                setLikedReviews(prev => [...prev, reviewId]);
            }
    
            await loadLikedReviews();
        } catch (error) {
            console.error("❌ 좋아요 처리 실패:", error);
        }
    };

    // ✅ 리뷰 작성 처리
    const handleReviewSubmit = () => {
        if (!userId) {
            alert('리뷰를 작성하려면 로그인이 필요합니다.');
            return;
        }

        const reviewData = {
            productId: perfumeId,
            memberId: userId,
            content: reviewContent
        };

        dispatch(createNewReview(reviewData));
        setReviewContent('');
        dispatch(fetchReviews(perfumeId)); // ✅ 리뷰 목록 자동 업데이트
    };

    // ✅ 모달 닫기 (리뷰 & 좋아요 목록 새로고침)
    const handleModalClose = async () => {
        setIsModalOpen(false);
        await dispatch(fetchReviews(perfumeId));

        if (userId) {
            await loadLikedReviews();
        }
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
                <div className={styles.reviewsHeader}>
                    <button className={styles.writeReviewBtn} onClick={() => setIsModalOpen(true)}>
                        리뷰 작성하기
                    </button>
                </div>

                <ReviewModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    perfume={perfume}
                    onSubmit={handleReviewSubmit}
                />

                {/* 리뷰 목록 */}
                <div className={styles.reviewCardsContainer}>
                    {reviews.length > 0 ? (
                        <div className={styles.reviewCards}>
                            {reviews.map(review => {
                                const isLiked = likedReviews.includes(review.id);
                                return (
                                    <div 
                                        key={review.id} 
                                        className={`${styles.reviewCard} ${isLiked ? styles.likedBorder : ''}`}
                                    >
                                        <img
                                            src={perfume?.imageUrlList?.[0]}
                                            alt="향수 이미지"
                                            className={styles.perfumeThumb}
                                        />
                                        <div className={styles.divider} />
                                        <p className={styles.reviewContent}>{review.content}</p>
                                        <p className={styles.reviewerName}>{review.name}</p>

                                        {/* 좋아요 버튼 */}
                                        <button
                                            className={isLiked ? styles.heartActive : styles.heart}
                                            onClick={() => handleToggleHeart(review.id)}
                                        >
                                            ❤️
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.noReviews}>아직 작성된 리뷰가 없습니다.</div>
                    )}
                </div>

                <ReviewSlider
                    currentPage={currentPage}
                    totalPages={Math.ceil(reviews.length / 5)}
                    isDragging={isDragging}
                    sliderLeft={sliderLeft}
                    cardOffset={cardOffset}
                    allReviews={reviews}
                    CARDS_PER_PAGE={5}
                    setCurrentPage={setCurrentPage}
                    setSliderLeft={setSliderLeft}
                    setCardOffset={setCardOffset}
                />
            </div>
        </div>
    );
};

export default PerfumeReviews;
