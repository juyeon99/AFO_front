import React, { useState, memo } from 'react';
import ImageUpload from './ImageUpload';
import styles from '../../../css/modules/ChatInput.module.css';

/**
 * 채팅 입력 컴포넌트
 * 텍스트 입력과 이미지 업로드 기능을 포함
 */
const ChatInput = memo(({
    onSend,
    handleImageUpload,
    selectedImages = [],
    handleRemoveImage,
    fileInputRef
}) => {
    const [input, setInput] = useState('');

    // handleInputChange 함수 추가
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };


    // 메시지 전송 핸들러
    const handleSendMessage = () => {
        if (input.trim() || selectedImages.length > 0) {
            // 하나의 이미지만 전송
            const imageUrl = selectedImages.length > 0 ? selectedImages[0] : null;

            onSend(input, imageUrl);
            setInput('');
            handleRemoveImage(); // 이미지 초기화
        }
    };

    // Enter 키 핸들러 추가
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={styles.inputAreaWrapper}>
            {/* 이미지 미리보기 */}
            {selectedImages.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                    {selectedImages.map((image, index) => (
                        <div key={index} className={styles.imagePreviewCard}>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className={styles.imagePreview}
                            />
                            <button onClick={() => handleRemoveImage(index)} className={styles.removeImageButton}>×</button>
                        </div>
                    ))}
                </div>
            )}

            {/* 입력 영역 */}
            <div className={styles.inputArea}>
                <ImageUpload
                    onUpload={handleImageUpload}
                    fileInputRef={fileInputRef}
                />

                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요"
                    className={styles.input}
                />

                <button
                    className={styles.sendButton}
                    onClick={handleSendMessage}
                    disabled={!input.trim() && selectedImages.length === 0}
                >
                    ➤
                </button>
            </div>
        </div>
    );
});

export default ChatInput;
