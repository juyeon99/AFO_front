import '../../css/Chat.css';
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";

function Chat() {

    const [messages, setMessages] = useState([
        { sender: 'bot', text: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.' }
    ]);
    const [input, setInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [color, setColor] = useState('#D9D9D9');
    const [highlightedMessageIndexes, setHighlightedMessageIndexes] = useState([]);
    const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState(null);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const messageEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const colors = [
        '#000000', '#56D2FF', '#62D66A', '#7ED3BB', '#86390F',
        '#98D1FF', '#A1522C', '#C061FF', '#F8E4FF', '#FF5757',
        '#FF7F43', '#FF7FC1', '#FFBD43', '#FFE043', '#FFE8D3',
        '#FFFFFF'
    ];

    const isDarkColor = (color) => {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    };

    const handleSendMessage = () => {
        if (!input.trim() && selectedImages.length === 0) return;

        const newMessage = {
            sender: 'user',
            text: input.trim() || '',
            images: selectedImages.map(img => img.url)
        };

        setMessages([...messages, newMessage]);

        setInput('');
        setSelectedImages([]);

        setTimeout(() => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setColor(randomColor);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'bot', text: '추천을 준비 중입니다...' }
            ]);
        }, 500);
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        const images = [];

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image")) {
                const file = items[i].getAsFile();
                const url = URL.createObjectURL(file);
                images.push({ url, file });
            }
        }

        if (images.length > 0) {
            setSelectedImages(prevImages => [...prevImages, ...images]);
        }
    };

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, []);

    const handleInputChange = (e) => setInput(e.target.value);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
            handleSearch();
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));

        setSelectedImages(prevImages => [...prevImages, ...newImages]);
        e.target.value = '';
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);

        if (e.target.value === '') {
            clearSearch();
        }
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const highlightSearch = (text, query) => {
        if (!text) return '';

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    };

    const handleSearch = () => {
        if (!searchInput.trim()) return;

        const regex = new RegExp(searchInput, 'i');
        const indexes = messages
            .map((msg, idx) => (msg.text && regex.test(msg.text) ? idx : null))
            .filter(idx => idx !== null);

        if (indexes.length > 0) {
            setHighlightedMessageIndexes(indexes);
            const latestIndex = indexes.length - 1;
            setCurrentHighlightedIndex(latestIndex);
            scrollToMessage(indexes[latestIndex]);
        } else {
            setHighlightedMessageIndexes([]);
            setCurrentHighlightedIndex(null);
        }
    };

    const clearSearch = () => {
        setSearchInput('');
        setHighlightedMessageIndexes([]);
        setCurrentHighlightedIndex(null);
        setIsSearchMode(false);
        setTimeout(() => {
            if (messageEndRef.current) {
                messageEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    const scrollToMessage = (index) => {
        const messageElement = document.getElementById(`message-${index}`);
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const goToPreviousHighlight = () => {
        if (highlightedMessageIndexes.length > 0 && currentHighlightedIndex > 0) {
            const prevIndex = currentHighlightedIndex - 1;
            setCurrentHighlightedIndex(prevIndex);
            scrollToMessage(highlightedMessageIndexes[prevIndex]);
        }
    };

    const goToNextHighlight = () => {
        if (highlightedMessageIndexes.length > 0 && currentHighlightedIndex < highlightedMessageIndexes.length - 1) {
            const nextIndex = currentHighlightedIndex + 1;
            setCurrentHighlightedIndex(nextIndex);
            scrollToMessage(highlightedMessageIndexes[nextIndex]);
        }
    };

    useEffect(() => {
        const handleArrowKeyPress = (e) => {
            if (e.key === 'ArrowUp') {
                goToPreviousHighlight();
            } else if (e.key === 'ArrowDown') {
                goToNextHighlight();
            }
        };

        document.addEventListener('keydown', handleArrowKeyPress);
        return () => {
            document.removeEventListener('keydown', handleArrowKeyPress);
        };
    }, [currentHighlightedIndex, highlightedMessageIndexes]);

    const toggleSearchMode = () => {
        setIsSearchMode((prevMode) => !prevMode);
    };

    return (
        <div className="chat-container-wrapper">
            <div className="chat-container">
                <div className="chat-header">
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
                        {isSearchMode
                            ? highlightedMessageIndexes.map((index) => (
                                <div key={index} className="chat-search-result">
                                    <p className="chat-search-result-text" dangerouslySetInnerHTML={{ __html: highlightSearch(messages[index].text, searchInput) }}></p>
                                </div>
                            ))
                            : messages.map((msg, index) => (
                                <div
                                    key={index}
                                    id={`message-${index}`}
                                    className={`chat-message ${msg.sender === 'bot' ? 'chat-bot-message' : 'chat-user-message'} ${highlightedMessageIndexes.includes(index) && index === currentHighlightedIndex ? 'highlighted' : ''}`}
                                >
                                    {msg.sender === 'bot' && (
                                        <>
                                            <img src="/images/logo-bot.png" alt="Bot Avatar" className="chat-avatar" />
                                            <div className="chat-message-text-wrapper">
                                                <p
                                                    className="chat-message-text"
                                                    dangerouslySetInnerHTML={{ __html: highlightSearch(msg.text, searchInput) }}
                                                ></p>
                                                <div className={`chat-color-bar ${color === '#FFFFFF' ? 'highlighted-border' : ''}`} style={{ backgroundColor: color }}></div>
                                            </div>
                                        </>
                                    )}
                                    {msg.sender === 'user' && (
                                        <div className="chat-message-text-wrapper chat-user-message-wrapper">
                                            {msg.text && (
                                                <p
                                                    className="chat-message-text"
                                                    dangerouslySetInnerHTML={{ __html: highlightSearch(msg.text, searchInput) }}
                                                ></p>
                                            )}
                                            {msg.images && msg.images.map((image, idx) => (
                                                <img key={idx} src={image} alt="Uploaded" className="chat-uploaded-image" />
                                            ))}
                                            <div className={`chat-color-circle ${color === '#FFFFFF' ? 'highlighted-border' : ''}`} style={{ backgroundColor: color }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        <div ref={messageEndRef}></div>
                    </div>
                </div>
                <div className="chat-input-area-wrapper">
                    {/* 이미지 미리보기 카드 */}
                    {selectedImages.length > 0 && (
                        <div className="chat-image-preview-container">
                            {selectedImages.map((image, index) => (
                                <div key={index} className="chat-image-preview-card">
                                    <img src={image.url} alt="Selected" className="chat-image-preview" />
                                    <button className="chat-remove-image-button" onClick={() => handleRemoveImage(index)}>×</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 채팅 입력창 */}
                    <div className={`chat-input-area ${isDarkColor(color) ? 'chat-dark-theme' : 'chat-light-theme'} ${color === '#FFFFFF' ? 'highlighted-border' : ''}`} style={{ backgroundColor: color }}>
                        <label htmlFor="file-upload" className="chat-file-upload">
                            <img src="/images/image.png" alt="Upload" className="upload-icon" />
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                multiple
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
        </div>
    )
}

export default Chat;
