import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeCard.module.css';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark } from '../../api/BookmarkAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks } from '../../module/BookmarkModule';

const PerfumeCard = ({
    perfume,
    showCheckboxes,
    selectedCard,  // selectedCard 값을 prop으로 받음
    role,
    onCheckboxChange,
    onEditClick,
    currentPage,
    isBookmarked,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMarked, setIsMarked] = useState(isBookmarked);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [clickTimer, setClickTimer] = useState(null);
    const [lastClickTime, setLastClickTime] = useState(0);
    const { bookmarkedPerfumes } = useSelector(state => state.bookmark);

    // 로컬 스토리지에서 auth 정보 가져오기
    const auth = JSON.parse(localStorage.getItem('auth'));

    // 이미지 URL이 배열인지 확인하고 기본값 설정
    const imageUrls = Array.isArray(perfume?.imageUrlList) && perfume.imageUrlList.length > 0
        ? perfume.imageUrlList
        : ['https://sensient-beauty.com/wp-content/uploads/2023/11/Fragrance-Trends-Alcohol-Free.jpg'];

    useEffect(() => {
        let slideInterval;

        if (imageUrls.length > 1) {
            slideInterval = setInterval(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentImageIndex(prevIndex =>
                        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
                    );
                    setIsTransitioning(false);
                }, 300);
            }, 3000);
        }

        return () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        };
    }, [imageUrls.length]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (clickTimer) clearTimeout(clickTimer);
        };
    }, [clickTimer]);

    // 컴포넌트 마운트 시 북마크 상태 확인
    useEffect(() => {
        const checkBookmarkStatus = async () => {
            if (auth?.id) {
                try {
                    // 초기 로드 시에만 fetchBookmarks 호출
                    if (!bookmarkedPerfumes.length) {
                        await dispatch(fetchBookmarks(auth.id));
                    }
                    
                    // 북마크 상태 확인
                    const isBookmarked = bookmarkedPerfumes.some(
                        bookmark => bookmark.productId === perfume.id
                    );
                    setIsMarked(isBookmarked);
                } catch (error) {
                    console.error('북마크 상태 확인 실패:', error);
                }
            }
        };

        checkBookmarkStatus();
    }, [perfume.id, auth?.id, dispatch, bookmarkedPerfumes]);

    const handleCardClick = async (e) => {
        // 체크박스나 편집 버튼 클릭 시 무시
        if (e.target.type === 'checkbox' || e.target.closest('button')) {
            return;
        }

        // 체크박스 모드일 때는 바로 체크박스 토글
        if (showCheckboxes) {
            onCheckboxChange(perfume.id);
            return;
        }

        // 이전 타이머가 있다면 제거
        if (clickTimer) {
            clearTimeout(clickTimer);
            setClickTimer(null);
        }

        if (clickCount === 0) {
            // 첫 번째 클릭
            setClickCount(1);

            // 싱글클릭 타이머 설정
            const timer = setTimeout(() => {
                // 타이머 만료 시 싱글 클릭으로 처리
                navigate(`/perfumes/${perfume.id}`, {
                    state: { previousPage: currentPage }
                });
                // 상태 초기화
                setClickCount(0);
                setClickTimer(null);
            }, 300);

            setClickTimer(timer);

        } else {
            // 두 번째 클릭 (더블클릭)
            setClickCount(0);

            // 더블클릭: 북마크 토글
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (!auth?.id) {
                return;
            }

            try {
                await dispatch(toggleBookmark(perfume.id, auth.id));
                setIsMarked(prev => !prev);
                // BookmarkPopover 업데이트를 위한 북마크 목록 새로고침
                dispatch(fetchBookmarks(auth.id));
            } catch (error) {
                console.error('북마크 토글 실패:', error);
            }
        }
    };

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (clickTimer) {
                clearTimeout(clickTimer);
            }
        };
    }, [clickTimer]);

    return (
        <div className={`${styles.card} ${isMarked ? styles.bookmarked : ''}`} onClick={handleCardClick}>
            {showCheckboxes && (
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedCard === perfume.id}
                    onChange={() => onCheckboxChange(perfume.id)}
                    onClick={(e) => e.stopPropagation()}
                />
            )}

            {role === 'ADMIN' && (
                <button className={styles.editButton} onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(perfume);
                }}>
                    <Edit size={16} color="#333" />
                </button>
            )}

            <div className={styles.imageContainer}>
                <img src={imageUrls[currentImageIndex]} alt={perfume.name} className={styles.image} />
            </div>

            <div className={styles.name}><strong>{perfume.nameKr}</strong></div>
            <div className={styles.divider}></div>
            <div className={styles.category}>{perfume.brand}</div>
            <div className={styles.grade}>{perfume.grade}</div>
            <div className={styles.description}>
                <p>"{perfume.content}"</p>
                <br />
                {perfume.singleNote && <p><strong>싱글 노트 | </strong> {perfume.singleNote}</p>}
                {perfume.topNote && <p><strong>탑 노트 | </strong> {perfume.topNote}</p>}
                {perfume.middleNote && <p><strong>미들 노트 | </strong> {perfume.middleNote}</p>}
                {perfume.baseNote && <p><strong>베이스 노트 | </strong> {perfume.baseNote}</p>}
            </div>
        </div>
    );
};

export default PerfumeCard;
