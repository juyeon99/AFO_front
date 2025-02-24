import React, { useState, memo } from 'react';
import ImageUpload from './ImageUpload';
import PropTypes from 'prop-types';
import styles from '../../../css/chat/ChatInput.module.css';

/**
 * 채팅 입력창 컴포넌트
 * 
 * 이 컴포넌트는 채팅창 맨 아래에 있는 입력 영역입니다.
 * 메시지를 입력하고 이미지를 첨부할 수 있습니다.
 */

const ChatInput = memo(({
    onSend,              // 메시지 전송 함수
    handleImageUpload,   // 이미지 업로드 처리 함수
    selectedImages,      // 선택된 이미지들
    setSelectedImages,   // 이미지 목록 변경 함수
    handleRemoveImage,   // 이미지 삭제 함수
    fileInputRef,        // 파일 입력창 참조
    backgroundClass     // 배경 클래스
}) => {
    // 입력된 메시지를 저장하는 상태
    const [input, setInput] = useState('');

    // 메시지 입력시 실행되는 함수
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };


    // 메시지 전송 버튼 클릭시 실행되는 함수
    const handleSendMessage = () => {
        // 메시지나 이미지가 있을 때만 전송
        if (input.trim() || selectedImages.length > 0) {
            // 선택된 이미지들의 URL만 추출
            const imageUrls = selectedImages.map(img => img.url);
            console.log('ChatInput에서 전송하는 데이터:', {
                input: input,
                imageUrls: imageUrls
            });
            // 메시지와 이미지 전송
            onSend(input, imageUrls);
            // 입력창 초기화
            setInput('');
            // 이미지 목록 초기화
            setSelectedImages([]);
        }
    };


    // Enter 키 입력시 메시지 전송
    const handleKeyPress = (e) => {
        // Shift + Enter가 아닌 Enter만 눌렀을 때
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 줄바꿈 방지
            handleSendMessage();
        }
    };

        // 이미지 삭제 핸들러
        const handleImageRemove = () => {
            setSelectedImages([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';  // 파일 입력 초기화
            }
        };
    
        // 이미지 붙여넣기 핸들러
        const handlePaste = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
    
            for (let item of items) {
                if (item.type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    handleImageUpload({ target: { files: [file] } });
                    break;  // 첫 번째 이미지만 처리
                }
            }
        };    

    return (
        <div className={`${styles.inputAreaWrapper} ${backgroundClass}`}>
            {/* 선택된 이미지 미리보기 */}
            {selectedImages.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreviewWrapper}>
                        <img
                            src={selectedImages[0].url}
                            alt="Preview"
                            className={styles.imagePreview}
                        />
                        <button 
                            onClick={handleImageRemove}
                            className={styles.removeImageButton}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* 메시지 입력 영역 */}
            <div className={styles.inputArea}>
                {/* 이미지 업로드 버튼 */}
                <ImageUpload
                    onUpload={handleImageUpload}
                    fileInputRef={fileInputRef}
                />

                {/* 메시지 입력창 */}
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요"
                    className={styles.input}
                />

                {/* 전송 버튼 */}
                <button
                    className={styles.sendButton}
                    onClick={handleSendMessage}
                    // 메시지나 이미지가 없으면 비활성화
                    disabled={!input.trim() && selectedImages.length === 0}
                >
                    ➤
                </button>
            </div>
        </div>
    );
});

ChatInput.propTypes = {
    onSend: PropTypes.func.isRequired,
    handleImageUpload: PropTypes.func.isRequired,
    selectedImages: PropTypes.array.isRequired,
    setSelectedImages: PropTypes.func.isRequired,
    handleRemoveImage: PropTypes.func.isRequired,
    fileInputRef: PropTypes.object.isRequired,
    backgroundClass: PropTypes.string  // PropTypes 추가
};

export default ChatInput;
