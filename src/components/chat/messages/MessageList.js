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

            // 검색어와 일치하는 부분만 하이라이트
            return content.split(regex).map((part, i) => {
                const isMatch = part.toLowerCase() === searchInput.toLowerCase();
                return isMatch ? (
                    <span
                        key={i}
                        className={`${styles.highlight} ${
                            // 현재 선택된 검색 결과인 경우에만 currentHighlight 클래스 추가
                            highlightedMessageIndexes?.[currentHighlightedIndex] === index ?
                                styles.currentHighlight : ''
                            }`}
                    >
                        {part}
                    </span>
                ) : part;
            });
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
                        // 메시지 타입과 검색 상태에 따른 스타일 적용
                        className={`${styles.message} ${message.type === 'USER' ? styles.userMessage : styles.botMessage
                            } ${
                            // 검색 결과에 포함된 메시지 하이라이트
                            highlightedMessageIndexes?.includes(index) ? styles.highlightedMessage : ''
                            } ${
                            // 현재 선택된 검색 결과 강조
                            index === highlightedMessageIndexes?.[currentHighlightedIndex] ? styles.currentHighlight : ''
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
                                <p className={styles.messageText}>
                                    {renderMessageContent(message.content, index)}
                                </p>
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