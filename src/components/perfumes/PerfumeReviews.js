import React, { useState, useEffect } from 'react';
import styles from '../../css/perfumes/PerfumeReviews.module.css';
import ReviewSlider from '../../components/perfumes/ReviewSlider';
import SimilarPerfumes from '../../components/perfumes/SimilarPerfumes';
import { useSelector, useDispatch } from 'react-redux';
import { selectPerfumes } from '../../module/PerfumeModule';
import { fetchReviews, selectReviews, createNewReview } from '../../module/ReviewModule';

const PerfumeReviews = ({ perfumeId }) => {
    const dispatch = useDispatch();
    const [selectedReview, setSelectedReview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [sliderLeft, setSliderLeft] = useState(0);
    const [cardOffset, setCardOffset] = useState(0);
    const [reviewContent, setReviewContent] = useState('');

    const perfumes = useSelector(selectPerfumes);
    const perfume = perfumes?.find(p => p.id === perfumeId);
    // 리뷰 데이터를 Redux에서 가져오기
    const reviews = useSelector(selectReviews) || [];
    const auth = useSelector(state => state.auth.auth);

    // 리뷰 데이터 로드
    useEffect(() => {
        if (perfumeId) {
            dispatch(fetchReviews(perfumeId));
            console.log("리뷰 데이터 요청:", perfumeId);
        }
    }, [dispatch, perfumeId]);

    // 리뷰 데이터 변경 모니터링
    useEffect(() => {
        console.log("현재 리뷰 데이터:", reviews);
    }, [reviews]);

    // 마우스 이벤트 핸들링
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                e.preventDefault();
                // ... 기존 마우스 이벤트 로직 유지 ...
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, reviews.length]);

    const CARDS_PER_PAGE = 5;
    const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
    const userTopReview = reviews?.[0] || { content: "사용자 리뷰가 없습니다.", reviewer: "" };

    // 리뷰 작성 처리 함수 추가
    const handleReviewSubmit = () => {
        if (!auth) {
            alert('리뷰를 작성하려면 로그인이 필요합니다.');
            return;
        }
    
        const reviewData = {
            productId: perfumeId,
            memberId: auth.user.oauthId,
            content: reviewContent
        };
    
        dispatch(createNewReview(reviewData));
        setReviewContent('');  // 입력 필드 초기화
    };
    


    const handleMouseDown = (e) => {
        if (e.target.className.includes(styles.sliderHandle)) {
            setIsDragging(true);
            setStartX(e.clientX);
        }
    };

    // 리뷰 데이터 변경 시 로그
    useEffect(() => {
        console.log("현재 리뷰 데이터:", reviews); // 디버깅용
    }, [reviews]);

    return (
        <div className={styles.reviewsContainer}>
            <div className={styles.topReviewsSection}>
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

                {/* 리뷰 목록 표시 */}
                <div className={styles.reviewCardsContainer}>
                    {reviews && reviews.length > 0 ? (
                        <div
                            className={styles.reviewCards}
                            style={{ transform: `translateX(-${cardOffset}px)` }}
                        >
                            {reviews.map((review, index) => (
                                <div
                                    key={review.id}
                                    className={`${styles.reviewCard} ${selectedReview === index ? styles.selected : ''}`}
                                    onClick={() => setSelectedReview(index)}
                                >
                                    <img
                                        src={perfume?.imageUrlList?.[0]}
                                        alt="향수 이미지"
                                        className={styles.perfumeThumb}
                                    />
                                    <div className={styles.divider} />
                                    <p className={styles.reviewContent}>{review.content}</p>
                                    <p className={styles.reviewerName}>{review.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noReviews}>아직 작성된 리뷰가 없습니다.</div>
                    )}
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


            {/* 유사 향수 섹션 추가 */}
            <div className={styles.similarPerfumesSection}>
                <SimilarPerfumes perfumeId={perfumeId} />
            </div>
        </div>
    );
};

export default PerfumeReviews;