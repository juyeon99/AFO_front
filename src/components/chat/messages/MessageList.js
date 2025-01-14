import React, { memo } from 'react';
import MessageItem from './MessageItem';
import LoadingDots from './LoadingDots';
import styles from '../../../css/modules/MessageList.module.css';

const MessageList = memo(({
    messages = [],
    isLoading = false,
    highlightedIndexes = [],
    currentHighlightIndex,
    searchInput = ''
}) => {
    return (
        <div className={styles.messageBox}>
            <div className={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${
                            message.type === 'USER' ? styles.userMessage : styles.botMessage
                        }`}
                    >
                        {/* AI 메시지일 때는 항상 로고 표시 */}
                        {message.type === 'AI' && (
                            <img
                                src="/images/logo-bot.png"
                                alt="Bot Avatar"
                                className={styles.avatar}
                            />
                        )}
                        <div className={styles.messageWrapper}>
                            <div className={styles.messageContent}>
                                <p className={styles.messageText}>
                                    {message.content}
                                </p>
                            </div>
                            {message.type === 'USER' && message.imageUrl && (
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={message.imageUrl}
                                        alt="Uploaded"
                                        className={styles.uploadedImage}
                                    />
                                </div>
                            )}
                        </div>
                        {message.type === 'USER' && (
                            <div className={styles.colorCircle} />
                        )}
                    </div>
                ))}
                {isLoading && <LoadingDots />}
            </div>
        </div>
    );
});

export default MessageList;