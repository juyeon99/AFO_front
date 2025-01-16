import React, { memo, useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import LoadingDots from './LoadingDots';
import styles from '../../../css/modules/MessageList.module.css';

/**
 * 채팅 메시지 목록을 표시하는 컴포넌트
 * 
 * 주요 기능:
 * - 사용자와 AI 메시지를 구분하여 표시
 * - 사용자 메시지: 텍스트, 이미지(단일/복수) 지원
 * - AI 메시지: 봇 아바타와 텍스트 표시
 * - 로딩 상태 표시
 * - 검색 결과 하이라이트 및 스크롤
 */

// memo를 사용하여 불필요한 리렌더링 방지
const MessageList = memo(({
    messages = [],                    // 채팅 메시지 배열
    isLoading = false,               // 메시지 로딩 상태
    highlightedMessageIndexes = [],   // 검색된 메시지의 인덱스 배열
    currentHighlightedIndex = null,   // 현재 선택된 검색 결과의 인덱스
    searchInput = '',                 // 검색어
    openImageModal                    // 이미지 모달을 여는 함수
}) => {
    // 각 메시지 요소에 대한 참조를 저장하는 ref 배열
    const messageRefs = useRef([]);

    // 검색 결과 간 이동 시 해당 메시지로 스크롤하는 효과
    useEffect(() => {
        if (currentHighlightedIndex !== null && highlightedMessageIndexes?.length > 0) {
            const messageIndex = highlightedMessageIndexes[currentHighlightedIndex];
            if (messageRefs.current[messageIndex]) {
                // 선택된 메시지로 부드럽게 스크롤
                messageRefs.current[messageIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }, [currentHighlightedIndex, highlightedMessageIndexes]);

    // 검색어에 따른 메시지 내용 하이라이트 처리
    const renderMessageContent = (content, index) => {
        if (!searchInput || !content) return content;
    
        try {
            const escapedSearchInput = searchInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedSearchInput})`, 'gi');
            const text = content.toString();
            let lastIndex = 0;
            const parts = [];
            let match;
    
            while ((match = regex.exec(text)) !== null) {
                if (lastIndex !== match.index) {
                    parts.push({
                        text: text.slice(lastIndex, match.index),
                        isMatch: false
                    });
                }
                parts.push({
                    text: match[0],
                    isMatch: true
                });
                lastIndex = regex.lastIndex;
            }
    
            if (lastIndex < text.length) {
                parts.push({
                    text: text.slice(lastIndex),
                    isMatch: false
                });
            }
    
            return (
                <span>
                    {parts.map((part, i) => {
                        if (part.isMatch && highlightedMessageIndexes[currentHighlightedIndex] === index) {
                            return (
                                <mark
                                    key={i}
                                    style={{
                                        backgroundColor: '#fff740',
                                        padding: '2px 4px',
                                        borderRadius: '2px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {part.text}
                                </mark>
                            );
                        }
                        return <span key={i}>{part.text}</span>;
                    })}
                </span>
            );
        } catch (error) {
            console.error('Error in renderMessageContent:', error);
            return content;
        }
    };

    return (
        <div className={styles.messageBox}>
            <div className={styles.messagesContainer}>
                {/* 메시지 목록을 순회하며 각 메시지 렌더링 */}
                {messages.map((message, index) => (
                    <div
                        key={message.id || index}
                        ref={el => messageRefs.current[index] = el}
                        id={`message-${index}`}  // scrollToMessage를 위한 id 추가
                        className={`${styles.message} ${message.type === 'USER' ? styles.userMessage : styles.botMessage
                            } ${highlightedMessageIndexes?.includes(index) ? styles.highlightedMessage : ''
                            }`}
                    >
                        {/* AI 메시지인 경우 봇 아바타 표시 */}
                        {message.type === 'AI' && (
                            <img
                                src="/images/logo-bot.png"
                                alt="Bot Avatar"
                                className={styles.avatar}
                            />
                        )}
                        <div className={styles.messageWrapper}>
                            <div className={styles.messageContent}>
                                {/* 여러 이미지가 있는 경우의 처리 */}
                                {message.images && message.images.length > 0 && (
                                    <div className={styles.imageContainer}>
                                        {message.images.map((image, idx) => (
                                            <img
                                                key={idx}
                                                src={image.url}
                                                alt="Uploaded"
                                                className={styles.uploadedImage}
                                                onClick={() => openImageModal(image.url)}
                                            />
                                        ))}
                                    </div>
                                )}
                                {/* 사용자 메시지의 단일 이미지 처리 */}
                                {message.type === 'USER' && message.imageUrl && (
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={message.imageUrl}
                                            alt="Uploaded"
                                            className={styles.uploadedImage}
                                            onClick={() => openImageModal(message.imageUrl)}
                                        />
                                    </div>
                                )}
                                {/* 메시지 텍스트 내용 (검색어 하이라이트 포함) */}
                                <div className={styles.messageText}>
                                    {renderMessageContent(message.content, index)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* 로딩 상태 표시 */}
                {isLoading && <LoadingDots />}
            </div>
        </div>
    );
});

// 개발 도구에서 컴포넌트를 식별하기 위한 이름 설정
MessageList.displayName = 'MessageList';

export default MessageList;