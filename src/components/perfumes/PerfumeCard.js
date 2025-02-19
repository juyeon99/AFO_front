import React, { useState, useEffect } from 'react';
import { Edit,Trash2  } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeCard.module.css';
import { useNavigate } from 'react-router-dom';

const PerfumeCard = ({
    perfume,
    showCheckboxes,
    selectedCard,  // selectedCard 값을 prop으로 받음
    role,
    onCheckboxChange,
    onEditClick,
    currentPage
}) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

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

    const handleCardClick = (e) => {
        if (e.target.type === 'checkbox' || e.target.closest(`.${styles.editButton}`)) {
            return;
        }
        
        if (showCheckboxes) {
            onCheckboxChange(perfume.id);  // 카드 선택 상태 변경
            return;
        }
        
        navigate(`/perfumes/${perfume.id}`, { state: { previousPage: currentPage } });
    };

    // selectedCard가 해당 카드의 ID와 일치하는지 확인
    const isSelected = selectedCard === perfume.id;

    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ''}`} 
            onClick={handleCardClick}
        >
            {showCheckboxes && (
                <input
                    type="checkbox"
                    className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}  // 동적 클래스 적용
                    checked={isSelected}
                    onChange={() => onCheckboxChange(perfume.id)}  // 카드 선택 상태 변경
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
