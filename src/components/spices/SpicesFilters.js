import React from 'react';
import { Search } from 'lucide-react';
import styles from '../../css/spices/SpicesFilters.module.css';
import line_ from '../../data/line_.json';

const SpicesFilters = ({ searchTerm, setSearchTerm, activeFilters, setActiveFilters }) => {
    const filterButtons = [
        { name: 'ALL', color: '#EFEDED' },
        ...line_.map(line => ({
            name: line.name,
            color: `#${line.color}`,
            description: line.description,
            content: line.content
        }))
    ];

    const getTextColor = (backgroundColor) => {
        const hex = backgroundColor.replace('#', '');
        const brightness = 
            parseInt(hex.slice(0, 2), 16) * 0.299 +
            parseInt(hex.slice(2, 4), 16) * 0.587 +
            parseInt(hex.slice(4, 6), 16) * 0.114;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    const handleFilterClick = (filterName) => {
        setActiveFilters(prev => {
            if (filterName === 'ALL') {
                if (prev.length === filterButtons.length - 1) {
                    return [];
                } else {
                    return filterButtons
                        .filter(filter => filter.name !== 'ALL')
                        .map(filter => filter.name);
                }
            }

            let newFilters;
            if (prev.includes(filterName)) {
                newFilters = prev.filter(name => name !== filterName);
            } else {
                newFilters = [...prev, filterName];
            }

            if (newFilters.length === filterButtons.length - 1) {
                return ['ALL', ...newFilters];
            }
            return newFilters;
        });
    };

    return (
        <div className={styles.filters}>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="향료 이름, 계열 검색 가능"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className={styles.searchIcon} size={20} color="#333" />
            </div>
            
            <div className={styles.filterButtons}>
                {filterButtons.map((filter) => (
                    <button
                        key={filter.name}
                        className={`${styles.filterButton} ${
                            activeFilters.includes(filter.name) ? styles.active : ''
                        }`}
                        style={{
                            backgroundColor: activeFilters.includes(filter.name) 
                                ? filter.color 
                                : '#EFEDED',
                            color: getTextColor(activeFilters.includes(filter.name) 
                                ? filter.color 
                                : '#EFEDED'),
                            borderColor: 'black',
                        }}
                        onClick={() => handleFilterClick(filter.name)}
                        title={filter.description}
                    >
                        {filter.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SpicesFilters;