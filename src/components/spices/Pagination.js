import React from 'react';
import styles from '../../css/spices/SpicesPagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                {'<<'}
            </button>
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {'<'}
            </button>
            
            {pageNumbers.map(number => (
                <button
                    key={number}
                    className={`${styles.pageButton} ${
                        currentPage === number ? styles.active : ''
                    }`}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}
            
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {'>'}
            </button>
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                {'>>'}
            </button>
        </div>
    );
};

export default Pagination;