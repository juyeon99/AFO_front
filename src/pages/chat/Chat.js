import '../../css/Chat.css';
import { NavLink } from "react-router-dom";
import NonMemberLoginModal from '../../components/login/LoginModal';
import { useChatLogic } from './ChatLogic';

function Chat() {

    const {
        chatMode,
        response,
        loading,
        error,
        recommendedPerfumes,
        messages,
        setMessages,
        input,
        setInput,
        selectedImages,
        setSelectedImages,
        searchInput,
        setSearchInput,
        color,
        setColor,
        isDarkColor,
        highlightedMessageIndexes,
        setHighlightedMessageIndexes,
        currentHighlightedIndex,
        setCurrentHighlightedIndex,
        isSearchMode,
        setIsSearchMode,
        modalImage,
        setModalImage,
        isModalOpen,
        setIsModalOpen,
        fileInputRef,
        isLoading,
        setIsLoading,
        isLoggedIn,
        setIsLoggedIn,
        hasReceivedRecommendation,
        setHasReceivedRecommendation,
        showLoginModal,
        setShowLoginModal,
        retryAvailable,
        setRetryAvailable,
        messageEndRef,
        getColorForCategory,
        handleSendMessage,
        handlePaste,
        handleInputChange,
        handleKeyPress,
        handleImageUpload,
        handleRemoveImage,
        openModal,
        closeModal,
        handleSearchChange,
        highlightSearch,
        handleSearch,
        clearSearch,
        scrollToMessage,
        goToPreviousHighlight,
        goToNextHighlight,
        toggleSearchMode,
        handleGoBack,
        RecommendationCard,
        navigate,
    } = useChatLogic();

    return (
        <div className="chat-container-wrapper">
            <div className="chat-container">
                <div className="chat-header">
                    {/* 뒤로가기 버튼 */}
                    <button className="chat-back-button" onClick={handleGoBack}>
                        <img src="/images/back.png" alt="back" className="chat-back-image" />
                    </button>

                    <NavLink to="/">
                        <img src="/images/logo.png" alt="방향" className="chat-title-image" />
                    </NavLink>
                    <p className="chat-subtitle">
                        일상의 순간을 향으로 기록해보세요. <br />
                        원하는 향의 느낌을 이미지 또는 텍스트로 작성하면, 센티크가 향을 추천해 줄거예요 :)
                    </p>
                </div>

                <div className={`chat-search-bar ${searchInput ? 'search-active' : 'search-inactive'}`}>
                    <input
                        type="text"
                        placeholder="검색할 단어를 입력해주세요"
                        className="chat-search-input"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="chat-search-button" onClick={handleSearch}>
                        <img src="/images/search.png" alt="Search" />
                    </button>
                    {searchInput && (
                        <>
                            <button className="chat-arrow-button" onClick={goToPreviousHighlight} disabled={currentHighlightedIndex === 0}>▲</button>
                            <button className="chat-arrow-button" onClick={goToNextHighlight} disabled={currentHighlightedIndex === highlightedMessageIndexes.length - 1}>▼</button>
                            <button className="chat-clear-search-button" onClick={clearSearch}>X</button>
                            <button className="chat-open-search-mode" onClick={toggleSearchMode}>통합검색</button>
                        </>
                    )}
                </div>

                <div className="chat-message-box" style={{ '--scroll-color': color }}>
                    <div className="chat-messages-container">
                        {/* 검색 모드일 경우 */}
                        {isSearchMode && highlightedMessageIndexes.length > 0 ? (
                            highlightedMessageIndexes.map((index) => (
                                <div key={index} className="chat-search-result">
                                    <p
                                        className="chat-search-result-text"
                                        dangerouslySetInnerHTML={{
                                            __html: highlightSearch(messages[index].text, searchInput),
                                        }}
                                    ></p>
                                </div>
                            ))
                        ) : (
                            // 추천 모드 또는 일반 채팅 모드 렌더링
                            <>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        id={`message-${index}`}
                                        className={`chat-message ${msg.sender === 'bot' ? 'chat-bot-message' : 'chat-user-message'} ${highlightedMessageIndexes.includes(index) && index === currentHighlightedIndex
                                            ? 'highlighted'
                                            : ''
                                            }`}
                                    >
                                        {/* 봇 메시지: 추천 이미지 렌더링 */}
                                        {msg.sender === 'bot' && msg.generatedImage && (
                                            <div className="chat-recommendation-image">
                                                <img src={msg.generatedImage} alt="추천 이미지" className="generated-image" />
                                            </div>
                                        )}

                                        {/* 봇 메시지: 추천 리스트 렌더링 */}
                                        {msg.sender === 'bot' && Array.isArray(msg.recommendations) && msg.recommendations.length > 0 ? (
                                            <div className="chat-recommendations-container">
                                                <img src="/images/logo-bot.png" alt="Bot Avatar" className="chat-avatar" />
                                                <div className="chat-recommendations-wrapper">
                                                    {msg.recommendations.map((perfume, idx) => (
                                                        <RecommendationCard key={idx} perfume={perfume} />
                                                    ))}
                                                </div>
                                                <div
                                                    className={`chat-color-bar ${color === '#FFFFFF' ? 'highlighted-border' : ''
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                ></div>

                                                {/* "향기 카드 만들기" 버튼 */}
                                                <button
                                                    className="chat-create-scent-card-button"
                                                    onClick={() =>
                                                        navigate('/history', {
                                                            state: {
                                                                recommendations: msg.recommendations, // 추천 데이터를 전달
                                                            },
                                                        })
                                                    }
                                                >
                                                    향기 카드 만들기
                                                </button>
                                            </div>

                                        ) : (
                                            <>

                                                {/* 봇 일반 메시지 렌더링 */}
                                                {msg.sender === 'bot' && (
                                                    <>
                                                        <img src="/images/logo-bot.png" alt="Bot Avatar" className="chat-avatar" />
                                                        <div className="chat-message-text-wrapper">
                                                            <p
                                                                className="chat-message-text"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: highlightSearch(msg.text, searchInput),
                                                                }}
                                                            ></p>
                                                            <div
                                                                className={`chat-color-bar ${color === '#FFFFFF' ? 'highlighted-border' : ''
                                                                    }`}
                                                                style={{ backgroundColor: color }}
                                                            ></div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {/* 사용자 메시지 렌더링 */}
                                        {msg.sender === 'user' && (
                                            <div className="chat-message-text-wrapper chat-user-message-wrapper">
                                                {msg.text && (
                                                    <p
                                                        className="chat-message-text"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightSearch(msg.text, searchInput),
                                                        }}
                                                    ></p>
                                                )}
                                                {msg.images &&
                                                    msg.images.map((image, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={image}
                                                            alt="Uploaded"
                                                            className="chat-uploaded-image"
                                                            onClick={() => openModal(image)}
                                                        />
                                                    ))}
                                                <div
                                                    className={`chat-color-circle ${color === '#FFFFFF' ? 'highlighted-border' : ''
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                                {/* 재시도 버튼 */}
                                                {retryAvailable && (
                                                    <div className="chat-input-area-wrapper-retry">
                                                        <button
                                                            className="chat-retry-button"
                                                            onClick={() => {
                                                                setRetryAvailable(false); // 재시도 버튼 숨기기
                                                                handleSendMessage(true); // 메시지 재전송
                                                            }}
                                                        >
                                                            재시도하기
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}

                        {/* 로딩 중일 때 로딩 메시지 표시 */}
                        {loading && (
                            <div className="chat-message chat-bot-message">
                                <img src="/images/logo-bot.png" alt="Bot Avatar" className="chat-avatar" />
                                <div className="chat-message-text-wrapper">
                                    <div className="chat-loading-enhanced-loader">
                                        <div className="chat-loading-floating-smoke chat-loading-smoke-1"></div>
                                        <div className="chat-loading-floating-smoke chat-loading-smoke-2"></div>
                                        <div className="chat-loading-floating-smoke chat-loading-smoke-3"></div>
                                        <div className="chat-loading-floating-smoke chat-loading-smoke-4"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 메세지 끝 스크롤 */}
                        <div ref={messageEndRef}></div>
                    </div>
                </div>

                <div className="chat-input-area-wrapper">
                    {selectedImages.length > 0 && (
                        <div className="chat-image-preview-container">
                            {selectedImages.map((image, index) => (
                                <div key={index} className="chat-image-preview-card">
                                    <img src={image.url} alt="Selected" className="chat-image-preview" onClick={() => openModal(image.url)} />
                                    <button className="chat-remove-image-button" onClick={() => handleRemoveImage(index)}>×</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`chat-input-area ${isDarkColor(color) ? 'chat-dark-theme' : 'chat-light-theme'} ${color === '#FFFFFF' ? 'highlighted-border' : ''}`} style={{ backgroundColor: color }}>
                        <label htmlFor="file-upload" className="chat-file-upload">
                            <img src="/images/image.png" alt="Upload" className="upload-icon" />
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                        </label>

                        <input
                            id='text'
                            type="text"
                            placeholder="메시지를 입력하세요"
                            className={`chat-input ${isDarkColor(color) ? 'chat-dark-theme' : 'chat-light-theme'}`}
                            style={{ backgroundColor: color }}
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="chat-send-button" onClick={handleSendMessage}>➤</button>
                    </div>
                </div>

            </div>
            {
                isModalOpen && (
                    <div className="chat-modal-overlay" onClick={closeModal}>
                        <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
                            <img src={modalImage} alt="원본 이미지" className="chat-modal-image" />
                        </div>
                    </div>
                )
            }

            {showLoginModal && <NonMemberLoginModal navigate={navigate} setShowLoginModal={setShowLoginModal} />}

        </div >
    );
}

export default Chat;
