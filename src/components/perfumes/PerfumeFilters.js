import React from 'react';
import { Trash2 } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeFilters.module.css';

const PerfumeFilters = ({
    activeFilters,
    handleFilterClick,
    role,
    handleAddButtonClick,
    handleCheckboxToggle,
    selectedPerfume,      // selectedPerfume을 prop으로 받음
    setSelectedPerfume,   // setSelectedPerfume을 prop으로 받음
    handleDeleteButtonClick  // handleDeleteButtonClick을 prop으로 받음
}) => {
    const filterButtons = [
        { id: '오 드 퍼퓸', label: 'Eau de Perfume' },
        { id: '오 드 뚜왈렛', label: 'Eau de Toilette' },
        { id: '오 드 코롱', label: 'Eau de Cologne' },
        { id: '퍼퓸', label: 'Perfume' },
        { id: '솔리드 퍼퓸', label: 'Solid Perfume' }
    ];

    return (
        <div className={styles.filtersContainer}>
            {filterButtons.map(button => (
                <button
                    key={button.id}
                    className={`${styles.filterButton} ${activeFilters.includes(button.id) ? styles.active : ''}`}
                    onClick={() => handleFilterClick(button.id)}
                >
                    {button.label}
                </button>
            ))}
            {role === 'ADMIN' && (
                <div className={styles.adminControls}>
                    <button className={styles.addButton} onClick={handleAddButtonClick}>+</button>
                    <button className={styles.checkboxButton} onClick={handleCheckboxToggle}>✓</button>
                    <button
                        onClick={() => handleDeleteButtonClick(selectedPerfume)}
                        className={styles.deleteButton}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PerfumeFilters;
