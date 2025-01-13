import React, { memo } from 'react';
import MessageItem from './MessageItem';
import LoadingDots from './LoadingDots';
import styles from '../../../css/modules/MessageList.module.css';

const MessageList = memo(({
    messages,
    isLoading,
    highlightedIndexes,
    currentHighlightIndex,
    searchInput
}) => {
    return (
        <div className={styles.messageBox}>
            <div className={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${message.type === 'AI' ? styles.botMessage : styles.userMessage
                            }`}
                    >
                        {message.type === 'AI' && (
                            <img
                                src="/images/logo-bot.png"
                                alt="Bot Avatar"
                                className={styles.avatar}
                            />
                        )}
                        <div className={styles.messageContent}>
                            {message.imageUrl && (
                                <div className={styles.imageContainer}>
                                    <img
                                        src={message.imageUrl}
                                        alt="Uploaded"
                                        className={styles.uploadedImage}
                                    />
                                </div>
                            )}
                            <MessageItem
                                message={message}
                                isHighlighted={
                                    highlightedIndexes.includes(index) &&
                                    index === currentHighlightIndex
                                }
                                searchInput={searchInput}
                            />
                            {message.uploadedImage && (
                                <div className={styles.uploadedImage}>
                                    <img
                                        src={message.uploadedImage}
                                        alt="Uploaded"
                                        className={styles.uploadedImage}
                                    />
                                </div>
                            )}
                            {message.recommendations && (
                                <div className={styles.recommendationCard}>
                                    <img
                                        src={message.perfumeImage}
                                        alt="Perfume"
                                        className={styles.perfumeImage}
                                    />
                                    {/* 추천 정보 표시 */}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && <LoadingDots />}
            </div>
        </div>
    );
});

export default MessageList;