import React, { memo } from 'react';
import styles from '../../../css/modules/Modal.module.css';

/**
 * 이미지 모달 컴포넌트
 * 이미지 확대 보기
 */
const ImageModal = memo(({ image, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <img src={image} alt="확대된 이미지" />
                <button className={styles.modalClose} onClick={onClose}>×</button>
            </div>
        </div>
    );
});

export default ImageModal;
