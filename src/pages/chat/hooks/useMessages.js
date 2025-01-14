import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { fetchChatResponse } from '../../../module/ChatModule';

/**
 * 메시지 관리를 위한 커스텀 훅
 */
export const useMessages = () => {
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([{
        id: uuidv4(),
        type: 'AI',
        content: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.',
        mode: 'chat',
        isInitialMessage: true
    }]);

    // 채팅 모드 관련 상태
    const [chatMode, setChatMode] = useState("chat");
    const [recommendedPerfumes, setRecommendedPerfumes] = useState([]);
    const [hasReceivedRecommendation, setHasReceivedRecommendation] = useState(false);
    const [nonMemberChatCount, setNonMemberChatCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [retryAvailable, setRetryAvailable] = useState(false);

    // 색상 관련 상태
    const [color, setColor] = useState('#D9D9D9');

    const addMessage = async (content, imageUrl = null) => {
        // 사용자 메시지 추가
        const userMessage = {
            id: uuidv4(),
            type: 'USER',
            content,
            imageUrl,
            mode: 'chat'
        };
        setMessages(prev => [...prev, userMessage]);

        // AI 응답 요청
        setIsLoading(true);
        try {
            const response = await dispatch(fetchChatResponse(content, imageUrl));
            if (response && response.payload) {  // response 검증 추가
                setMessages(prev => [...prev, {
                    id: uuidv4(),
                    type: 'AI',
                    content: response.payload.data,  // payload에서 data 접근
                    mode: 'chat'
                }]);
            }
        } catch (error) {
            console.error('Error fetching response:', error);
            // 에러 발생 시 사용자에게 알림
            setMessages(prev => [...prev, {
                id: uuidv4(),
                type: 'AI',
                content: '죄송합니다. 응답을 받아오는 중 오류가 발생했습니다.',
                mode: 'chat'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        if (retryAvailable && messages[messages.length - 1]?.type === 'USER') {
            addMessage(messages[messages.length - 1].content, messages[messages.length - 1].imageUrl);
        }
    };

    const getColorForCategory = (lineId, filters) => {
        if (!lineId) return '#D9D9D9';
        const filter = filters.find(f => Number(f.id) === Number(lineId));
        return filter?.color || '#D9D9D9';
    };

    return {
        messages,
        setMessages,
        chatMode,
        setChatMode,
        recommendedPerfumes,
        setRecommendedPerfumes,
        hasReceivedRecommendation,
        setHasReceivedRecommendation,
        nonMemberChatCount,
        setNonMemberChatCount,
        isLoading,
        retryAvailable,
        color,
        setColor,
        addMessage,
        handleRetry,
        getColorForCategory
    };
};
