import React, { useState, useEffect } from 'react';
import styles from '../../../css/chat/GuideMessages.module.css';

const guideMessages = [
    { id: 1, text: "우디한 향을 추천받고 싶어요.", cleanText: "우디한 향을 추천받고 싶어요." },
    { id: 2, text: "카페 분위기에 어울리는 향수를 추천해 주세요! (이미지를 추가하면 더 정확한 추천이 가능합니다.)", cleanText: "카페 분위기에 어울리는 향수를 추천해 주세요.", imageRelated: true },
    { id: 3, text: "스트릿 패션에 어울리는 향수를 알고 싶어요. (패션 사진을 첨부하면 더 정확한 추천을 받을 수 있어요!)", cleanText: "스트릿 패션에 어울리는 향수를 알고 싶어요.", imageRelated: true }
];

// 괄호 안의 텍스트 추출 함수
const extractTooltipText = (text) => {
    const match = text.match(/\((.*?)\)/); // 괄호 안의 내용만 추출
    return match ? match[1] : null;
};

// 컴포넌트 외부에 변수 선언 (새로고침 시 초기화됨)
let hasUserInteracted = false;

const GuideMessages = ({ onSend }) => {
    const [visible, setVisible] = useState(true);
    
    // 컴포넌트가 마운트될 때마다 visible 상태 초기화
    useEffect(() => {
        setVisible(!hasUserInteracted);
    }, []);
    
    // 가이드 메시지 클릭 시 처리
    const handleSendMessage = (message) => {
        hasUserInteracted = true;
        setVisible(false);
        onSend(message);
    };

    if (!visible) return null;

    return (
        <div className={styles.guideMessages}>
            {guideMessages.map((message) => {
                const tooltipText = extractTooltipText(message.text);
                return (
                    <div key={message.id} className={styles.guideMessageWrapper}>
                        <button 
                            className={`${styles.guideMessageButton} ${message.imageRelated ? styles.imageGuide : ''}`}
                            onClick={() => {
                                handleSendMessage(message.cleanText);
                                setVisible(false);
                            }}
                        >
                            {message.cleanText}
                        </button>
                        {/* 괄호 안의 텍스트가 존재할 경우만 툴팁 표시 */}
                        {tooltipText && <span className={styles.tooltip}>{tooltipText}</span>}
                    </div>
                );
            })}
        </div>
    );
};

export default GuideMessages;