import React, { memo } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from '../messages/MessageList';
import ChatInput from '../input/ChatInput';
import SearchBar from '../search/SearchBar';
import ImageModal from '../modals/ImageModal';
import LoginModal from '../modals/LoginModal';
import styles from '../../../css/modules/ChatContainer.module.css';
import { useUpload } from '../../../pages/chat/hooks/useUpload';

/**
 * 채팅 화면의 전체 구조를 담당하는 컴포넌트
 * 
 * 화면 구성:
 * - 상단: 헤더 (뒤로가기, 로고)
 * - 검색창: 채팅 내용 검색
 * - 중앙: 메시지 목록
 * - 하단: 메시지 입력창
 * - 팝업: 이미지 확대, 로그인 안내
 */

const ChatContainer = memo(({
    messageProps,     // 메시지 목록 관련 속성들
    inputProps,      // 입력창 관련 속성들
    searchProps,     // 검색 관련 속성들
    modalProps,      // 모달 관련 속성들
    handleGoBack     // 뒤로가기 처리 함수
}) => {
    // 이미지 업로드 관련 기능들
    const {
        selectedImages,      // 선택된 이미지들
        setSelectedImages,   // 이미지 선택 상태 변경
        handleImageUpload,   // 이미지 업로드 처리
        handleRemoveImage    // 이미지 제거 처리
    } = useUpload();

    // searchProps가 undefined일 경우를 대비한 기본값 설정
    const defaultSearchProps = {
        searchInput: '',
        setSearchInput: () => { },
        handleInputChange: () => { },
        handleSearch: () => { },
        goToPreviousHighlight: () => { },
        goToNextHighlight: () => { },
        clearSearch: () => { },
        currentHighlightedIndex: null,
        highlightedMessageIndexes: []
    };

    // searchProps가 없을 경우 기본값 사용
    const finalSearchProps = searchProps || defaultSearchProps;

    return (
        <div className={styles.containerWrapper}>
            <div className={styles.container}>
                {/* 상단 헤더 */}
                <ChatHeader onGoBack={handleGoBack} />

                {/* 검색창 */}
                <SearchBar {...searchProps } />

                {/* 메시지 목록 */}
                <MessageList {...messageProps}
                searchInput={searchProps?.searchInput}
                />

                {/* 메시지 입력창 */}
                <ChatInput {...inputProps}
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                />
            </div>

            {/* 이미지 확대 모달 */}
            {modalProps?.isImageModalOpen && (
                <ImageModal {...modalProps.imageModal} />
            )}

            {/* 로그인 안내 모달 */}
            {modalProps?.isLoginModalOpen && (
                <LoginModal {...modalProps.loginModal} />
            )}
        </div>
    );
});

export default ChatContainer;