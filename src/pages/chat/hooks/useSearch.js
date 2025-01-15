import { useState } from 'react';

/**
 * 채팅 내용을 검색하는 Hook
 * 
 * 이 Hook으로 할 수 있는 것들:
 * 1. 채팅 내용에서 원하는 단어 찾기
 * 2. 검색된 메시지 강조 표시하기
 * 3. 검색 결과 사이를 위아래로 이동하기
 */
export const useSearch = (messages) => {
    const [searchInput, setSearchInput] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [highlightedMessageIndexes, setHighlightedMessageIndexes] = useState([]);
    const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState(null);
    const [isSearchMode, setIsSearchMode] = useState(false);

    // 검색 실행
    const handleSearch = () => {
        if (!searchInput.trim()) {
            setHighlightedMessageIndexes([]);
            setCurrentHighlightedIndex(null);
            setIsSearchMode(false);
            return;
        }

        setIsSearchMode(true);

        // 메시지 내용에서 검색어 찾기
        const matchingIndexes = messages.filter(msg => msg.content)  // content가 있는 메시지만 필터링
            .reduce((acc, msg, index) => {
                const content = msg.content.toLowerCase();
                const searchTerm = searchInput.toLowerCase();

                if (content.includes(searchTerm)) {
                    acc.push(index);
                }
                return acc;
            }, []);

        setHighlightedMessageIndexes(matchingIndexes);
        setCurrentHighlightedIndex(matchingIndexes.length > 0 ? 0 : null);
    };

    // 이전 검색 결과로 이동
    const goToPreviousHighlight = () => {
        if (currentHighlightedIndex > 0) {
            setCurrentHighlightedIndex(prev => prev - 1);
        }
    };

    // 다음 검색 결과로 이동
    const goToNextHighlight = () => {
        if (currentHighlightedIndex < highlightedMessageIndexes.length - 1) {
            setCurrentHighlightedIndex(prev => prev + 1);
        }
    };

    // 검색 초기화
    const clearSearch = () => {
        setSearchInput('');
        setFilteredMessages([]);
        setHighlightedMessageIndexes([]);
        setCurrentHighlightedIndex(null);
        setIsSearchMode(false);
    };

    return {
        searchInput,
        setSearchInput,
        handleSearch,
        goToPreviousHighlight,
        goToNextHighlight,
        clearSearch,
        currentHighlightedIndex,
        highlightedMessageIndexes,
        isSearchMode
    };
};