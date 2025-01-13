import React, { memo } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from '../messages/MessageList';
import ChatInput from '../input/ChatInput';
import SearchBar from '../search/SearchBar';
import ImageModal from '../modals/ImageModal';
import LoginModal from '../modals/LoginModal';
import styles from '../../../css/modules/ChatContainer.module.css';

/**
 * 채팅 컨테이너 컴포넌트
 * 전체 채팅 UI 레이아웃을 구성
 */
const ChatContainer = memo(({
    messageProps,
    inputProps,
    searchProps,
    modalProps,
    handleGoBack
}) => {
    return (
        <div className={styles.containerWrapper}>
            <div className={styles.container}>
                <ChatHeader onGoBack={handleGoBack} />
                <SearchBar
                    searchInput={searchProps.searchInput}
                    setSearchInput={searchProps.setSearchInput}
                    handleSearch={searchProps.handleSearch}
                    clearSearch={searchProps.clearSearch}
                />
                <MessageList {...messageProps} />
                <ChatInput {...inputProps} />
            </div>

            {modalProps.isImageModalOpen && (
                <ImageModal {...modalProps.imageModal} />
            )}

            {modalProps.isLoginModalOpen && (
                <LoginModal {...modalProps.loginModal} />
            )}
        </div>
    );
});

export default ChatContainer;
