import '../../css/Chat.css';
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

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
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const messageEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true); // 로딩 시작

        setTimeout(() => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setColor(randomColor);

            const botResponse = generateBotResponse(newMessage.text);

            // 추천 리스트가 있으면 추천 메시지만 추가하고, 없으면 기본 텍스트 메시지 추가
            const botMessage = Array.isArray(botResponse) && botResponse.length > 0
                ? { sender: 'bot', recommendations: botResponse }
                : { sender: 'bot', text: botResponse[0]?.description || "죄송합니다, 해당하는 추천이 없습니다." };

            setMessages(prevMessages => [...prevMessages, botMessage]);
            setIsLoading(false); // 로딩 종료
        }, 18000); // 로딩을 테스트하기 위해 지연 시간 증가 (실제 코드에서는 적절히 수정)
    };


    const generateBotResponse = (userInput) => {
        const lowerInput = userInput.toLowerCase();

        if (lowerInput.includes('달콤') || lowerInput.includes('스윗')) {
            return [
                {
                    name: 'Dior Miss Dior',
                    description: '플로럴과 과일 향의 조화로 따뜻하고 부드러운 느낌.',
                },
                {
                    name: 'YSL Mon Paris',
                    description: '베리 향과 머스크의 달콤함이 매력적인 향수.',
                },
                {
                    name: 'Prada Candy',
                    description: '캐러멜과 바닐라의 달콤함이 돋보이는 향수.',
                }
            ];
        } else if (lowerInput.includes('상쾌') || lowerInput.includes('프레시')) {
            return [
                {
                    name: 'Chanel Chance Eau Fraîche',
                    description: '시트러스와 플로럴의 경쾌함이 특징.',
                },
                {
                    name: 'Jo Malone English Pear & Freesia',
                    description: '과일과 꽃 향이 어우러진 상쾌한 향수.',
                },
                {
                    name: 'Acqua di Parma Blu Mediterraneo',
                    description: '바다를 떠올리게 하는 시원한 시트러스 향.',
                }
            ];
        } else if (lowerInput.includes('우디') || lowerInput.includes('나무')) {
            return [
                {
                    name: 'Tom Ford Oud Wood',
                    description: '깊고 매혹적인 나무 향의 대명사.',
                },
                {
                    name: 'Le Labo Santal 33',
                    description: '샌달우드와 머스크의 조화로 우아함을 더한 향수.',
                },
                {
                    name: 'Byredo Super Cedar',
                    description: '신선하고 부드러운 우디 향이 매력적입니다.',
                }
            ];
        } else if (lowerInput.includes('플로럴') || lowerInput.includes('꽃')) {
            return [
                {
                    name: 'Gucci Bloom',
                    description: '풍성한 플로럴 향으로 여성스러움을 강조.',
                },
                {
                    name: 'Marc Jacobs Daisy',
                    description: '화사하고 상쾌한 꽃 향의 조화.',
                },
                {
                    name: 'Chloe Eau de Parfum',
                    description: '장미와 머스크의 부드러운 플로럴 향수.',
                }
            ];
        } else if (lowerInput.includes('시트러스') || lowerInput.includes('레몬')) {
            return [
                {
                    name: 'Jo Malone Lime Basil & Mandarin',
                    description: '밝고 상쾌한 시트러스 향.',
                },
                {
                    name: 'Atelier Cologne Orange Sanguine',
                    description: '신선한 오렌지와 시트러스의 조화.',
                },
                {
                    name: 'Dior Sauvage',
                    description: '강렬한 시트러스와 우디의 독특한 조화.',
                }
            ];
        } else if (lowerInput.includes('따뜻') || lowerInput.includes('웜')) {
            return [
                {
                    name: 'Yves Saint Laurent Black Opium',
                    description: '따뜻한 바닐라와 커피 향이 매력적.',
                },
                {
                    name: 'Maison Margiela Replica By the Fireplace',
                    description: '따뜻한 나무와 마시멜로 향의 조화.',
                },
                {
                    name: 'Tom Ford Tobacco Vanille',
                    description: '바닐라와 담배 잎의 깊고 따뜻한 향수.',
                }
            ];
        } else {
            // 기본 메시지
            return [
                {
                    name: '알 수 없음',
                    description: '죄송합니다, 아직 준비되지 않은 추천입니다. "달콤한", "우디한" 등을 입력해 주세요.',
                }
            ];
        }
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

    const openModal = (imageSrc) => {
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);

        if (e.target.value === '') {
            clearSearch();
        }
    };

    const highlightSearch = (text, query) => {
        if (typeof text !== 'string') return '';

        if (!query) return text;

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

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };


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
                                    {msg.sender === 'bot' ? (
                                        Array.isArray(msg.recommendations) && msg.recommendations.length > 0 ? (
                                            // 추천 리스트가 있을 경우 카드 형식으로 렌더링
                                            <div className="chat-recommendations-container">
                                                <img src="/images/logo-bot.png" alt="Bot Avatar" className="chat-avatar" />
                                                <div className="chat-recommendations-wrapper">
                                                    {msg.recommendations.map((item, idx) => (
                                                        <div key={idx} className="chat-recommendation-card">
                                                            <p className="chat-recommendation-name">{item.name}</p>
                                                            <p className="chat-recommendation-description">{item.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={`chat-color-bar ${color === '#FFFFFF' ? 'highlighted-border' : ''}`} style={{ backgroundColor: color }}></div>
                                            </div>
                                        ) : (
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
                                        )
                                    ) : (
                                        // 사용자 메시지 렌더링
                                        <div className="chat-message-text-wrapper chat-user-message-wrapper">
                                            {msg.text && (
                                                <p
                                                    className="chat-message-text"
                                                    dangerouslySetInnerHTML={{ __html: highlightSearch(msg.text, searchInput) }}
                                                ></p>
                                            )}
                                            {msg.images && msg.images.map((image, idx) => (
                                                <img key={idx} src={image} alt="Uploaded" className="chat-uploaded-image" onClick={() => openModal(image)} />
                                            ))}
                                            <div className={`chat-color-circle ${color === '#FFFFFF' ? 'highlighted-border' : ''}`} style={{ backgroundColor: color }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        {/* 로딩 중일 때 로딩 메시지 표시 */}
                        {isLoading && (
                            <div className="chat-message chat-bot-message">
                                <img src="/images/logo-bot.png" alt="Bot Avatar" className="chat-avatar" />
                                <div className="chat-message-text-wrapper">
                                    <img src="/images/loading.gif" alt="Loading" className="chat-loading-gif" />
                                    <div className={`chat-color-bar ${color === '#FFFFFF' ? 'highlighted-border' : ''}`} style={{ backgroundColor: color }}></div>
                                </div>
                            </div>
                        )}

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
            {isModalOpen && (
                <div className="chat-modal-overlay" onClick={closeModal}>
                    <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={modalImage} alt="원본 이미지" className="chat-modal-image" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
