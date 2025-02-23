import React, { memo } from 'react';
import styles from '../../../css/chat/MessageList.module.css';
import recommendationStyles from '../../../css/chat/RecommendationItem.module.css';
import RecommendationItem from './RecommendationItem';

/**
 * 채팅 메시지의 개별 항목을 표시하는 컴포넌트
 * 
 * MessageItem.js는 개별 메시지를 처리하는 역할
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
            <div className={styles.chatmessage}>
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

    return (
        <div className={`${styles.message} ${
            message?.type === 'USER' ? styles.userMessage : styles.botMessage
        }`}>
            {/* AI 메시지 렌더링 */}
            {message?.type === 'AI' && (
                <>
                    <img
                        src="/images/logo-bot.png"
                        alt="Bot Avatar"
                        className={styles.avatar}
                    />
                    <div className={styles.messageWrapper}>
                        <div className={styles.messageContent}>
                            <div className={styles.messageText}>
                                {highlightText(message.content)}
                            </div>
                            {message.mode === 'recommendation' && (
                                <div className={styles.recommendations}>
                                    {message.imageUrl && (
                                        <img
                                            src={message.imageUrl}
                                            alt="추천 이미지"
                                            className={styles.recommendationImage}
                                        />
                                    )}
                                    {Array.isArray(message.recommendations) && 
                                        message.recommendations.map((rec, idx) => (
                                            <RecommendationItem key={idx} recommendation={rec} />
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* 사용자 메시지 렌더링 */}
            {message?.type === 'USER' && (
                <div className={styles.messageWrapper}>
                    <div className={styles.messageContent}>
                        {message.content && (
                            <div className={styles.messageText}>
                                {highlightText(message.content)}
                            </div>
                        )}
                        {message.images && message.images.length > 0 && (
                            <div className={styles.imageContainer}>
                                {message.images.map((image, idx) => (
                                    <img
                                        key={idx}
                                        src={image.url}
                                        alt="Uploaded"
                                        className={styles.uploadedImage}
                                        onClick={() => openModal(image.url)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
