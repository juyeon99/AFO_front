import { useMessages } from './useMessages';
import { useSearch } from './useSearch';
import { useUpload } from './useUpload';
import { useModal } from './useModal';
import { useNavigate } from 'react-router-dom';

/**
 * 채팅 관련 모든 로직을 통합하는 커스텀 훅
 */
export const useChat = () => {
    const navigate = useNavigate();

    // 각 기능별 훅 사용
    const { messages, addMessage, isLoading } = useMessages();
    const { searchProps } = useSearch(messages);
    const { uploadProps } = useUpload();
    const { modalProps } = useModal();

    // 메시지 관련 props 통합
    const messageProps = {
        messages,
        isLoading,
        ...searchProps.highlighting,
        ...uploadProps.preview,
    };

    // 입력 관련 props 통합
    const inputProps = {
        onSend: addMessage,
        ...uploadProps.input,
    };

    const handleGoBack = () => navigate(-1);

    return {
        messageProps,
        inputProps,
        searchProps: searchProps.controls,
        modalProps,
        handleGoBack,
    };
};
