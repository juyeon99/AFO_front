export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nonMemberChatCount, setNonMemberChatCount] = useState(0);
    
    useEffect(() => {
        const userData = localStorage.getItem('auth');
        setIsLoggedIn(!!userData);
        
        const savedCount = parseInt(localStorage.getItem('nonMemberChatCount'), 10);
        if (!isNaN(savedCount)) {
            setNonMemberChatCount(savedCount);
        }
    }, []);

    return {
        isLoggedIn,
        setIsLoggedIn,
        nonMemberChatCount,
        setNonMemberChatCount
    };
};
