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
    const [filteredMessages, setFilteredMessages] = useState([]); // 검색 결과 메시지

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
        if (!lineId) {
            console.warn('Invalid lineId provided. Returning default color.');
            return '#D9D9D9'; // 기본 색상
        }

        const filter = filters.find((f) => Number(f.id) === Number(lineId));

        return filter?.color || '#D9D9D9'; // 필터의 색상 반환
    };

    // 색상 변경 로직: 색상이 변경될 때마다 로컬 스토리지에 저장
    useEffect(() => {
        if (color) {
            localStorage.setItem('chatColor', color); // 색상을 로컬 스토리지에 저장
        }
    }, [color]);

    // 새로고침 시 초기 색상 불러오기
    useEffect(() => {
        const storedColor = localStorage.getItem('chatColor'); // 저장된 색상 불러오기
        if (storedColor) {
            setColor(storedColor); // 저장된 색상을 상태로 설정
        } else if (response?.lineId) {
            // 로컬 스토리지에 저장된 색상이 없을 경우 response.lineId 기반으로 설정
            const newColor = getColorForCategory(response.lineId, filters);
            setColor(newColor);
        }
    }, [filters]); // filters가 초기화된 이후에 실행

    // response.lineId가 변경될 때마다 색상 설정
    useEffect(() => {
        if (response?.lineId) {
            const newColor = getColorForCategory(response.lineId, filters);
            setColor(newColor);
        }
    }, [response?.lineId, filters]);

    // 로그인 상태 변경 감지 useEffect 수정
    useEffect(() => {
        console.log("로그인 상태 변경 감지:", isLoggedIn);

        if (isLoggedIn && !chatHistoryLoaded.current) {
            console.log("로그인 상태 - 히스토리 로딩 시도");
            chatHistoryLoaded.current = true;

            dispatch(fetchChatHistory())
                .then((history) => {
                    if (Array.isArray(history)) {
                        const formattedHistory = history.map((message) => {
                            const baseMessage = {
                                id: message.id || uuidv4(),
                                type: message.type || "unknown",
                                content: message.content || "",
                                lineId: message.lineId,
                                recommendations: message.recommendations || [],
                                mode: message.mode || "chat",
                            };

                            // 메시지 타입에 따라 이미지 처리를 다르게 함
                            if (message.type === "USER") {
                                return {
                                    ...baseMessage,
                                    images: message.imageUrl ? [message.imageUrl] : [],  // 사용자 메시지는 images 배열 사용
                                };
                            } else if (message.type === "AI" && message.mode === "recommendation") {
                                return {
                                    ...baseMessage,
                                    imageUrl: message.imageUrl,  // AI 추천은 imageUrl 사용
                                };
                            }

                            return baseMessage;
                        });

                        setMessages(prevMessages => {
                            const initialMessage = prevMessages[0];
                            return [initialMessage, ...formattedHistory];
                        });
                    }
                })
                .catch((error) => {
                    console.error("채팅 기록 로드 실패:", error);
                    chatHistoryLoaded.current = false;
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
        const userData = localStorage.getItem('auth');
        const isUserLoggedIn = !!userData;
        setIsLoggedIn(isUserLoggedIn);

        // 이전 채팅 기록이나 추천 여부와 관계없이
        // 초기에는 항상 기본 채팅 모드로 시작
        setChatMode("chat");

        // 로그인 모달은 실제 채팅/추천 시도할 때만 표시하도록 수정
        setShowLoginModal(false);
    }, []);

    useEffect(() => {
        // 새 메시지가 추가될 때마다 맨 아래로 스크롤
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // messages가 변경될 때마다 실행

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
            console.log("유효하지 않은 메시지입니다.");
            return;
        }

        const messageContent = message.content?.trim();
        const hasValidRecommendations = Array.isArray(message.recommendations) && message.recommendations.length > 0;

        if (!messageContent && !hasValidRecommendations && !message.imageUrl) {
            console.log("메시지 내용이나 추천 데이터나 이미지가 없습니다.");
            return;
        }

        const newMessage = {
            ...message,
            id: uuidv4(),
            content: message.Content,
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

    const handleRetry = () => {
        if (retryAvailable && messages[messages.length - 1]?.type === 'USER') {
            handleSendMessage(true);
        }
    };

    const handleSendMessage = async (isRetry = false) => {
        // 입력값이 없거나 로딩 중인 경우 처리하지 않음
        if (isLoading || (!input.trim() && selectedImages.length === 0)) return;

        // 비회원 채팅 횟수 제한
        const MAX_CHAT_COUNT = 3; // 비회원 최대 채팅 횟수

        // 추천 요청을 구분
        const isRecommendationRequest = chatMode === "recommendation";

        if (!isLoggedIn && (                     // 사용자가 로그인하지 않은 상태이고,
            hasReceivedRecommendation ||         // 이미 한번 향수 추천을 받았거나
            nonMemberChatCount >= MAX_CHAT_COUNT || // 비회원 채팅 횟수(3회)를 초과했거나
            (hasReceivedRecommendation && isRecommendationRequest) // 이미 추천받은 상태에서 또 추천을 요청할 경우
        )) {
            setShowLoginModal(true); // 위 조건 중 하나라도 해당되면 로그인 모달을 보여주고
            return;                 // 추가 진행을 중단
        }

        const userMessage = isRetry && messages[messages.length - 1]?.type === 'USER'
            ? messages[messages.length - 1]
            : {
                id: uuidv4(),
                type: 'USER',
                content: input.trim() || '',  // 빈 문자열로 기본값 설정
                images: selectedImages.map(img => img.url),
                mode: chatMode,
                retryAvailable: false
            };

        setRetryAvailable(false);
        setIsLoading(true);

        if (!isRetry) {
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setInput('');
            setSelectedImages([]);
        }

        if (!isLoggedIn) {
            setNonMemberChatCount(prevCount => prevCount + 1);
        }

        try {
            const imageFile = selectedImages.length > 0 ? selectedImages[0].file : null;
            const response = await dispatch(fetchChatResponse(input.trim() || '', imageFile));

            if (!response) {
                throw new Error('응답이 없습니다.');
            }

            if (response?.mode === "recommendation") {
                console.log("추천 처리 시작:", response.recommendations);
                const recommendationMessage = {
                    id: response.id,
                    type: "AI",
                    content: response.content,
                    recommendations: response.recommendations || [],
                    imageUrl: response.imageUrl,
                    mode: response.mode,
                    lineId: response.lineId
                };
                addMessage(recommendationMessage);

                if (response.recommendations?.length > 0) {
                    setRecommendedPerfumes(response.recommendations);
                    // filters를 인자로 전달
                    setColor(getColorForCategory(response.lineId, filters));
                }

                if (!isLoggedIn) {
                    setHasReceivedRecommendation(true);
                    localStorage.setItem('hasReceivedRecommendation', 'true');
                }
                setChatMode("chat");

            } else {
                addMessage({
                    id: uuidv4(),
                    type: 'AI',
                    content: response.content || '',
                    mode: 'chat'
                });

                setRetryAvailable(false);  // 성공 시 재시도 버튼 비활성화
            }

        } catch (error) {
            if (error.message.includes("Cannot read properties")) {
                // 색상 관련 에러는 무시하고 메시지 처리는 계속 진행
                console.warn("색상 설정 중 에러 발생:", error);
            } else {
                // 다른 에러의 경우만 재시도 옵션 제공
                console.error("채팅 응답 처리 중 오류:", error);
                setRetryAvailable(true);
                addMessage({
                    id: uuidv4(),
                    type: 'AI',
                    content: '네트워크 문제로 요청이 실패했습니다. 다시 시도해주세요.',
                    mode: 'chat'
                });
            }
        } finally {
            setIsLoading(false);
            if (messageEndRef.current) {
                messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
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
        const query = e.target.value.trim().toLowerCase();
        setSearchInput(query);

        // 검색어가 비어 있으면 검색 결과 초기화
        if (!query) {
            setFilteredMessages([]); // 검색 결과 초기화
            return;
        }

        const filtered = messages.filter((msg) =>
            typeof msg.content === 'string' && msg.content.toLowerCase().includes(query)
        );

        setFilteredMessages(filtered); // 검색된 메시지 저장
    };

    const highlightSearch = (text, query) => {
        if (typeof text !== 'string') return '';

        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    };

    const [originalMessages, setOriginalMessages] = useState([]); // 원본 메시지 저장
    /**
         * 검색 실행 함수
         * 입력된 검색어로 메시지 배열을 검색하고 결과를 하이라이트 처리
         */
    const handleSearch = () => {
        if (!searchInput?.trim()) {
            setFilteredMessages(originalMessages);
            return;
        }


        // 검색어에 해당하는 메시지들 찾기
        const matchingIndexes = messages.reduce((acc, msg, index) => {
            if (msg.content && msg.content.toLowerCase().includes(searchInput.toLowerCase())) {
                acc.push(index);
            }
            return acc;
        }, []);

        setHighlightedMessageIndexes(matchingIndexes);

        // 검색된 메시지들이 있다면 가장 마지막(최근) 메시지부터 시작
        if (matchingIndexes.length > 0) {
            const lastIndex = matchingIndexes.length - 1;
            setCurrentHighlightedIndex(lastIndex);
            scrollToMessage(matchingIndexes[lastIndex]);
        }
    };

    /**
    * 검색 상태를 초기화하는 함수
    * 검색어, 하이라이트 인덱스, 검색 모드를 모두 초기화하고
    * DOM에서 하이라이트 클래스를 제거
    */
    const clearSearch = () => {
        setSearchInput('');
        setFilteredMessages(originalMessages);
        setIsSearchMode(false);
    };

    /**
     * 특정 메시지 인덱스로 스크롤하는 함수
     * @param {number} index - 스크롤할 메시지의 인덱스
     */
    const scrollToMessage = (index) => {
        // 인덱스가 숫자가 아닌 경우 early return
        if (typeof index !== 'number') return;

        // 해당 인덱스의 메시지 요소를 찾음
        const messageElement = document.getElementById(`message-${index}`);
        if (messageElement) {
            // 부드러운 스크롤로 해당 메시지를 화면 중앙에 위치시킴
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const goToPreviousHighlight = () => {
        if (highlightedMessageIndexes.length === 0 ||
            currentHighlightedIndex === null ||
            currentHighlightedIndex === 0) { // 첫 번째 인덱스면 이전으로 못 감
            return;
        }


        const newIndex = currentHighlightedIndex - 1; // 이전(더 오래된) 메시지로 이동
        setCurrentHighlightedIndex(newIndex);
        scrollToMessage(highlightedMessageIndexes[newIndex]);
    };


    const goToNextHighlight = () => {
        if (highlightedMessageIndexes.length === 0 ||
            currentHighlightedIndex === null ||
            currentHighlightedIndex === highlightedMessageIndexes.length - 1) { // 마지막 인덱스면 다음으로 못 감
            return;
        }


        const newIndex = currentHighlightedIndex + 1; // 다음(더 최근) 메시지로 이동
        setCurrentHighlightedIndex(newIndex);
        scrollToMessage(highlightedMessageIndexes[newIndex]);
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

    // 검색 모드 토글 함수 수정
    const toggleSearchMode = () => {
        setIsSearchMode((prevMode) => {
            const newMode = !prevMode;

            // 검색 모드가 꺼질 때만 검색 상태 초기화
            if (!newMode) {
                setFilteredMessages([]); // 검색 결과 초기화
                setSearchInput(''); // 검색창 초기화
            }

            return newMode;
        });
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
        handleRetry,
    };

};
