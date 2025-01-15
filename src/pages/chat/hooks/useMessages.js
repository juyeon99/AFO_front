import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { fetchChatResponse } from '../../../module/ChatModule';

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

    // 메시지 목록 상태 관리
    // 첫 메시지는 AI의 환영 메시지
    const [messages, setMessages] = useState([{
        id: uuidv4(),
        type: 'AI',
        content: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.',
        mode: 'chat',
        isInitialMessage: true
    }]);

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
                file: file
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
        // 사용자 메시지 추가
        const userMessage = {
            id: uuidv4(),
            type: 'USER',
            content,
            images: images.map(url => ({ url })), // 이미지 배열로 저장
            mode: 'chat'
        };
        setMessages(prev => [...prev, userMessage]);

        // AI 응답 요청
        setIsLoading(true);
        try {
            // 이미지와 텍스트 모두 전송
            const response = await dispatch(fetchChatResponse({
                content: content.trim(),
                image: images[0]
            }));

            if (response?.payload?.data) {
                const aiMessage = {
                    id: uuidv4(),
                    type: 'AI',
                    content: response.payload.data.content,
                    images: response.payload.data.imageUrl,
                    mode: 'chat'
                };
                setMessages(prev => [...prev, aiMessage]);
                setRetryAvailable(false);
            }
        } catch (error) {
            console.error('Error fetching response:', error);
            setRetryAvailable(true);
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