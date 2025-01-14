export const useChatHistory = () => {
    const dispatch = useDispatch();
    const chatHistory = useSelector(selectChatHistory);
    const chatHistoryLoaded = useRef(false);

    const loadChatHistory = async () => {
        if (!chatHistoryLoaded.current) {
            chatHistoryLoaded.current = true;
            try {
                await dispatch(fetchChatHistory());
            } catch (error) {
                console.error("채팅 기록 로드 실패:", error);
                chatHistoryLoaded.current = false;
            }
        }
    };

    return {
        chatHistory,
        loadChatHistory
    };
};
