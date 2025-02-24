import { useMessages } from './useMessages';    // 메시지 관련 기능
import { useSearch } from './useSearch';        // 검색 관련 기능
import { useUpload } from './useUpload';        // 이미지 업로드 관련 기능
import { useModal } from './useModal';          // 팝업창 관리
import { useNavigate } from 'react-router-dom'; // 페이지 이동

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

    // 각 기능별 훅 사용
    const { 
        messages, 
        setMessages, 
        isLoading, 
        retryAvailable, 
        selectedImages, 
        setSelectedImages, 
        addMessage 
    } = useMessages();
    
    const {
        searchInput,
        setSearchInput,
        handleSearch,
        goToPreviousHighlight,
        goToNextHighlight,
        clearSearch,
        currentHighlightedIndex,
        highlightedMessageIndexes,
        isSearchMode
    } = useSearch(messages);
    
    const { uploadProps } = useUpload();
    const { modalProps } = useModal();

    // 메시지 전송 핸들러 추가
    const handleSendMessage = async (content) => {
        if (selectedImages.length > 0 || content.trim()) {
            const imageFile = selectedImages[0]?.file || null;
            console.log('전송할 이미지:', imageFile);
            await addMessage(content, selectedImages);
            setSelectedImages([]); // 이미지 전송 후 초기화
        }
    };

    // inputProps 수정
    const inputProps = {
        onSend: handleSendMessage,  // addMessage 대신 handleSendMessage 사용
        ...uploadProps,
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