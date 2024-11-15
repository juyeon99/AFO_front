import '../../css/pages/perfumedatabase/PerfumeDatabase.css';
import React, { useState } from 'react';

const PerfumeDatabase = () => {
    // 임시 데이터
    const tempPerfumes = [
        {
            id: 1,
            imageUrl: '/images/chanel-orange.jpg',
            brandEn: 'CHANEL',
            brandKr: '샤넬',
            name: 'N°5 EDP',
            concentration: '뿌리오 드 퍼퓸'
        },
        {
            id: 2,
            imageUrl: '/images/chanel-white.jpg',
            brandEn: 'CHANEL',
            brandKr: '샤넬',
            name: 'N°5 EDP',
            concentration: '뿌리오 드 퍼퓸'
        },
        {
            id: 3,
            imageUrl: '/images/chanel-cream.jpg',
            brandEn: 'CHANEL',
            brandKr: '샤넬',
            name: 'N°5 EDP',
            concentration: '뿌리오 드 퍼퓸'
        },
        {
            id: 4,
            imageUrl: '/images/chanel-blue.jpg',
            brandEn: 'CHANEL',
            brandKr: '샤넬',
            name: 'N°5 EDP',
            concentration: '뿌리오 드 퍼퓸'
        },
        {
            id: 5,
            imageUrl: '/images/chanel-black.jpg',
            brandEn: 'CHANEL',
            brandKr: '샤넬',
            name: 'N°5 EDP',
            concentration: '뿌리오 드 퍼퓸'
        },
        {
            id: 6,
            imageUrl: '/images/chanel-orange2.jpg',
            brandEn: 'CHANEL',
            brandKr: '샤넬',
            name: 'N°5 EDP',
            concentration: '뿌리오 드 퍼퓸'
        },
        {
            id: 7,
            imageUrl: '/images/dior-pink.jpg',
            brandEn: 'DIOR',
            brandKr: '디올',
            name: 'MISS DIOR BLOOMING BOUQUET EDT',
            concentration: '미스 디올 블루밍 뿌리오 드 뚜왈렛'
        },
        {
            id: 8,
            imageUrl: '/images/dior-pink.jpg',
            brandEn: 'DIOR',
            brandKr: '디올',
            name: 'MISS DIOR BLOOMING BOUQUET EDT',
            concentration: '미스 디올 블루밍 뿌리오 드 뚜왈렛'
        },
        {
            id: 9,
            imageUrl: '/images/dior-pink.jpg',
            brandEn: 'DIOR',
            brandKr: '디올',
            name: 'MISS DIOR BLOOMING BOUQUET EDT',
            concentration: '미스 디올 블루밍 뿌리오 드 뚜왈렛'
        },
        {
            id: 10,
            imageUrl: '/images/dior-pink.jpg',
            brandEn: 'DIOR',
            brandKr: '디올',
            name: 'MISS DIOR BLOOMING BOUQUET EDT',
            concentration: '미스 디올 블루밍 뿌리오 드 뚜왈렛'
        },
        {
            id: 11,
            imageUrl: '/images/dior-pink.jpg',
            brandEn: 'DIOR',
            brandKr: '디올',
            name: 'MISS DIOR BLOOMING BOUQUET EDT',
            concentration: '미스 디올 블루밍 뿌리오 드 뚜왈렛'
        },
        {
            id: 12,
            imageUrl: '/images/dior-pink.jpg',
            brandEn: 'DIOR',
            brandKr: '디올',
            name: 'MISS DIOR BLOOMING BOUQUET EDT',
            concentration: '미스 디올 블루밍 뿌리오 드 뚜왈렛'
        },
        {
            id: 13,
            imageUrl: '/images/dior-pink.jpg',
            brandEn: 'DIOR',
            brandKr: '디올',
            name: 'MISS DIOR BLOOMING BOUQUET EDT',
            concentration: '미스 디올 블루밍 뿌리오 드 뚜왈렛'
        }
    ];

    const [perfumes] = useState(tempPerfumes);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 12; // 6x2 그리드
    const filterTypes = ['Perfume', 'Eau de Parfum', 'Eau de Toilette', 'Eau de Cologne'];

    const handleFilterClick = (filterType) => {
        setFilter(filterType);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filteredPerfumes = perfumes.filter(perfume => 
        perfume.brandEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.brandKr.includes(searchTerm)
    );

    const renderPaginationButtons = () => {
        const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);
        const buttons = [];

        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            buttons.push(
                <button
                    key={i}
                    className={`perfumedatabase-page-btn ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (totalPages > 5) {
            buttons.push(
                <button
                    key="next"
                    className="perfumedatabase-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    &gt;
                </button>
            );
        }

        return buttons;
    };

    return (
        <div className="perfumedatabase-container">
            <input
                type="text"
                className="perfumedatabase-search"
                placeholder="브랜드명"
                value={searchTerm}
                onChange={handleSearch}
            />

            <div className="perfumedatabase-filters">
                {filterTypes.map((type) => (
                    <button
                        key={type}
                        className="perfumedatabase-filter-btn"
                        onClick={() => handleFilterClick(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="perfumedatabase-grid">
                {filteredPerfumes
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((perfume) => (
                        <div key={perfume.id} className="perfumedatabase-card">
                            <img
                                src={perfume.imageUrl}
                                alt={perfume.name}
                                className="perfumedatabase-image"
                            />
                            <div className="perfumedatabase-brand-en">{perfume.brandEn}</div>
                            <div className="perfumedatabase-brand-kr">{perfume.brandKr}</div>
                            <div className="perfumedatabase-divider" />
                            <div className="perfumedatabase-product-name">{perfume.name}</div>
                            <div className="perfumedatabase-concentration">
                                {perfume.concentration}
                            </div>
                        </div>
                    ))}
            </div>

            <div className="perfumedatabase-pagination">
                {renderPaginationButtons()}
            </div>
        </div>
    );
};

export default PerfumeDatabase;