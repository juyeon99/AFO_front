import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { fetchChatResponse } from '../../../module/ChatModule';
import { useChatHistory } from './useChatHistory';

/**
 * 채팅 메시지를 관리하는 Hook
 * 
 * 이 Hook은 다음과 같은 일을 합니다:
 * 1. 메시지 목록 관리 (AI와 사용자 메시지)
 * 2. 이미지 첨부 기능
 * 3. 메시지 전송과 응답 처리
 */

export const useMessages = () => {
    const dispatch = useDispatch();
    const INITIAL_MESSAGE_ID = '000000000000000000000000';
    const [messages, setMessages] = useState([{
        id: INITIAL_MESSAGE_ID,  // 고정된 ID 사용
        type: 'AI',
        content: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.',
        mode: 'chat',
        isInitialMessage: true,
        style: {
            fontSize: '20px',
            lineHeight: '1.6'
        }
    }]);

    const { chatHistory, loadChatHistory } = useChatHistory();

    // 컴포넌트 마운트 시 채팅 기록 로드
    useEffect(() => {
        loadChatHistory();
    }, []);

    // 채팅 기록이 로드되면 초기 메시지와 함께 설정
    useEffect(() => {
        if (chatHistory && chatHistory.length > 0) {
            setMessages(prevMessages => {
                console.log("기존 메시지:", prevMessages);
                console.log("로드된 채팅 기록:", chatHistory);
    
                // 중복 메시지 제거
                const existingIds = new Set(prevMessages.map(msg => msg.chatId || msg.id));
                const uniqueMessages = chatHistory.filter(msg => !existingIds.has(msg.chatId || msg.id));
    
                console.log("새롭게 추가될 메시지:", uniqueMessages);
    
                return [...prevMessages, ...uniqueMessages];
            });
        }
    }, [chatHistory]);    
    

    // 로딩 상태와 재시도 가능 여부
    const [isLoading, setIsLoading] = useState(false);      // 메시지 전송 중인지
    const [retryAvailable, setRetryAvailable] = useState(false); // 재시도 가능 여부

    // 선택된 이미지 상태 관리
    const [selectedImages, setSelectedImages] = useState([]);

    /**
   * 이미지 업로드 처리 함수
   * - 파일을 선택하면 미리보기 URL 생성
   */

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 새 이미지 정보 생성
            const newImage = {
                url: URL.createObjectURL(file),
                file: file,  // 실제 파일 객체 저장
                type: file.type,
                name: file.name
            };
            setSelectedImages([newImage]); // 새 이미지로 대체
        }
        e.target.value = ''; // 파일 입력 초기화
    };

    /**
   * 이미지 제거 함수
   * - 선택된 이미지 목록에서 특정 이미지 삭제
   */

    const handleRemoveImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    /**
    * 메시지 전송 함수
    * 1. 사용자 메시지 추가
    * 2. AI 응답 요청
    * 3. 응답 받으면 AI 메시지 추가
    */
    const addMessage = async (content, images = []) => {
        console.log('useMessages에서 받은 데이터:', { content, images });
    
        // 이미지 파일 추출 및 로깅
        const imageFile = images?.[0]?.file || null;
        console.log('전달될 이미지 파일:', imageFile);
    
        // 사용자 메시지를 즉시 추가하여 채팅창에 표시
        const userMessage = {
            id: new Date().getTime().toString(),
            type: 'USER',
            content,
            imageUrl: images?.[0]?.url || null, // Blob URL 임시 저장
            images: images.map(img => ({ 
                url: img.url,
                file: img.file  // 파일 객체도 함께 저장
            })),
            mode: 'chat'
        };
        setMessages(prev => [...prev, userMessage]);
    
        setIsLoading(true);
        try {
            // imageFile을 명시적으로 전달
            const response = await dispatch(fetchChatResponse(content, imageFile, null));
    
            console.log('API 응답 전체:', response);
    
            if (response) {
                setMessages(prev => {
                    // 기존 메시지의 이미지 URL을 서버 응답의 URL로 업데이트
                    const updatedMessages = prev.map(msg => 
                        msg.id === userMessage.id 
                            ? { ...msg, imageUrl: response.imageUrl || msg.imageUrl } 
                            : msg
                    );
    
                    const isDuplicate = updatedMessages.some(msg => msg.id === response.id);
                    if (isDuplicate) {
                        console.warn('중복된 AI 메시지 추가 방지:', response.id);
                        return updatedMessages;
                    }
    
                    // AI 메시지 추가
                    const aiMessage = {
                        id: response.id,
                        type: 'AI',
                        content: response.content,
                        mode: response.mode || 'chat',
                        imageUrl: response.imageUrl || null,
                        lineId: response.lineId || null,
                        recommendations: response.recommendations || null,
                        recommendationType: response.recommendationType || null,
                        timestamp: response.timeStamp || new Date().toISOString()
                    };
    
                    console.log('추가되는 AI 메시지:', aiMessage);
                    return [...updatedMessages, aiMessage];
                });
    
                setRetryAvailable(false);
            }
        } catch (error) {
            // ... 기존 에러 처리 코드 유지
        } finally {
            setIsLoading(false);
        }
    };

    /**
        * 메시지 재전송 함수
        * - 마지막 메시지가 사용자 메시지일 때만 재시도
        */

    const handleRetry = () => {
        if (retryAvailable && messages[messages.length - 1]?.type === 'USER') {
            const lastMessage = messages[messages.length - 1];
            addMessage(lastMessage.content, lastMessage.images?.[0]);
        }
    };

    return {
        messages,
        setMessages,
        isLoading,
        retryAvailable,
        selectedImages,
        setSelectedImages,
        handleImageUpload,
        handleRemoveImage,
        addMessage,
        handleRetry
    };
};