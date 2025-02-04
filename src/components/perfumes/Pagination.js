import React from 'react';
import styles from '../../css/perfumes/PerfumePagination.module.css';

const PerfumePagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationGroup = Math.floor((currentPage - 1) / 10);
    const pageStart = paginationGroup * 10 + 1;
    const pageEnd = Math.min((paginationGroup + 1) * 10, totalPages);

    const handlePreviousGroup = () => {
        if (paginationGroup > 0) {
            onPageChange(paginationGroup * 10);
        }
    };

    const handleNextGroup = () => {
        if ((paginationGroup + 1) * 10 < totalPages) {
            onPageChange((paginationGroup + 1) * 10 + 1);
        }
    };

    return (
        <div className={styles.pagination}>
            <button
                className={`${styles.pageButton} ${paginationGroup === 0 ? styles.disabled : ''}`}
                onClick={handlePreviousGroup}
                disabled={paginationGroup === 0}
            >
                {'<<'}
            </button>

            <button
                className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {'<'}
            </button>

            {Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => (
                <button
                    key={index + pageStart}
                    className={`${styles.pageButton} ${currentPage === index + pageStart ? styles.active : ''}`}
                    onClick={() => onPageChange(index + pageStart)}
                >
                    {index + pageStart}
                </button>
            ))}

            <button
                className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {'>'}
            </button>

            <button
                className={`${styles.pageButton} ${pageEnd === totalPages ? styles.disabled : ''}`}
                onClick={handleNextGroup}
                disabled={pageEnd === totalPages}
            >
                {'>>'}
            </button>
        </div>
    );
};

export default PerfumePagination;