import React, { memo } from 'react';
import styles from '../../../css/modules/MessageItem.module.css';

/**
 * 개별 메시지 컴포넌트
 * 사용자/봇 메시지를 구분하여 표시
 */
const MessageItem = memo(({
    message,
    isHighlighted,
    searchInput
}) => {
    const highlightText = (text) => {
        if (!searchInput) return text;
        const parts = text.split(new RegExp(`(${searchInput})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === searchInput.toLowerCase()
                ? <mark key={i}>{part}</mark>
                : part
        );
    };

    return (
        <div className={`
        message-item 
        ${message.type === 'USER' ? 'user-message' : 'bot-message'}
        ${isHighlighted ? 'highlighted' : ''}
    `}>
            <div className={styles.messageContent}>
                {message.imageUrl && (
                    <img
                        src={message.imageUrl}
                        alt="첨부 이미지"
                        className={styles.messageImage}
                    />
                )}
                {message.content && (
                    <p>{highlightText(message.content)}</p>
                )}
            </div>
        </div>
    );
});

export default MessageItem;
