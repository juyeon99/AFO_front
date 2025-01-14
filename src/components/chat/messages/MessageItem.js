import React, { memo } from 'react';
import styles from '../../../css/modules/MessageItem.module.css';

/**
 * 개별 메시지 아이템을 렌더링하는 컴포넌트
 * @param {Object} message - 메시지 데이터 객체
 * @param {boolean} isHighlighted - 검색 결과 하이라이트 여부
 * @param {string} searchInput - 검색어
 */
const MessageItem = memo(({
    message,
    isHighlighted,
    searchInput,
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
            ${message?.imageUrl ? styles.withImageAndText : ''}
            ${isHighlighted ? styles.highlighted : ''}
        `}>
            {/* AI 메시지인 경우 봇 표시 */}
            {message?.type === 'AI' && (
                <img
                    src="/images/logo-bot.png"
                    alt="Bot Avatar"
                    className={styles.avatar}
                />
            )}
            <div className={styles.messageContent}>
                {/* 사용자가 이미지를 첨부한 경우 이미지 표시 */}
                {message?.type === 'USER' && message?.imageUrl && (
                    <div className={styles.imageContainer}>
                        <img
                            src={message.imageUrl}
                            alt="첨부 이미지"
                            className={styles.uploadedImage}
                        />
                    </div>
                )}
                {/* 메시지 내용이 있는 경우 텍스트 표시 */}
                {message?.content && (
                    <p className={styles.messageText}>
                        {highlightText(message.content)}
                    </p>
                )}
            </div>
        </div>
    );
});

export default MessageItem;
