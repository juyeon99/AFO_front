import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeCard.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toggleBookmark } from '../../api/BookmarkAPICalls';

const PerfumeCard = ({
    perfume,
    showCheckboxes,
    selectedCard,
    role,
    onCheckboxChange,
    onEditClick,
    currentPage,
    isBookmarked,
}) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMarked, setIsMarked] = useState(isBookmarked);
    const auth = useSelector(state => state.auth);
    const [clickCount, setClickCount] = useState(0);
    const [clickTimer, setClickTimer] = useState(null);

    // 이미지 URL이 배열인지 확인하고 기본값 설정
    const imageUrls = Array.isArray(perfume?.imageUrlList) && perfume.imageUrlList.length > 0
        ? perfume.imageUrlList.map(url => url)  // 이미지 URL 배열 매핑
        : ['https://sensient-beauty.com/wp-content/uploads/2023/11/Fragrance-Trends-Alcohol-Free.jpg'];

    // 자동 슬라이드 효과 추가
    useEffect(() => {
        let slideInterval;

        if (imageUrls.length > 1) {
            slideInterval = setInterval(() => {
                setIsTransitioning(true);  // 페이드 아웃 시작
                setTimeout(() => {
                    setCurrentImageIndex(prevIndex =>
                        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
                    );
                    setIsTransitioning(false);  // 페이드 인 시작
                }, 300);  // transition 시간과 동일하게 설정
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

    const handleClick = (e) => {
        // 체크박스나 편집 버튼 클릭 시에는 무시
        if (e.target.type === 'checkbox' || e.target.closest(`.${styles.editButton}`)) {
            return;
        }

        setClickCount(prev => prev + 1);

        if (clickTimer) {
            clearTimeout(clickTimer);
        }

        setClickTimer(setTimeout(async () => {
            if (clickCount === 0) {
                // 싱글 클릭
                if (showCheckboxes) {
                    onCheckboxChange(perfume.id);
                } else {
                    navigate(`/perfumes/${perfume.id}`, {
                        state: { previousPage: currentPage }
                    });
                }
            } else {
                // 더블 클릭
                if (!auth?.id) {
                    alert('로그인이 필요한 서비스입니다.');
                    return;
                }

                try {
                    await toggleBookmark(perfume.id, auth.id);
                    setIsMarked(!isMarked);
                } catch (error) {
                    console.error('북마크 토글 실패:', error);
                }
            }
            setClickCount(0);
        }, 200));  // 200ms 대기
    };

    return (
        <div
            className={`${styles.card} ${isMarked ? styles.bookmarked : ''}`}
            onClick={handleClick}
        >
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
                <button
                    className={styles.editButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(perfume);
                    }}
                >
                    <Edit size={16} color="#333" />
                </button>
            )}

            <div className={styles.imageContainer}>
                <img
                    src={imageUrls[currentImageIndex]}
                    alt={perfume.name}
                    className={styles.image}
                />
            </div>

            <div className={styles.name}><strong>{perfume.nameKr}</strong></div>
            <div className={styles.divider}></div>
            <div className={styles.category}>{perfume.brand}</div>
            <div className={styles.grade}>{perfume.grade}</div>
            <div className={styles.description}>
                <p>"{perfume.content}"</p>
                <br />
                <div className={styles.singleNote}>
                    {perfume.singleNote && <p><strong>싱글 노트 | </strong> {perfume.singleNote}</p>}
                </div>
                <div className={styles.multiNote}>
                    {perfume.topNote && <p><strong>탑 노트 | </strong> {perfume.topNote}</p>}
                    {perfume.middleNote && <p><strong>미들 노트 | </strong> {perfume.middleNote}</p>}
                    {perfume.baseNote && <p><strong>베이스 노트 | </strong> {perfume.baseNote}</p>}
                </div>
            </div>
        </div>
    );
};

export default PerfumeCard;
