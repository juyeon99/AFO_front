import React from 'react';
import { Edit } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeCard.module.css';

/**
 * 향수 카드 컴포넌트
 * @param {Object} perfume - 향수 데이터
 * @param {boolean} isAdmin - 관리자 여부
 * @param {boolean} showCheckboxes - 체크박스 표시 여부
 * @param {boolean} selected - 선택 여부
 * @param {function} onSelect - 선택 핸들러
 * @param {function} onEdit - 수정 핸들러
 */
const PerfumeCard = ({ perfume, isAdmin, showCheckboxes, selected, onSelect, onEdit }) => {
    return (
        <div className={styles.cardWrapper}>
            {showCheckboxes && (
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                    className={styles.checkbox}
                />
            )}
            <div className={styles.card}>
                {/* 카드 앞면 */}
                <div className={styles.front}>
                    <img
                        src={perfume.imageUrl || '/images/default-perfume.png'}
                        alt={perfume.name}
                        className={styles.image}
                    />
                    <h3 className={styles.name}>{perfume.name}</h3>
                    <h4 className={styles.brand}>{perfume.brand}</h4>
                    <div className={styles.divider}></div>
                    <p className={styles.category}>{perfume.category}</p>
                    {/* 수정 버튼 (관리자만 표시) */}
                    {isAdmin && (
                        <button onClick={onEdit} className={styles.editButton}>
                            <Edit size={16} />
                        </button>
                    )}
                </div>

                {/* 카드 뒷면 */}
                <div className={styles.back}>
                    <h3 className={styles.name}>{perfume.name}</h3>
                    <div className={styles.divider}></div>
                    <div className={styles.description}>
                        <p className={styles.mainDescription}>
                            {perfume.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfumeCard;