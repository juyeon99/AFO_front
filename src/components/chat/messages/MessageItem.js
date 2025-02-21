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

// 추천 타입에 따른 CSS 클래스를 반환하는 헬퍼 함수
const getRecommendationClass = (recommendationType) => {
    switch (recommendationType) {
        case 1:
            return styles.normalRecommendation;    // 일반추천
        case 2:
            return styles.fashionRecommendation;   // 패션 추천
        case 3:
            return styles.interiorRecommendation;  // 인테리어 추천
        case 4:
            return styles.therapyRecommendation;    // 테라피 추천
        default:
            return '';
    }
};

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
                        {/* 추천 모드일 경우, recommendationType에 따라 감각적으로 다른 스타일 적용 */}
                        {message.mode === 'recommendation' && (
                            <div className={`${styles.recommendations} ${getRecommendationClass(message.recommendationType)}`}>
                                {/* 추천 이미지가 있는 경우 */}
                                {message.imageUrl && (
                                    <img
                                        src={message.imageUrl}
                                        alt="추천 이미지"
                                        className={styles.recommendationImage}
                                    />
                                )}
                                {/* 추천 제품 목록 렌더링 */}
                                {Array.isArray(message.recommendations) && message.recommendations.map((rec, idx) => (
                                    <div key={idx} className={styles.recommendationItem}>
                                        <p>
                                            <strong>{rec.productNameKr}</strong> ({rec.productBrand} / {rec.productGrade})
                                        </p>
                                        <p>{rec.reason}</p>
                                        <p>{rec.situation}</p>
                                        {rec.productImageUrls && rec.productImageUrls.map((imgUrl, idy) => (
                                            <img
                                                key={idy}
                                                src={imgUrl}
                                                alt="추천 상품 이미지"
                                                className={styles.productImage}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div
                            className={styles.colorBar}
                            style={{ backgroundColor: color }}
                        />
                    </div>
                </>
            )}

            {/* 사용자 메시지 렌더링 */}
            {message?.type === 'USER' && (
                <div className={styles.messageContent}>
                    {/* 이미지가 있는 경우 이미지 갤러리 표시 */}
                    {message.images && message.images.length > 0 && (
                        <div className={styles.imageContainer}>
                            {message.images.map((image, idx) => (
                                <img
                                    key={idx}
                                    alt="Uploaded"
                                    className={styles.uploadedImage}
                                    onClick={() => openModal(image.url)}
                                />
                            ))}
                        </div>
                    )}
                    {/* 텍스트 메시지가 있는 경우 표시 */}
                    {message.content && (
                        <p className={styles.messageText}>
                            {highlightText(message.content)}
                        </p>
                    )}
                    <div className={styles.colorCircle} />
                </div>
            )}

        </div>
    );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
