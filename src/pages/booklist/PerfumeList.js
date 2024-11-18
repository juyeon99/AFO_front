import '../../css/pages/booklist/PerfumeList.css';
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PerfumeList = () => {
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
    const [activeFilter, setActiveFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 12;

    const filterButtons = [
        { id: 'EDP', label: 'Eau de Parfum' },
        { id: 'EDT', label: 'Eau de Toilette' },
        { id: 'EDC', label: 'Eau de Cologne' },
        { id: 'PARFUM', label: 'Parfum' }
    ];

    const handleFilterClick = (filterId) => {
        setActiveFilter(activeFilter === filterId ? '' : filterId);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filteredPerfumes = perfumes.filter(perfume => {
        const matchesSearch = perfume.brandEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            perfume.brandKr.includes(searchTerm);
        const matchesFilter = !activeFilter || perfume.name.includes(activeFilter);
        return matchesSearch && matchesFilter;
    });

    const renderPaginationButtons = () => {
        const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);
        const buttons = [];

        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            buttons.push(
                <button
                    key={i}
                    className={`perfume-list-page-btn ${currentPage === i ? 'active' : ''}`}
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
                    className="perfume-list-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    &gt;
                </button>
            );
        }

        return buttons;
    };

    return (
        <div className="perfume-list-container">
            <div className="perfume-list-search-container">
                <input
                    type="text"
                    className="perfume-list-search"
                    placeholder="브랜드명"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <Search
                    className="perfume-list-search-icon"
                    size={20}
                    color="#333"
                />
            </div>

            <div className="perfume-list-divider-line" />

            <div className="perfume-list-filters">
                {filterButtons.map(button => (
                    <button
                        key={button.id}
                        className={`perfume-list-filter-btn ${activeFilter === button.id ? 'active' : ''}`}
                        onClick={() => handleFilterClick(button.id)}
                    >
                        {button.label}
                    </button>
                ))}
            </div>

            <div className="perfume-list-grid">
                {filteredPerfumes
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((perfume) => (
                        <div key={perfume.id} className="perfume-list-card">
                            <img
                                src={perfume.imageUrl}
                                alt={perfume.name}
                                className="perfume-list-image"
                            />
                            <div className="perfume-list-brand-en">{perfume.brandEn}</div>
                            <div className="perfume-list-brand-kr">{perfume.brandKr}</div>
                            <div className="perfume-list-divider" />
                            <div className="perfume-list-product-name">{perfume.name}</div>
                            <div className="perfume-list-concentration">
                                {perfume.concentration}
                            </div>
                        </div>
                    ))}
            </div>

            <div className="perfume-list-pagination">
                {renderPaginationButtons()}
            </div>
        </div>
    );
};

export default PerfumeList;