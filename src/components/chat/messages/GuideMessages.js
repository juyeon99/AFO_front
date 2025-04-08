import React, { useState, useEffect } from 'react';
import styles from '../../../css/chat/GuideMessages.module.css';
import { useLocation } from 'react-router-dom';

const language = localStorage.getItem('language') || 'english';

const guideMessages = [
    { id: 1, text: (language === 'english' ? "I'd like a woody fragrance recommendation." : "우디한 향을 추천받고 싶어요."), cleanText: (language === 'english' ? "I'd like a woody fragrance recommendation." : "우디한 향을 추천받고 싶어요.") },
    { id: 2, text: (language === 'english' ? "Recommend me a perfume that suits a café atmosphere! (Adding an interior image will help with a more accurate recommendation!)" : "카페 분위기에 어울리는 향수를 추천해 주세요! (이미지를 추가하면 더 정확한 추천이 가능합니다!)"), cleanText: (language === 'english' ? "Recommend me a perfume that suits a café atmosphere!" : "카페 분위기에 어울리는 향수를 추천해 주세요."), imageRelated: true },
    { id: 3, text: (language === 'english' ? "I want to find a fragrance that matches street fashion. (Attaching a fashion photo will provide a more precise recommendation!)" : "스트릿 패션에 어울리는 향수를 알고 싶어요. (패션 사진을 첨부하면 더 정확한 추천을 받을 수 있어요!)"), cleanText: (language === 'english' ? "I want to find a fragrance that matches street fashion." : "스트릿 패션에 어울리는 향수를 알고 싶어요."), imageRelated: true }
];

// 괄호 안의 텍스트 추출 함수
const extractTooltipText = (text) => {
    const match = text.match(/\((.*?)\)/); // 괄호 안의 내용만 추출
    return match ? match[1] : null;
};

// 현재 렌더링 사이클에서만 사용할 변수 (새로고침 시 초기화됨)
let hasInteractedInCurrentSession = false;

const GuideMessages = ({ onSend }) => {
    const [visible, setVisible] = useState(true);
    const location = useLocation();
    
    // 컴포넌트 마운트 시 항상 가이드 메시지 표시
    useEffect(() => {
        // 현재 세션에서 상호작용이 있었는지 확인
        if (hasInteractedInCurrentSession) {
            setVisible(false);
        } else {
            setVisible(true);
        }
        
        // 컴포넌트 언마운트 시 클린업 함수
        return () => {
            // 필요한 경우 클린업 로직 추가
        };
    }, [location.pathname]); // 경로가 변경될 때마다 재실행
    
    // 가이드 메시지 클릭 시 처리
    const handleSendMessage = (message) => {
        hasInteractedInCurrentSession = true;
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
                            onClick={() => handleSendMessage(message.cleanText)}
                        >
                            {message.cleanText}
                        </button>
                        {/* 괄호 안의 텍스트가 존재할 경우만 툴팁 표시 */}
                        {tooltipText && <span className={styles.tooltip} style={{ left: language === 'english' ? '30%' : '49%' }}>{tooltipText}</span>}
                    </div>
                );
            })}
        </div>
    );
};

// 외부에서 가이드 메시지 숨김 처리를 위한 함수 노출
GuideMessages.hideGuideMessages = () => {
    hasInteractedInCurrentSession = true;
};

export default GuideMessages;