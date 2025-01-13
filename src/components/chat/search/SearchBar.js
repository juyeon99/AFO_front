import React from 'react';
import styles from '../../../css/modules/SearchBar.module.css';

const SearchBar = ({
    searchInput,
    handleSearchChange,
    handleSearch,
    goToPreviousHighlight,
    goToNextHighlight,
    clearSearch,
    currentHighlightedIndex,
    highlightedMessageIndexes
}) => {
    return (
        <div className={`${styles.searchBar} ${searchInput ? styles.searchActive : styles.searchInactive}`}>
            <input
                type="text"
                placeholder="검색할 단어를 입력해주세요"
                className={styles.searchInput}
                value={searchInput}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
                <img
                    src={process.env.PUBLIC_URL + '/images/search.png'}
                    alt="Search"
                    className={styles.searchIcon}
                />
            </button>
            {searchInput && (
                <>
                    <button
                        className={styles.arrowButton}
                        onClick={goToPreviousHighlight}
                        disabled={currentHighlightedIndex === 0}
                    >
                        ▲
                    </button>
                    <button
                        className={styles.arrowButton}
                        onClick={goToNextHighlight}
                        disabled={currentHighlightedIndex === highlightedMessageIndexes.length - 1}
                    >
                        ▼
                    </button>
                    <button
                        className={styles.clearSearchButton}
                        onClick={clearSearch}
                    >
                        X
                    </button>
                </>
            )}
        </div>
    );
};

export default SearchBar;