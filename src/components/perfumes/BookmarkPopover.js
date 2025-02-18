import React from 'react';
import styles from '../../css/perfumes/BookmarkPopover.module.css';
import { X } from 'lucide-react';

const BookmarkPopover = ({ show, onClose, bookmarkedPerfumes, recommendedPerfumes, handleBookmarkDelete }) => {
    if (!Boolean(show)) return null;

    return (
        <div className={styles.popoverContainer}>
            <div className={styles.header}>
                <h3>북마크</h3>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={16} />
                </button>
            </div>
            
            <div className={styles.section}>
                <h4>내가 찜한 향수</h4>
                {bookmarkedPerfumes?.length > 0 ? (
                    <div className={styles.perfumeGrid}>
                        {bookmarkedPerfumes.map((perfume) => (
                            <div key={perfume.id} className={styles.perfumeItem}>
                                <img 
                                    src={perfume.imageUrl} 
                                    alt={perfume.name} 
                                    className={styles.perfumeImage}
                                />
                                <span>{perfume.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>북마크한 향수가 없습니다.</p>
                )}
            </div>

            <div className={styles.section}>
                <h4>유사 취향 선호 향수</h4>
                {recommendedPerfumes?.length > 0 ? (
                    <div className={styles.perfumeGrid}>
                        {recommendedPerfumes.map((perfume) => (
                            <div key={perfume.id} className={styles.perfumeItem}>
                                <img 
                                    src={perfume.imageUrl} 
                                    alt={perfume.name} 
                                    className={styles.perfumeImage}
                                />
                                <span>{perfume.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>추천 향수가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default BookmarkPopover;