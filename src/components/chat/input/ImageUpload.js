import React, { memo } from 'react';
import styles from '../../../css/modules/ChatInput.module.css';

/**
 * 이미지 업로드 컴포넌트
 * 이미지 파일 선택 기능
 */
const ImageUpload = memo(({ onUpload, fileInputRef }) => {
    return (
        <div className={styles.fileUpload}>
            <label htmlFor="file-upload">
                <img
                    src="/images/image.png"
                    alt="이미지 업로드"
                    className={styles.uploadIcon}
                />
            </label>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={onUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
        </div>
    );
});

export default ImageUpload;
