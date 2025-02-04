import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeCard.module.css';

const PerfumeCard = ({
    perfume,
    showCheckboxes,
    selectedCard,
    role,
    onCheckboxChange,
    onEditClick
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 이미지 URL이 배열인지 확인하고 기본값 설정
    const imageUrls = Array.isArray(perfume?.imageUrls) && perfume.imageUrls.length > 0
        ? perfume.imageUrls
        : ['https://sensient-beauty.com/wp-content/uploads/2023/11/Fragrance-Trends-Alcohol-Free.jpg'];

    return (
        <div
            className={styles.card}
            onClick={() => showCheckboxes && onCheckboxChange(perfume.id)}
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

                {imageUrls.length > 1 && (
                    <div className={styles.imagePagination}>
                        {imageUrls.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.paginationDot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(index);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.name}><strong>{perfume.name}</strong></div>
            <div className={styles.divider}></div>
            <div className={styles.category}>{perfume.brand}</div>
            <div className={styles.grade}>{perfume.grade}</div>
            <div className={styles.description}>
                <p>"{perfume.description}"</p>
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
