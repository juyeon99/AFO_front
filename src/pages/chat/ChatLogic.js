import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatResponse, selectResponse, fetchChatHistory, selectChatHistory, selectChatMode, selectLoading } from "../../module/ChatModule";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 임포트
import { createScentCard } from "../../module/HistoryModule";

export const useChatLogic = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 채팅 모드 상태 관리 ("chat" 또는 "recommendation")
    const [chatMode, setChatMode] = useState("chat");
    const [recommendedPerfumes, setRecommendedPerfumes] = useState([]);
    const response = useSelector(selectResponse);

    // messages 상태 초기화
    const [messages, setMessages] = useState(() => {
        console.log("messages 초기 상태 설정");
        return [{
            id: uuidv4(),   // 고유 ID
            type: 'AI',
            content: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.',
            mode: 'chat'  // mode 추가
        }];
    });

    const [input, setInput] = useState('');
    const [selectedImages, setSelectedImages] = useState([]); //선택된 이미지 배열
    const messageEndRef = useRef(null); // 메세지 끝 부분 이동
    const [searchInput, setSearchInput] = useState('');
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
    const loading = useSelector(selectLoading);
    const [color, setColor] = useState('#D9D9D9');


    const filters = [
        { id: 1, name: 'Spicy', color: '#FF5757' },
        { id: 2, name: 'Fruity', color: '#FFBD43' },
        { id: 3, name: 'Citrus', color: '#FFE043' },
        { id: 4, name: 'Green', color: '#62D66A' },
        { id: 5, name: 'Aldehyde', color: '#98D1FF' },
        { id: 6, name: 'Aquatic', color: '#56D2FF' },
        { id: 7, name: 'Fougere', color: '#7ED3BB' },
        { id: 8, name: 'Gourmand', color: '#A1522C' },
        { id: 9, name: 'Woody', color: '#86390F' },
        { id: 10, name: 'Oriental', color: '#C061FF' },
        { id: 11, name: 'Floral', color: '#FF80C1' },
        { id: 12, name: 'Musk', color: '#F8E4FF' },
        { id: 13, name: 'Powdery', color: '#FFFFFF' },
        { id: 14, name: 'Amber', color: '#FFE8D3' },
        { id: 15, name: 'Tobacco Leather', color: '#000000' },
    ];

    // 특정 계열에 대한 색상 반환
    const getColorForCategory = (lineId, filters) => {
        // 유효성 검사를 통해 기본값 반환
        if (!lineId) {
            console.warn('Invalid lineId provided. Returning default color.');
            return '#D9D9D9'; // 기본 색상
        }

        // filters 배열에서 lineId와 일치하는 필터 검색
        const filter = filters.find((f) => Number(f.id) === Number(lineId));

        // 필터가 없으면 기본 색상 반환
        if (!filter) {
            console.warn(`No matching filter found for lineId: ${lineId}`);
            return '#D9D9D9'; // 기본 색상
        }

        return filter.color; // 필터의 색상 반환
    };

    // 로그인 상태 변경 시 작동
    useEffect(() => {
        console.log("로그인 상태 변경 감지:", isLoggedIn);

        if (isLoggedIn) {
            console.log("로그인 상태 - 히스토리 로딩 시도");
            dispatch(fetchChatHistory())
                .then((history) => {
                    console.log("받아온 히스토리:", history);
                    if (Array.isArray(history)) {
                        const formattedHistory = history
                            .filter(message => message.id && message.content) // 필수 데이터가 있는지 확인
                            .map((message) => ({
                                id: message.id || uuidv4(),
                                type: message.type || "unknown", // 기본값 제공
                                content: message.content || "(내용 없음)", // 기본값 제공
                                lineId: message.lineId,
                                recommendations: message.recommendations || [],
                                imageUrl: message.imageUrl || null,
                                mode: message.mode || "chat", // 기본값 제공
                            }));
                        // 초기 메시지와 히스토리를 결합하여 새로 설정
                        setMessages(prevMessages => {
                            const initialMessage = prevMessages[0]; // 초기 인사 메시지 보존
                            return [initialMessage, ...formattedHistory];
                        });
                    }
                })
                .catch((error) => {
                    console.error("채팅 기록 로드 실패:", error);
                });
        }
    }, [isLoggedIn, dispatch]);

    useEffect(() => {
        if (chatMode === "recommendation") {
            if (response?.error) {
                console.error("추천 데이터 처리 중 오류 발생:", response.error);
                return;
            }

            if (response?.lineId) {
                const newColor = getColorForCategory(response.lineId);
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
            console.log("추천 데이터:", response.recommendations);
            const recommendationMessage = {
                id: response.id,
                type: "AI",
                recommendations: response.recommendations || [],
                imageUrl: response.imageUrl,
                mode: response.mode,
            };
            addMessage(recommendationMessage);
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

    const addMessage = (message) => {
        if (!message?.content?.trim() && (!message.recommendations || message.recommendations.length === 0) && !message.imageUrl) {
            console.log("유효하지 않은 메시지입니다. 추가되지 않습니다.");
            return;
        }

        // 단순히 content만 사용
        const messageContent = message.content?.trim();

        if (!messageContent && !message.recommendations?.length) {
            console.log("메시지 내용이 없음");
            return;
        }

        const newMessage = {
            ...message,
            id: uuidv4(),
            content: messageContent,
            timestamp: new Date().toISOString(),
            mode: message.mode || 'chat'
        };

        setMessages(prevMessages => {
            const isDuplicate = prevMessages.some(msg =>
                msg.timestamp === newMessage.timestamp &&
                msg.type === message.type &&
                msg.content === messageContent
            );

            if (isDuplicate) {
                console.log("중복 메시지 발견:", messageContent);
                return prevMessages;
            }

            console.log("새 메시지 추가:", newMessage);
            return [...prevMessages, newMessage];
        });
    };

    const handleSendMessage = async (isRetry = false) => {
        // 입력 값 또는 이미지가 없으면 중단
        if (isLoading || (!input.trim() && selectedImages.length === 0)) {
            console.warn("입력값과 이미지가 모두 없습니다.");
            return;
        }

        // 비회원 채팅 횟수 제한
        const MAX_CHAT_COUNT = 3; // 비회원 최대 채팅 횟수

        // 추천 요청을 구분
        const isRecommendationRequest = chatMode === "recommendation";


        // 재시도 시 이전 메시지 사용
        const userMessage = isRetry && messages[messages.length - 1]?.type === 'USER'
            ? messages[messages.length - 1]
            : {
                id: uuidv4(),
                type: 'USER',
                content: input.trim() || '',
                images: selectedImages.map(img => img.url),
                retryAvailable: false,
            };

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

        // 메시지 추가
        if (!isRetry) {
            setMessages((prevMessages) => [...prevMessages, userMessage]); // 메시지 상태 업데이트
            setInput('');
            setSelectedImages([]);
        } else {
            // 재시도 시에도 `messages`가 업데이트되도록 보장
            setMessages((prevMessages) => {
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
            const response = await dispatch(fetchChatResponse(input.trim(), imageFile)).unwrap();
            console.log("서버 응답:", response);

            if (response?.error) {
                // 에러 처리
                console.error('서버 에러 발생:', response.error);
                setRetryAvailable(true); // 실패 시 재시도 버튼 표시
                addMessage({ type: 'bot', content: '추천 데이터를 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
                return;
            }

            // **이미지만 반환된 경우 처리**
            if (response.imageUrl) {
                const imageMessage = {
                    id: response.id || uuidv4(),
                    type: 'AI',
                    imageUrl: response.imageUrl,
                    content: response.content || '', // 이미지만 있을 경우 content가 없을 수 있음
                };
                addMessage(imageMessage);
            }

            setRetryAvailable(false);

            if (response?.mode === "recommendation") {
                // 추천 메시지 처리
                const recommendationMessage = {
                    id: response.id,
                    type: "AI", // ChatType.AI 사용
                    recommendations: response.recommendations || [],
                    imageUrl: response.imageUrl,
                    mode: response.mode,
                    lineId: response.lineId,
                    timeStamp: response.timeStamp
                };
                addMessage(recommendationMessage);

                // 빈 메시지 방지 조건 추가
                if (response.recommendations?.length > 0) {
                    setRecommendedPerfumes(response.recommendations);
                    setColor(getColorForCategory(response.lineId || ""));
                }

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
                    type: 'AI',
                    content: response.content,
                };

                addMessage(chatMessage);
            }

        } catch (error) {
            console.error("Error handling chat response:", error);
            setRetryAvailable(true); // 실패 시 재시도 버튼 표시

            const errorMessage = {
                id: uuidv4(), // 고유 ID 생성
                type: 'AI',
                content: '네트워크 문제로 요청이 실패했습니다. 다시 시도해주세요.', // 에러 메시지
            };

            addMessage(errorMessage);
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

    const RecommendationCard = ({ perfume, filters = [] }) => {
        if (!perfume || Object.keys(perfume).length === 0) {
            return <div className="chat-recommendation-card">추천된 향수 정보를 불러올 수 없습니다.</div>;
        }

        const lineId = perfume.lineId || null;

        if (!Array.isArray(filters) || filters.length === 0) {
            console.error("filters가 비어 있거나 배열이 아닙니다:", filters);
            return <div className="chat-recommendation-card">필터 데이터를 불러올 수 없습니다.</div>;
        }

        if (!lineId) {
            console.error("lineId를 찾을 수 없습니다. 전달된 perfume:", perfume);
            return <div className="chat-recommendation-card">lineId가 없습니다.</div>;
        }

        const filter = filters.find((filter) => Number(filter.id) === Number(lineId));
        const filterName = filter?.name || "N/A";

        if (!filter) {
            console.warn(`lineId (${lineId})에 해당하는 필터를 찾을 수 없습니다.`);
        }

        return (
            <div className="chat-recommendation-card">
                <div className="chat-recommendation-content">
                    <img className="chat-recommendation-perfume-image" src={perfume.perfumeImageUrl}></img>
                    <p className="chat-recommendation-name"><strong className="recommendation-card-context">이름 :</strong> {perfume.perfumeName || 'N/A'}</p>
                    <p className="chat-recommendation-line"><strong className="recommendation-card-context">계열 :</strong> {filterName}</p>
                    <p className="chat-recommendation-brand"><strong className="recommendation-card-context">브랜드 :</strong> {perfume.perfumeBrand || 'N/A'}</p>
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
        handleCreateScentCard,          // 향기 카드 만들기
        filters,
    };

};