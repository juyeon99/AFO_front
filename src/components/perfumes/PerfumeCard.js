import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeCard.module.css';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark } from '../../api/BookmarkAPICalls';

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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMarked, setIsMarked] = useState(isBookmarked);
    const [clickCount, setClickCount] = useState(0);
    const [clickTimer, setClickTimer] = useState(null);
    const [lastClickTime, setLastClickTime] = useState(0);

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

        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;

        // 더블클릭 감지 (300ms 이내의 연속 클릭)
        if (timeDiff < 300) {
            // 더블클릭: 북마크 토글
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (!auth?.id) {
                alert('북마크 기능은 로그인이 필요합니다.');
                return;
            }

            try {
                await toggleBookmark(perfume.id, auth.id);
                setIsMarked(prev => !prev);
            } catch (error) {
                console.error('북마크 토글 실패:', error);
            }
            setLastClickTime(0); // 더블클릭 후 타이머 리셋
        } else {
            // 첫 번째 클릭
            setLastClickTime(currentTime);

            // 300ms 후에 싱글클릭으로 처리
            setTimeout(() => {
                if (new Date().getTime() - currentTime >= 300) {
                    // 싱글 클릭: 상세 페이지로 이동
                    navigate(`/perfumes/${perfume.id}`, {
                        state: { previousPage: currentPage }
                    });
                }
            }, 300);
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
