import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import styles from '../../../css/reviews/MyReviewsPopover.module.css';
import { fetchMemberReviews, deleteExistingReview } from '../../../module/ReviewModule';

const MyReviewsPopover = ({ show, onClose }) => {
    const dispatch = useDispatch();
    const { reviews, loading } = useSelector(state => state.reviews);
    const auth = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        const loadReviews = async () => {
            if (show && auth?.id) {
                try {
                    console.log('Fetching reviews for member:', auth.id); // 디버깅용
                    await dispatch(fetchMemberReviews(auth.id));
                } catch (error) {
                    console.error('Failed to load reviews:', error);
                }
            }
        };

        loadReviews();
    }, [show, auth?.id, dispatch]);

    const handleDelete = async (reviewId, productId) => {
        if (window.confirm('리뷰를 삭제하시겠습니까?')) {
            await dispatch(deleteExistingReview(reviewId, productId));
            dispatch(fetchMemberReviews(auth.id));
        }
    };

    if (!show) return null;

    return (
        <div className={styles.popoverContainer}>
            <div className={styles.header}>
                <h3>내가 작성한 리뷰</h3>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={16} />
                </button>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : reviews?.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <span className={styles.date}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                                <div className={styles.actions}>
                                    <button 
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(review.id, review.productId)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                            <p className={styles.content}>{review.content}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noReviews}>작성한 리뷰가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default MyReviewsPopover;