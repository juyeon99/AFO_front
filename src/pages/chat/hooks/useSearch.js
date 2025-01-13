import { useState, useCallback } from 'react';

/**
 * 검색 기능을 위한 커스텀 훅
 */
export const useSearch = (messages) => {
    const [searchInput, setSearchInput] = useState('');
    const [highlightedIndexes, setHighlightedIndexes] = useState([]);
    const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);

    const handleSearch = useCallback(() => {
        if (!searchInput) return;

        const newHighlightedIndexes = messages
            .map((msg, index) => msg.content?.includes(searchInput) ? index : -1)
            .filter(index => index !== -1);

        setHighlightedIndexes(newHighlightedIndexes);
        setCurrentHighlightIndex(0);
    }, [searchInput, messages]);

    const clearSearch = useCallback(() => {
        setSearchInput('');
        setHighlightedIndexes([]);
        setCurrentHighlightIndex(0);
    }, []);

    return {
        searchProps: {
            controls: {
                searchInput,
                setSearchInput,
                handleSearch,
                clearSearch
            },
            highlighting: {
                highlightedIndexes,
                currentHighlightIndex
            }
        }
    };
};
