import { useMessages } from './useMessages';    // 메시지 관련 기능
import { useSearch } from './useSearch';        // 검색 관련 기능
import { useUpload } from './useUpload';        // 이미지 업로드 관련 기능
import { useModal } from './useModal';          // 팝업창 관리
import { useNavigate } from 'react-router-dom'; // 페이지 이동
import { useState } from 'react';

/**
 * 채팅 기능을 모아둔 Hook
 * 
 * 이 Hook은 채팅에 필요한 모든 기능을 한곳에 모아서 관리합니다:
 * - 메시지 주고받기
 * - 메시지 검색하기
 * - 이미지 업로드하기
 * - 모달창(팝업) 관리하기
 */

export const useChat = () => {
    const navigate = useNavigate();

    // 메시지 관련 상태 및 함수
    const { 
        messages, 
        setMessages, 
        isLoading, 
        retryAvailable, 
        addMessage 
    } = useMessages();
    
    // 검색 관련 상태 및 함수
    const {
        searchInput,
        setSearchInput,
        handleSearch,
        goToPreviousHighlight,
        goToNextHighlight,
        clearSearch,
        currentHighlightedIndex,
        highlightedMessageIndexes
    } = useSearch(messages);
    
    // 이미지 업로드 관련 상태 및 함수
    const { 
        selectedImages, 
        setSelectedImages, 
        handleRemoveImage 
    } = useUpload();

    // 모달 관련 상태
    const { modalProps } = useModal();

    // input 상태 추가 (가이드 메시지 입력 반영)
    const [input, setInput] = useState("");

    // 메시지 전송 핸들러 추가
    const handleSendMessage = async (content) => {
        if (selectedImages.length > 0 || content.trim()) {
            const imageFile = selectedImages[0]?.file || null;
            console.log('전송할 이미지:', imageFile);
            await addMessage(content, selectedImages);
            setSelectedImages([]); // 이미지 전송 후 초기화
            setInput(""); // 입력창 초기화
        }
    };

    // inputProps 수정
    const inputProps = {
        onSend: handleSendMessage,  // addMessage 대신 handleSendMessage 사용
        setInput, // 가이드 메시지가 입력될 수 있도록 추가
        input, // 입력값 상태
        selectedImages,
        setSelectedImages,
        handleRemoveImage
    };

    const handleGoBack = () => navigate(-1);

    return {
        messageProps: {
            messages,
            setMessages,
            isLoading,
            retryAvailable,
            selectedImages,
            setSelectedImages,
            addMessage: handleSendMessage, // 여기도 handleSendMessage로 변경
            openImageModal: modalProps.imageModal.openModal,
            highlightedMessageIndexes,
            currentHighlightedIndex
        },
        inputProps,
        searchProps: {
            searchInput,
            setSearchInput,
            handleSearch,
            goToPreviousHighlight,
            goToNextHighlight,
            clearSearch,
            currentHighlightedIndex,
            highlightedMessageIndexes
        },
        modalProps,      
        handleGoBack,
    };
};
