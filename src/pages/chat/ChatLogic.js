import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatResponse, selectResponse, selectLoading, selectError, fetchChatHistory, selectChatHistory } from "../../module/ChatModule";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 임포트
import { createScentCard } from "../../module/HistoryModule";

export const useChatLogic = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [chatMode, setChatMode] = useState("chat");
    const [recommendedPerfumes, setRecommendedPerfumes] = useState([]);
    const response = useSelector(selectResponse);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    const [messages, setMessages] = useState([
        { sender: 'bot', text: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.' }
    ]);

    const [input, setInput] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const messageEndRef = useRef(null);
    const [searchInput, setSearchInput] = useState('');
    const [color, setColor] = useState('#D9D9D9');
    const [highlightedMessageIndexes, setHighlightedMessageIndexes] = useState([]);
    const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState(null);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
    const [hasReceivedRecommendation, setHasReceivedRecommendation] = useState(false); // 추천 여부
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [retryAvailable, setRetryAvailable] = useState(false);
    const [nonMemberChatCount, setNonMemberChatCount] = useState(0);
    const chatHistory = useSelector(selectChatHistory);
    const chatHistoryLoaded = useRef(false); // 기록 불러오기 여부
    const [initialMessages, setInitialMessages] = useState([]); // 초기 메시지 상태
    const [chatMessages, setChatMessages] = useState([]); // 실시간 추가 메시지 상태

    const filters = [
        { name: 'Spicy', color: '#FF5757' },
        { name: 'Fruity', color: '#FFBD43' },
        { name: 'Citrus', color: '#FFE043' },
        { name: 'Green', color: '#62D66A' },
        { name: 'Floral', color: '#FF80C1' },
        { name: 'Oriental', color: '#C061FF' },
        { name: 'Musk', color: '#F8E4FF' },
        { name: 'Powdery', color: '#FFFFFF' },
        { name: 'Tobacco Leather', color: '#000000' },
        { name: 'Fougere', color: '#7ED3BB' },
        { name: 'Gourmand', color: '#A1522C' },
        { name: 'Woody', color: '#86390F' },
        { name: 'Aldehyde', color: '#98D1FF' },
        { name: 'Aquatic', color: '#56D2FF' },
        { name: 'Amber', color: '#FFE8D3' },
    ];

    // 특정 계열에 대한 색상 반환
    const getColorForCategory = (lineOrFeeling) => {
        const categories = lineOrFeeling.split(/[-/]/).map(c => c.trim());
        const colors = categories
            .map(c => {
                const filter = filters.find(f => f.name.toLowerCase() === c.toLowerCase());
                return filter ? filter.color : null;
            })
            .filter(Boolean);

        if (colors.length === 1) return colors[0]; // 단일 계열
        if (colors.length > 1) return `linear-gradient(90deg, ${colors.join(', ')})`; // 다중 계열
        return '#D9D9D9'; // 기본 색상
    };

    // 로그인 후 최초 한 번만 채팅 기록 불러오기
    useEffect(() => {
        if (isLoggedIn && !chatHistoryLoaded.current) {
            dispatch(fetchChatHistory())
                .then(() => {
                    chatHistoryLoaded.current = true; // 기록 불러온 후 상태 업데이트
                })
                .catch((error) => {
                    console.error("채팅 기록을 불러오는 중 오류 발생:", error);
                });
        }
    }, [isLoggedIn, dispatch]);

    // 채팅 기록 업데이트 (initialMessages 설정)
    useEffect(() => {
        if (chatHistory && chatHistory.length > 0) {
            const initialBotMessage = {
                id: 'initial-bot-message',
                sender: 'bot',
                text: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.', // 초기 메시지
            };

            const formattedMessages = chatHistory.map((message) => ({
                sender: message.type === "USER" ? "user" : "bot",
                text: message.messageText || "",
                id: message.id || null,
                recommendations: message.recommendations || [],
                generatedImage: message.chatImage || null,
            }));

            setInitialMessages([initialBotMessage, ...formattedMessages]);
        } else {
            console.error("chatHistory가 배열이 아닙니다:", chatHistory);
            setInitialMessages([
                {
                    id: 'initial-bot-message',
                    sender: 'bot',
                    text: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.', // 초기 메시지
                },
            ]);
        }
    }, [chatHistory]);

    // 비로그인 상태 처리
    useEffect(() => {
        if (!isLoggedIn) {
            // 비로그인 상태에서 기본 메시지만 표시
            setInitialMessages([{ id: uuidv4(), sender: "bot", text: "안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다." }]);
            chatHistoryLoaded.current = false; // 다시 기록을 불러올 수 있도록 설정
        }
    }, [isLoggedIn]);

    // 향수 추천 데이터 처리
    useEffect(() => {
        if (chatMode === "recommendation") {
            if (response?.error) {
                console.error("추천 데이터 처리 중 오류 발생:", response.error);
                return;
            }

            if (response?.commonFeeling) {
                const newColor = getColorForCategory(response.commonFeeling);
                console.log("새로운 색상 설정:", newColor);
                setColor(newColor);
            }

            // recommendedPerfumes를 조건부로 업데이트
            if (Array.isArray(response?.recommendedPerfumes?.recommendations)) {
                setRecommendedPerfumes((prevPerfumes) => {
                    // 상태가 이전 값과 동일한 경우 업데이트하지 않음 (무한 루프 방지)
                    if (JSON.stringify(prevPerfumes) !== JSON.stringify(response.recommendedPerfumes.recommendations)) {
                        return response.recommendedPerfumes.recommendations;
                    }
                    return prevPerfumes; // 동일하면 이전 상태 유지
                });
            } else {
                setRecommendedPerfumes([]); // 데이터가 없으면 빈 배열로 설정
            }
        } else if (chatMode === "chat") {
            setColor('#D9D9D9'); // 일반 대화 기본 색상
        }
    }, [chatMode, response]); // 의존성 배열에 불필요한 상태 추가하지 않음

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, []);

    useEffect(() => {
        console.log("hasReceivedRecommendation 상태:", hasReceivedRecommendation);

        // 비회원 여부 확인
        const userData = localStorage.getItem('auth'); // 로컬스토리지에서 사용자 정보 가져오기
        const isUserLoggedIn = !!userData;
        const hasRecommendation = localStorage.getItem('hasReceivedRecommendation') === 'true';

        setIsLoggedIn(isUserLoggedIn); // 로그인 상태 업데이트
        setHasReceivedRecommendation(hasRecommendation); // 추천 상태 복원
        console.log("로그인 상태:", isUserLoggedIn);

        // 비회원이고 추천을 받은 경우 로그인 모달 표시
        if (!isUserLoggedIn && hasRecommendation) {
            setShowLoginModal(true);
            setChatMode("recommendation"); // 추천 모드 유지
        } else {
            setChatMode("chat"); // 기본 모드는 chat
        }
    }, []);

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

    useEffect(() => {
        console.log("Chat Mode has changed:", chatMode);
    }, [chatMode]);

    useEffect(() => {
        if (chatMode === "recommendation" && response) {
            // 추천 데이터 처리
            const recommendations = response.recommendations || [];
            const recommendationMessage = {
                sender: "bot",
                text: "향수 추천 결과를 확인하세요.",
                recommendations,
                generatedImage: response.generatedImage?.s3_url || null, // 이미지 URL 추가
            };

            if (recommendationMessage.text && recommendations.length > 0) {
                addMessage(recommendationMessage);
            }
        }
    }, [chatMode, response]);

    useEffect(() => {
        const savedCount = parseInt(localStorage.getItem('nonMemberChatCount'), 10);
        if (!isNaN(savedCount)) {
            setNonMemberChatCount(savedCount);
        }
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem('nonMemberChatCount', nonMemberChatCount.toString());
        }
    }, [nonMemberChatCount, isLoggedIn]);

    const isDarkColor = (color) => {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    };

    const filteredMessages = useMemo(() => {
        const seenIds = new Set();
        const combinedMessages = [
            ...(initialMessages || []),  // 초기 메시지 포함
            ...(chatMessages || [])      // 채팅 메시지 포함
        ].filter(message => {
            // 기본적인 메시지 유효성 검사
            const isValidMessage = message && (
                (message.text && message.text.trim()) ||
                (message.recommendations && message.recommendations.length > 0)
            );

            // 중복 체크 및 유효성 검사를 동시에 수행
            if (!isValidMessage || seenIds.has(message.id)) {
                return false;
            }

            seenIds.add(message.id);
            return true;
        });

        console.log("필터링된 메시지:", combinedMessages);
        return combinedMessages;
    }, [initialMessages, chatMessages]);

    useEffect(() => {
        if (filteredMessages.length > 0 && messageEndRef.current) {
            console.log("Scrolling to the latest message...");
            messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [filteredMessages]);

    const addMessage = (message) => {
        if (!message?.text?.trim() && (!message.recommendations || message.recommendations.length === 0)) {
            return; // 빈 메시지나 추천 없는 메시지 무시
        }

        const newMessage = { ...message, id: message.id || uuidv4() };

        setChatMessages((prevMessages) => {
            if (!Array.isArray(prevMessages)) {
                console.error("chatMessages가 배열이 아님:", prevMessages);
                return []; // 안전하게 빈 배열로 초기화
            }
            if (prevMessages.some((msg) => msg.id === newMessage.id)) {
                console.log("중복 메시지:", newMessage);
                return prevMessages; // 중복 메시지 무시
            }
            return [...prevMessages, newMessage];
        });
    };

    const handleSendMessage = async (isRetry = false) => {
        if (isLoading) return; // 중복 요청 방지
        if (!input.trim() && selectedImages.length === 0 && !isRetry) return;

        // 비회원 채팅 횟수 제한
        const MAX_CHAT_COUNT = 3; // 비회원 최대 채팅 횟수

        // 추천 요청을 구분
        const isRecommendationRequest = chatMode === "recommendation";

        if (!isLoggedIn && hasReceivedRecommendation) {
            setShowLoginModal(true); // 추천 받은 비회원은 즉시 로그인 모달 표시
            return;
        }

        // 비회원이고 이미 추천을 받은 경우 로그인 모달 표시
        if (
            (!isLoggedIn && hasReceivedRecommendation && isRecommendationRequest) ||
            (!isLoggedIn && nonMemberChatCount >= MAX_CHAT_COUNT)
        ) {
            setShowLoginModal(true); // 로그인 모달 표시
            return; // 함수 종료
        }

        setRetryAvailable(false);
        setIsLoading(true);

        // 재시도 시 이전 메시지 사용
        const userMessage = isRetry && chatMessages[chatMessages.length - 1]?.sender === 'user'
            ? chatMessages[chatMessages.length - 1]
            : {
                id: uuidv4(),
                sender: 'user',
                text: input.trim() || '',
                images: selectedImages.map(img => img.url),
                retryAvailable: false,
            };

        if (!isRetry) {
            setChatMessages((prevMessages) => [...prevMessages, userMessage]);
            setInput('');
            setSelectedImages([]);
        } else {
            // 재시도 시에도 `messages`가 업데이트되도록 보장
            setChatMessages((prevMessages) => {
                const updatedMessages = prevMessages.map((msg) =>
                    msg.id === userMessage.id ? userMessage : msg // ID 매칭 시 업데이트
                );
                return updatedMessages;
            });
        }

        // 비회원 채팅 횟수 증가
        if (!isLoggedIn) {
            setNonMemberChatCount((prevCount) => prevCount + 1);
        }

        const imageFile = selectedImages.length > 0 ? selectedImages[0].file : null;

        try {
            console.log("재요청 중입니다:", isRetry);
            // API 호출
            const response = await dispatch(fetchChatResponse(userMessage.text, imageFile));
            console.log("서버 응답:", response);

            if (response?.error) {
                // 에러 처리
                console.error('서버 에러 발생:', response.error);
                setRetryAvailable(true); // 실패 시 재시도 버튼 표시
                addMessage({ sender: 'bot', text: '추천 데이터를 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
                return;
            }

            setRetryAvailable(false);

            if (response?.mode === "recommendation") {
                const recommendations = response.recommendations || [];
                // 추천 메시지 처리
                const recommendationMessage = {
                    id: uuidv4(),
                    sender: 'bot',
                    text: '향수 추천 결과를 확인하세요.',
                    recommendations,
                    generatedImage: response.generatedImage.s3_url,
                };

                // 빈 메시지 방지 조건 추가
                if (recommendationMessage.text && recommendations.length > 0) {
                    addMessage(recommendationMessage);
                    setRecommendedPerfumes(recommendations);
                    setColor(getColorForCategory(response.commonFeeling || ''));
                }

                // 추천 상태 및 색상 설정
                setRecommendedPerfumes(recommendations);
                setColor(getColorForCategory(response.commonFeeling || ''));

                // 비회원이 추천을 받은 경우 상태 업데이트
                if (!isLoggedIn) {
                    setHasReceivedRecommendation(true);
                    localStorage.setItem('hasReceivedRecommendation', 'true');
                }
                setChatMode("chat");

            } else if (response?.mode === "chat") {
                // 일반 메시지 처리
                const chatMessage = {
                    id: uuidv4(),
                    sender: 'bot',
                    text: response.response?.trim(),
                };

                if (chatMessage.text) {
                    addMessage(chatMessage); // 빈 메시지 방지
                }

                setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
            }

        } catch (error) {
            console.error("Error handling chat response:", error);
            setRetryAvailable(true); // 실패 시 재시도 버튼 표시

            const errorMessage = {
                id: uuidv4(), // 고유 ID 생성
                sender: 'bot',
                text: '네트워크 문제로 요청이 실패했습니다. 다시 시도해주세요.', // 에러 메시지
            };

            setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
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

    const handleInputChange = (e) => setInput(e.target.value);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
            handleSearch();
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // 첫 번째 파일만 가져옴
        if (file) {
            const newImage = {
                url: URL.createObjectURL(file),
                file: file
            };
            setSelectedImages([newImage]); // 새 이미지를 기존 이미지 대신 대체
        }
        e.target.value = ''; // 파일 입력 초기화
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

    const toggleSearchMode = () => {
        setIsSearchMode((prevMode) => !prevMode);
    };

    const handleGoBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    const RecommendationCard = ({ perfume }) => {
        if (!perfume || Object.keys(perfume).length === 0) {
            return <div className="chat-recommendation-card">추천된 향수 정보를 불러올 수 없습니다.</div>;
        }

        return (
            <div className="chat-recommendation-card">
                <div className="chat-recommendation-content">
                    <p className="chat-recommendation-name"><strong className="recommendation-card-context">이름 :</strong> {perfume.name || 'N/A'}</p>
                    <p className="chat-recommendation-line"><strong className="recommendation-card-context">계열 :</strong> {perfume.line || 'N/A'}</p>
                    <p className="chat-recommendation-brand"><strong className="recommendation-card-context">브랜드 :</strong> {perfume.brand || 'N/A'}</p>
                    <p className="chat-recommendation-reason"><strong className="recommendation-card-context">추천 이유 :</strong> {perfume.reason || 'N/A'}</p>
                    <p className="chat-recommendation-situation"><strong className="recommendation-card-context">추천 상황 :</strong> {perfume.situation || 'N/A'}</p>
                </div>
            </div>
        );
    };

    const handleCreateScentCard = async (chatId) => {
        try {
            const cardData = await dispatch(createScentCard(chatId)); // 향기 카드 생성 요청
            console.log("향기 카드 생성 성공:", cardData);

            navigate('/history', {
                state: {
                    recommendations: cardData.recommendations, // 추천 데이터 전달
                },
            });
        } catch (error) {
            console.error("향기 카드 생성 실패:", error);
        }
    };

    return {
        chatMode,                       // 현재 채팅 모드
        response,                       // 응답 데이터
        loading,                        // 로딩 상태
        error,                          // 에러 상태
        recommendedPerfumes,            //  추천된 향수 배열
        messages,                       // 채팅 메세지 배열
        setMessages,
        input,                          // 사용자 입력 값
        setInput,
        selectedImages,                 // 사용자가 업로드한 이미지 배열
        setSelectedImages,
        searchInput,                    // 검색 입력 값
        setSearchInput,
        color,                          // 현재 색상
        setColor,
        isDarkColor,                    // 현재 색상 어두운지 여부
        highlightedMessageIndexes,      // 검색된 메세지 인덱스 배열
        setHighlightedMessageIndexes,
        currentHighlightedIndex,        // 현재 하이라이트 메세지 인덱스
        setCurrentHighlightedIndex,
        isSearchMode,                   // 검색 모드 활성화 여부
        setIsSearchMode,
        modalImage,                     // 모달에 표시할 이미지 URL
        setModalImage,
        isModalOpen,                    // 모달 열림 상태
        setIsModalOpen,
        fileInputRef,                   // 이미지 업로드 파일
        isLoading,
        setIsLoading,
        isLoggedIn,                     // 로그인 여부
        setIsLoggedIn,
        hasReceivedRecommendation,      // 추천 결과 받은지 여부
        setHasReceivedRecommendation,
        showLoginModal,                 // 비회원 로그인 모달 표시
        setShowLoginModal,
        retryAvailable,                 // 재시도 버튼 활성화
        setRetryAvailable,
        messageEndRef,                  // 채팅 창 끝 부분 스크롤
        getColorForCategory,            // 특정 카테고리 색상 변경
        handleSendMessage,              // 사용자 메세지 전송 처리
        handlePaste,                    // 붙여넣기
        handleInputChange,              // 사용자 입력 값 변경
        handleKeyPress,                 // 키보드 입력
        handleImageUpload,              // 이미지 업로드 처리
        handleRemoveImage,              // 업로드 이미지 삭제
        openModal,                      // 이미지 모달
        closeModal,
        handleSearchChange,             // 검색 입력 값 변경
        highlightSearch,                // 검색 단어 하이라이트
        handleSearch,                   // 검색 실행
        clearSearch,                    // 검색 초기화
        scrollToMessage,                // 특정 메세지 스크롤
        goToPreviousHighlight,          // 이전 하이라이트 이동
        goToNextHighlight,              // 다음 하이라이트 이동
        toggleSearchMode,               // 검색 모드 
        handleGoBack,                   // 뒤로 가기
        RecommendationCard,             // 추천 카드 렌더링
        navigate,
        filteredMessages,
        handleCreateScentCard,          // 향기 카드 만들기
    };

};