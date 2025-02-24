import React, { memo } from 'react';
import styles from '../../../css/chat/MessageItem.module.css';

/**
 * 채팅 메시지의 개별 항목을 표시하는 컴포넌트
 * 
 * 주요 기능:
 * - 사용자/AI 메시지 구분하여 다른 스타일로 표시
 * - 검색어 하이라이트 기능
 * - 이미지 첨부 기능 (사용자 메시지)
 * - 초기 메시지 특별 스타일 지원
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.message - 메시지 정보 (type, content, images 등)
 * @param {boolean} props.isHighlighted - 검색 결과 하이라이트 여부
 * @param {string} props.searchInput - 검색어
 * @param {Function} props.openModal - 이미지 클릭시 모달 열기 함수
 * @param {string} props.color - 메시지 장식용 컬러
 */

const MessageItem = memo(({
    message,
    isHighlighted,
    searchInput,
    openModal,
    color
}) => {
    /**
   * 검색어와 일치하는 텍스트를 하이라이트 처리하는 함수
   * @param {string} text - 원본 텍스트
   * @returns {string|JSX.Element} 하이라이트된 텍스트
   */
    const highlightText = (text) => {
        // 텍스트나 검색어가 없으면 원본 반환
        if (!text || !searchInput) return text;
        if (typeof text !== 'string') return '';

        try {
            // 검색어를 기준으로 텍스트를 분할하여 하이라이트 처리
            const parts = text.split(new RegExp(`(${searchInput})`, 'gi'));
            return parts.map((part, i) =>
                part.toLowerCase() === searchInput?.toLowerCase()
                    ? <mark key={i} className="highlight">{part}</mark>
                    : part
            );
        } catch (error) {
            console.error('Highlighting error:', error);
            return text;
        }
    };

    // 초기 메시지일 경우 다른 스타일 적용
    if (message?.isInitialMessage) {
        return (
            <div className="chat-bot-message">
                <img
                    src="/images/logo-bot.png"
                    alt="Bot Avatar"
                    className="chat-avatar"
                    style={{ width: '40px', height: '40px' }}
                />
                <p className="chat-message-text">{message.content}</p>
            </div>
        );
    }

    // 일반 메시지 렌더링
    return (
        <div className={`
            ${styles.messageItem}
            ${message?.type === 'USER' ? styles.userMessage : styles.botMessage}
            ${message?.images?.length > 0 && message.content ? styles.withImageAndText : ''}
            ${isHighlighted ? styles.highlighted : ''}
        `}>
            {/* AI 메시지 렌더링 */}
            {message?.type === 'AI' && (
                <>
                    <img
                        src="/images/logo-bot.png"
                        alt="Bot Avatar"
                        className={styles.avatar}
                    />
                    <div className={styles.messageContent}>
                        <p className={styles.messageText}>
                            {highlightText(message.content)}
                        </p>
                    </div>
                </>
            )}

     {/* 사용자 메시지 렌더링 */}
{message?.type === 'USER' && (
    <div className={styles.messageContent}>
        {/* 이미지가 있는 경우 이미지 표시 */}
        {message.imageUrl && (
            <div className={styles.imageContainer}>
                <img
                    src={message.imageUrl}
                    alt="Uploaded"
                    className={styles.uploadedImage}
                    onClick={() => openModal(message.imageUrl)}
                />
            </div>
        )}
        {/* 텍스트 메시지가 있는 경우 표시 */}
        {message.content && (
            <p className={styles.messageText}>
                {highlightText(message.content)}
            </p>
        )}
    </div>
)}

        </div>
    );
});

export default MessageItem;