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
    // 페이지 이동을 위한 함수
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
    
    // useSearch에서 반환되는 값들을 직접 받아옴
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

    // 메시지 관련 props 통합
    const messageProps = {
        messages,
        isLoading,
        highlightedMessageIndexes,
        currentHighlightedIndex
    };

    // 입력 관련 props 통합
    const inputProps = {
        onSend: addMessage,
        ...uploadProps,
    };

    // 뒤로가기 버튼을 눌렀을 때 실행되는 함수
    const handleGoBack = () => navigate(-1);

    return {
        messageProps: {
            messages,
            setMessages,
            isLoading,
            retryAvailable,
            selectedImages,
            setSelectedImages,
            addMessage,
            openImageModal: modalProps.imageModal.openModal,  // 이미지 모달 함수 추가
            highlightedMessageIndexes,  // 검색 하이라이트 정보 추가
            currentHighlightedIndex     // 현재 하이라이트 인덱스 추가
        },
        inputProps,
        searchProps: {  // 검색 관련 props 구조 수정
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