import React from 'react';
import styles from '../../css/perfumes/PerfumeFilters.module.css';

/**
 * 향수 필터링 컴포넌트
 * @param {array} activeFilters - 활성화된 필터 배열
 * @param {function} setActiveFilters - 필터 설정 함수
 */
const PerfumeFilters = ({ activeFilters, setActiveFilters }) => {
        // 필터 버튼 데이터 구성
        const filterButtons = [
            { name: 'ALL' },
            { name: 'EAU DE PARFUM' },
            { name: 'EAU DE TOILETTE' },
            { name: 'PERFUME' },
            { name: 'COLOGNE' }
        ];
    
    // 필터 버튼 클릭 핸들러
    const handleFilterClick = (filterName) => {
        setActiveFilters(prev => {
            // ALL 필터 클릭 시
            if (filterName === 'ALL') {
                return ['ALL'];
            }

            // 다른 필터 클릭 시 ALL 제거
            let newFilters = prev.filter(f => f !== 'ALL');

            // 이미 선택된 필터면 제거, 아니면 추가
            if (newFilters.includes(filterName)) {
                newFilters = newFilters.filter(f => f !== filterName);
            } else {
                newFilters = [...prev, filterName];
            }

            // 모든 필터가 선택되면 ALL도 포함
            if (newFilters.length === filterButtons.length - 1) {
                return ['ALL', ...newFilters];
            }
            return newFilters;
        });
    };

    return (
        <div className={styles.filters}>
            <div className={styles.filterButtons}>
                {filterButtons.map((filter) => (
                    <button
                        key={filter.name}
                        className={`${styles.filterButton} ${
                            activeFilters.includes(filter.name) ? styles.active : ''
                        }`}
                        onClick={() => handleFilterClick(filter.name)}
                    >
                        {filter.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PerfumeFilters;