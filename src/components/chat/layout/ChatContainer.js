import React, { memo, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from '../messages/MessageList';
import ChatInput from '../input/ChatInput';
import SearchBar from '../search/SearchBar';
import ImageModal from '../modals/ImageModal';
import LoginModal from '../modals/LoginModal';
import styles from '../../../css/chat/ChatContainer.module.css';
import { useUpload } from '../../../pages/chat/hooks/useUpload';
import { useAuth } from '../../../pages/chat/hooks/useAuth';
import { useModal } from '../../../pages/chat/hooks/useModal';

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

     // 로그인 상태와 비회원 채팅 횟수 관리
     const { isLoggedIn, incrementNonMemberChatCount, nonMemberChatCount } = useAuth();

     // 모달 상태 관리
     const { modalProps: { isLoginModalOpen, loginModal, imageModal } } = useModal();

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
    const fileInputRef = useRef(null);

     // lineId에 따른 배경 클래스 결정 함수 추가
     const getBackgroundClass = () => {
        // 모든 메시지 중 가장 최근 메시지 찾기
        const lastMessage = [...messageProps.messages].reverse()[0];
    
        // 마지막 메시지가 AI의 추천 모드일 때만 lineId에 따른 배경 적용
        if (lastMessage?.type === 'AI' && lastMessage?.mode === 'recommendation' && lastMessage?.lineId) {
            const lineTypes = {
                1: styles.spicy,
                2: styles.fruity,
                3: styles.citrus,
                4: styles.green,
                5: styles.aldehyde,
                6: styles.aquatic,
                7: styles.fougere,
                8: styles.gourmand,
                9: styles.woody,
                10: styles.oriental,
                11: styles.floral,
                12: styles.musk,
                13: styles.powdery,
                14: styles.amber,
                15: styles.tobaccoLeather
            };
            return lineTypes[lastMessage.lineId] || styles.default;
        }
    
        // AI 추천 모드가 아닐 경우 기본 배경 반환
        return styles.default;
    };
    
     // 현재 배경 클래스 가져오기
     const currentBackgroundClass = getBackgroundClass();

        // 비회원 채팅 횟수 증가 및 로그인 모달 표시 로직
        useEffect(() => {
            if (!isLoggedIn) {
                const lastMessage = messageProps.messages[messageProps.messages.length - 1];
                if (lastMessage?.type === 'AI' && lastMessage?.mode === 'recommendation') {
                    incrementNonMemberChatCount();
                    if (nonMemberChatCount >= 3) {
                        loginModal.onOpen();
                    }
                }
            }
        }, [messageProps.messages]);

    return (
        <div className={`${styles.chatLayout} ${currentBackgroundClass}`}>
            <div className={styles.headerSection}>
                {/* 상단 헤더 */}
                <ChatHeader onGoBack={handleGoBack} />

                {/* 검색창 */}
                <SearchBar {...finalSearchProps} />
            </div>

            {/* 메세지 가림막 추가 */}
            <div className={`${styles.messageOverlay} ${currentBackgroundClass}`} />

            <div className={styles.messageSection}>
                {/* 메시지 목록 */}
                <MessageList 
                    {...messageProps}
                    searchInput={searchProps?.searchInput}
                    openImageModal={modalProps.imageModal.openModal}
                />
            </div>

            {/* 하단 메시지 가림막 */}
            <div className={`${styles.inputOverlay} ${currentBackgroundClass}`} />

            <div className={`${styles.inputSection} ${currentBackgroundClass}`}>
                {/* 메시지 입력창 */}
                <ChatInput {...inputProps}
                    onSend={inputProps.onSend}
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    fileInputRef={fileInputRef}
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

// 개발 도구에서 컴포넌트를 식별하기 위한 이름 설정
ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;