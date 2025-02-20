import React, { useEffect, useState } from 'react';
import styles from '../../css/perfumes/BookmarkPopover.module.css';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks, handleDeleteBookmark } from '../../module/BookmarkModule';

const BookmarkPopover = ({ show, onClose }) => {
    const dispatch = useDispatch();
    const { bookmarkedPerfumes, recommendedPerfumes, loading, error } = useSelector(state => state.bookmark);
    const [activeTab, setActiveTab] = useState('bookmarked');
    const [recommendedLoading, setRecommendedLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const loadBookmarks = async () => {
            if (!show) return;

            const auth = JSON.parse(localStorage.getItem('auth'));
            if (!auth?.id) return;

            if (isInitialLoad && activeTab === 'recommended') {
                setRecommendedLoading(true);
                try {
                    await dispatch(fetchBookmarks(auth.id));
                } finally {
                    setRecommendedLoading(false);
                    setIsInitialLoad(false);
                }
            } else if (isInitialLoad) {
                await dispatch(fetchBookmarks(auth.id));
                setIsInitialLoad(false);
            }
        };

        loadBookmarks();
    }, [show, dispatch, activeTab, isInitialLoad]);

    // 북마크 목록 변경 감지를 위한 useEffect 추가 (기존 useEffect 유지)
    useEffect(() => {
        // 이 useEffect는 bookmarkedPerfumes의 변경만 감지하므로
        // 초기 로딩/탭 변경과 관련 없이 실시간 업데이트만 처리
        // 아무 작업도 필요 없음 - Redux 상태가 변경되면 자동으로 리렌더링됨
    }, [bookmarkedPerfumes]);

    // 북마크 목록 변경 감지를 위한 useEffect 추가
    useEffect(() => {
        if (show) {
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (auth?.id) {
                dispatch(fetchBookmarks(auth.id));
            }
        }
    }, [show, dispatch]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'recommended' && isInitialLoad) {
            setRecommendedLoading(true);
        }
    };

    const handleDelete = async (productId) => {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (!auth?.id) return;

        try {
            await dispatch(handleDeleteBookmark(productId, auth.id));
        } catch (error) {
            console.error('북마크 삭제 실패:', error);
        }
    };

    if (!show) return null;

    return (
        <div className={styles.popoverContainer}>
            <div className={styles.header}>
                <h3>북마크</h3>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={16} />
                </button>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'bookmarked' ? styles.active : ''}`}
                    onClick={() => setActiveTab('bookmarked')}
                >
                    내가 찜한 향수
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'recommended' ? styles.active : ''}`}
                    onClick={() => handleTabChange('recommended')}
                >
                    유사 취향 선호 향수
                </button>
            </div>

            <div className={styles.contentContainer}>
                {activeTab === 'bookmarked' && (
                    <div className={styles.section}>
                        <div className={styles.perfumeGrid}>
                            {bookmarkedPerfumes?.length > 0 ? (
                                bookmarkedPerfumes.map((perfume, index) => (
                                    <div key={`bookmarked-${perfume.productId || index}`} className={styles.perfumeItem}>
                                        <div className={styles.perfumeItemHeader}>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(perfume.productId)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <img
                                            src={perfume.imageUrls?.[0]}
                                            alt={perfume.nameKr}
                                            className={styles.perfumeImage}
                                        />
                                        <div className={styles.perfumeInfo}>
                                            <span className={styles.perfumeName}>{perfume.nameKr}</span>
                                            <span className={styles.perfumeBrand}>{perfume.brand}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>북마크한 향수가 없습니다.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'recommended' && (
                    <div className={styles.section}>
                        {isInitialLoad && recommendedLoading ? (
                            <div className={styles.loading}>로딩 중...</div>
                        ) : (
                            <div className={styles.perfumeGrid}>
                                {recommendedPerfumes?.length > 0 ? (
                                    recommendedPerfumes.map((perfume, index) => (
                                        <div key={`recommended-${perfume.productId || index}`} className={styles.perfumeItem}>
                                            <img
                                                src={perfume.imageUrls}
                                                alt={perfume.nameKr}
                                                className={styles.perfumeImage}
                                            />
                                            <div className={styles.perfumeInfo}>
                                                <span className={styles.perfumeName}>{perfume.nameKr}</span>
                                                <span className={styles.perfumeBrand}>{perfume.brand}</span>
                                                {perfume.mainAccord && (
                                                    <span className={styles.mainAccord}>{perfume.mainAccord}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>추천 향수가 없습니다.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarkPopover;