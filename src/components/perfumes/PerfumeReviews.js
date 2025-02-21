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
    const [animation, setAnimation] = useState(null);

    // 초기 데이터 로딩
    useEffect(() => {
        const initializeData = async () => {
            try {
                if (perfumeId) {
                    // 리뷰 데이터 가져오기
                    await dispatch(fetchReviews(perfumeId));
                    
                    // 하트 카운트 초기화
                    const counts = {};
                    reviews.forEach(review => {
                        counts[review.id] = parseInt(review.heartCount) || 0;
                    });
                    setHeartCounts(counts);

                    // 로그인한 경우 좋아요 상태 가져오기
                    if (userId) {
                        const likedReviewIds = await fetchUserLikedReviews(userId);
                        setLikedReviews(likedReviewIds);
                    }
                }
            } catch (error) {
                console.error('Data initialization error:', error);
            }
        };

        initializeData();
    }, [perfumeId, userId, dispatch, reviews]);

    // 리뷰 데이터가 변경될 때마다 슬라이더 상태와 하트 카운트 업데이트
    useEffect(() => {
        if (reviews.length > 0) {
            const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
            const cardWidth = 196 + 37;
            const maxScroll = (reviews.length - CARDS_PER_PAGE) * cardWidth;

            setCurrentPage(totalPages);
            setSliderLeft(100);
            setCardOffset(maxScroll);

            // 하트 카운트 업데이트
            const counts = {};
            reviews.forEach(review => {
                counts[review.id] = review.heartCount || 0;
            });
            setHeartCounts(counts);
        } else {
            setCurrentPage(1);
            setSliderLeft(0);
            setCardOffset(0);
        }
    }, [reviews.length]);

    // 로그인 상태 변경 감지
    useEffect(() => {
        const checkAuthAndUpdate = async () => {
            if (userId) {
                try {
                    const likedReviewIds = await fetchUserLikedReviews(userId);
                    setLikedReviews(likedReviewIds);
                } catch (error) {
                    console.error('Auth check error:', error);
                }
            } else {
                setLikedReviews([]); // 로그아웃 시 좋아요 상태 초기화
            }
        };

        checkAuthAndUpdate();
    }, [userId]);

    // 주기적 데이터 갱신
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (perfumeId) {
                    const reviewsData = await dispatch(fetchReviews(perfumeId)).unwrap();

                    // 하트 카운트 업데이트
                    const counts = {};
                    reviewsData.forEach(review => {
                        counts[review.id] = parseInt(review.heartCount) || 0;
                    });
                    setHeartCounts(counts);

                    if (userId) {
                        await loadLikedReviews();
                    }
                }
            } catch (error) {
                console.error('Data fetch error:', error);
            }
        };

        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [perfumeId, userId, dispatch]);

    // 슬라이더 마우스 이벤트 핸들링
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                if (animation) {
                    cancelAnimationFrame(animation);
                }

                const animate = () => {
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
                };

                const animationId = requestAnimationFrame(animate);
                setAnimation(animationId);
            }
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            if (animation) {
                cancelAnimationFrame(animation);
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            if (animation) {
                cancelAnimationFrame(animation);
            }
        };
    }, [isDragging, currentPage, reviews.length, totalPages, animation]);

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
            const isLiked = likedReviews.includes(reviewId);

            // 즉시 UI 업데이트
            setLikedReviews(prev =>
                isLiked ? prev.filter(id => id !== reviewId) : [...prev, reviewId]
            );

            // 즉시 카운트 업데이트
            setHeartCounts(prev => ({
                ...prev,
                [reviewId]: isLiked ? Math.max(0, (prev[reviewId] || 1) - 1) : (prev[reviewId] || 0) + 1
            }));

            // 서버 요청
            if (isLiked) {
                await deleteHeart(reviewId);
            } else {
                await createHeart(userId, reviewId);
            }

            // 서버에서 최신 데이터 가져오기
            await dispatch(fetchReviews(perfumeId));
            
            // 현재 리뷰 데이터에서 하트 카운트 업데이트
            const updatedCounts = {};
            reviews.forEach(review => {
                updatedCounts[review.id] = parseInt(review.heartCount) || 0;
            });
            setHeartCounts(updatedCounts);

            // 사용자의 좋아요 상태 갱신
            const updatedLikedReviews = await fetchUserLikedReviews(userId);
            setLikedReviews(updatedLikedReviews);

        } catch (error) {
            console.error("좋아요 처리 실패:", error);
            
            // 에러 발생 시 서버 데이터로 복구
            await dispatch(fetchReviews(perfumeId));
            const updatedCounts = {};
            reviews.forEach(review => {
                updatedCounts[review.id] = parseInt(review.heartCount) || 0;
            });
            setHeartCounts(updatedCounts);
            
            const updatedLikedReviews = await fetchUserLikedReviews(userId);
            setLikedReviews(updatedLikedReviews);
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
        e.preventDefault(); // 드래그 시 텍스트 선택 방지
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
                                <div className={styles.heartContainer}>
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
                                    <span className={styles.heartCount}>
                                        {heartCounts[review.id] || 0}
                                    </span>
                                </div>
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