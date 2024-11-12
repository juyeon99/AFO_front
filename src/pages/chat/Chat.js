import '../../css/Chat.css'
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom"

function Chat() {

    // 메시지 상태 관리
    const [messages, setMessages] = useState([
        { sender: 'bot', text: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.' }
    ]);
    const [input, setInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [color, setColor] = useState('#D9D9D9');
    const [highlightedMessageIndex, setHighlightedMessageIndex] = useState(null);
    const messageEndRef = useRef(null);

    const colors = ['#FF5757', '#FF7F43', '#FFBD43', '#FFE043', '#62D66A', '#98D1FF', '#56D2FF', '#FFD9A6', '#A1522C', '#86390F', '#C061FF', '#FF7FC1', '#F8E4FF', '#FFFFFF', '#000000'];

    // 메시지 추가 함수
    const handleSendMessage = () => {
        if (input.trim() === '') return;

        // 새로운 사용자 메시지 추가
        setMessages([...messages, { sender: 'user', text: input }]);

        // 봇의 응답 메시지 추가 (예시)
        setTimeout(() => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setColor(randomColor);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'bot', text: '추천을 준비 중입니다...' }
            ]);
        }, 1000);

        // 입력 필드 초기화
        setInput('');
    };

    // 입력 필드 변경 핸들러
    const handleInputChange = (e) => setInput(e.target.value);

    // 엔터키로 메시지 전송 기능 추가
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
            handleSearch()
        }
    };

    // 이미지 업로드 핸들러 함수 포함한 코드
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setMessages([...messages, { sender: 'user', image: imageUrl }]);
        }
    };

    const handleSearchChange = (e) => setSearchInput(e.target.value);

    // 스크롤을 최신 메시지로 자동 이동
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 검색 기능: 단어 하이라이팅 및 이동
    const handleSearch = () => {
        if (!searchInput.trim()) {
            console.log("검색어가 비어있음");
            return; // 검색어가 비어 있으면 중단
        }
    
        const regex = new RegExp(searchInput, 'i'); // 대소문자 구분 없이 검색어 포함 확인
        const index = messages.findIndex(msg => msg.text && regex.test(msg.text));
    
        console.log("검색어:", searchInput);
        console.log("검색어와 매칭된 메시지 인덱스:", index);
    
        if (index !== -1) {
            setHighlightedMessageIndex(index);
    
            // 상태가 업데이트된 후에 스크롤 이동을 실행하기 위해 setTimeout을 사용
            setTimeout(() => {
                const messageElement = document.getElementById(`message-${index}`);
                if (messageElement) {
                    console.log("스크롤 이동 실행");
                    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    console.log("메시지 요소를 찾을 수 없음");
                }
            }, 100); // 메시지가 렌더링될 시간을 기다림
        } else {
            console.log("검색어와 일치하는 메시지를 찾지 못함");
        }
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

                <div className="chat-search-bar">
                    <input
                        type="text"
                        placeholder="검색할 단어를 입력해주세요"
                        className="chat-search-input"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="chat-search-button" onClick={handleSearch}>
                        <img src="/images/search.png" alt="Search" />
                    </button>
                </div>

                <div className="chat-message-box" style={{ '--scroll-color': color }}>
                    <div className="chat-messages-container">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                id={`message-${index}`}
                                className={`chat-message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'} ${index === highlightedMessageIndex ? 'highlighted' : ''}`}
                            >
                                {msg.sender === 'bot' && (
                                    <>
                                        <img src="/images/logo-bot.png" alt="Bot Avatar" className="chat-avatar" />
                                        <div>
                                            <p className="chat-message-text">{msg.text}</p>
                                            <div className="chat-color-bar" style={{ backgroundColor: color }}></div>
                                        </div>
                                    </>
                                )}
                                {msg.sender === 'user' && (
                                    <>
                                        <p className="chat-message-text">{msg.text}</p>
                                        <div className="chat-color-circle" style={{ backgroundColor: color }}></div>
                                    </>
                                )}
                                {msg.image && <img src={msg.image} alt="User Upload" className="chat-uploaded-image" />}
                            </div>
                        ))}
                        <div ref={messageEndRef}></div>
                    </div>
                </div>

                <div className="chat-input-area" style={{ backgroundColor: color }}>
                    <label htmlFor="file-upload" className="chat-file-upload">
                        <img src="/images/image.png" alt="Upload" className="upload-icon" />
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <input
                        id='text'
                        type="text"
                        placeholder="메시지를 입력하세요"
                        className="chat-input" style={{ backgroundColor: color }}
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="chat-send-button" onClick={handleSendMessage}>➤</button>
                </div>
            </div>
        </div>
    )
}

export default Chat