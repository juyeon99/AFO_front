import { useState, useCallback } from 'react';

/**
 * 검색 기능을 위한 커스텀 훅
 */
export const useSearch = (messages) => {
    const [searchInput, setSearchInput] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [highlightedMessageIndexes, setHighlightedMessageIndexes] = useState([]);
    const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState(null);
    const [isSearchMode, setIsSearchMode] = useState(false);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase().trim();
        setSearchInput(query);
        
        if (!query) {
            setFilteredMessages([]);
            return;
        }

        const filtered = messages.filter(msg => 
            typeof msg.content === 'string' && 
            msg.content.toLowerCase().includes(query)
        );
        setFilteredMessages(filtered);
    };

    const handleSearch = () => {
        if (!searchInput) return;

        const matchingIndexes = messages.reduce((acc, msg, index) => {
            if (msg.content?.toLowerCase().includes(searchInput.toLowerCase())) {
                acc.push(index);
            }
            return acc;
        }, []);

        setHighlightedMessageIndexes(matchingIndexes);
        if (matchingIndexes.length > 0) {
            setCurrentHighlightedIndex(matchingIndexes.length - 1);
        }
    };

    const clearSearch = () => {
        setSearchInput('');
        setFilteredMessages([]);
        setIsSearchMode(false);
        setHighlightedMessageIndexes([]);
        setCurrentHighlightedIndex(null);
    };

    const toggleSearchMode = () => {
        setIsSearchMode(prev => !prev);
    };

    return {
        searchProps: {
            controls: {
                searchInput,
                setSearchInput,
                handleSearchChange,
                handleSearch,
                clearSearch,
                isSearchMode,
                toggleSearchMode
            },
            highlighting: {
                highlightedMessageIndexes,
                currentHighlightedIndex,
                filteredMessages
            }
        }
    };
};
