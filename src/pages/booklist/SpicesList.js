import React, { useState } from 'react';
import '../../css/SpicesList.css';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SpicesList() {
    const filters = [
        { name: 'ALL', color: '#FFFFFF' },
        { name: 'Spicy', color: '#FF5757' },
        { name: 'Chypre', color: '#FF7F43' },
        { name: 'Fruity', color: '#FFBD43' },
        { name: 'Citrus', color: '#FFE043' },
        { name: 'Green', color: '#62D66A' },
        { name: 'Floral', color: '#FF80C1' },
        { name: 'Oriental', color: '#C061FF' },
        { name: 'Musk', color: '#F8E4FF' },
        { name: 'Powdery', color: '#FFFFFF' },
        { name: 'Tobacco Leather', color: '#000000' },
        { name: 'Fougere', color: '#7ED3BB' },
        { name: 'Gourmand', color: '#A1522C' },
        { name: 'Woody', color: '#86390F' },
        { name: 'Aldehyde', color: '#98D1FF' },
        { name: 'Aquatic', color: '#56D2FF' },
        { name: 'Amber', color: '#FFE8D3' },
    ];

    const allItems = [
        { id: 1, name: 'Blood Orange', koreanName: '블러드 오렌지', category: 'Citrus 계열', filter: 'Citrus', image: '/images/bloodOrange.jpg', description: '상큼하고 톡 쏘는 블러드 오렌지의 향' },
        { id: 2, name: 'Fig', koreanName: '무화과', category: 'Fruity 계열', filter: 'Fruity', image: '/images/fig.jpg', description: '부드럽고 따뜻한 무화과의 향기' },
        { id: 3, name: 'Rose', koreanName: '장미', category: 'Floral 계열', filter: 'Floral', image: 'https://kukka-2-media-123.s3.amazonaws.com/media/contents/event_template/56599b79-734a-42b9-81b1-32c2a9c61e10.jpg', description: '우아하고 섬세한 장미의 향' },
        { id: 4, name: 'Vanilla', koreanName: '바닐라', category: 'Gourmand 계열', filter: 'Gourmand', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ2XaryE3PjV73ehMi5hSZrsDNSSAeuaSmwA&s', description: '달콤하고 부드러운 바닐라 향' },
        { id: 5, name: 'Lemon', koreanName: '레몬', category: 'Citrus 계열', filter: 'Citrus', image: 'https://kormedi.com/wp-content/uploads/2020/11/marat-musabirov-580x580.jpg', description: '신선하고 산뜻한 레몬의 향기' },
        { id: 6, name: 'Lavender', koreanName: '라벤더', category: 'Fougere 계열', filter: 'Fougere', image: 'https://dainsoap.co.kr/shopimages/sunny8875/001017000007.jpg?1389161120', description: '평온하고 안정감을 주는 라벤더의 향' },
        { id: 7, name: 'Ocean Breeze', koreanName: '오션 브리즈', category: 'Aquatic 계열', filter: 'Aquatic', image: 'https://pix10.agoda.net/hotelImages/164678/-1/98fae0da7d361de4851d0b9250bcbd8f.jpg?ca=6&ce=1&s=414x232', description: '시원하고 청량한 바다의 향기' },
        { id: 8, name: 'Ambergris', koreanName: '앰버그리스', category: 'Amber 계열', filter: 'Amber', image: 'https://cdn.imweb.me/upload/S201809105b961f2d3ff69/1d1597db9c5f6.jpg', description: '따뜻하고 부드러운 엠버 그리스의 향기' },
        { id: 9, name: 'Sandalwood', koreanName: '샌달우드', category: 'Woody 계열', filter: 'Woody', image: 'https://pimg.mk.co.kr/meet/neds/2017/02/image_readmed_2017_119807_14875724552784100.jpg', description: '고급스럽고 깊이 있는 샌달우드 향' },
        { id: 10, name: 'Patchouli', koreanName: '파출리', category: 'Oriental 계열', filter: 'Oriental', image: 'https://i.namu.wiki/i/yj-JeWpdOEgizRbVjFYhHPpfeRjExoxo0XaUmL43k78CsV-S7Nqt4Jo3m24G6vUGXqiPRWyVKG0G4U3Ewfo-0w.webp', description: '따뜻하고 이국적인 파출리 향기' },
        { id: 11, name: 'Bergamot', koreanName: '베르가못', category: 'Green 계열', filter: 'Green', image: 'https://blog.kakaocdn.net/dn/mSaif/btssf3Jt3KP/GYYzkIY5ogwBDfO3cKPRYk/img.png', description: '상쾌하고 은은한 베르가못의 향' },
        { id: 12, name: 'Cedar', koreanName: '시더', category: 'Woody 계열', filter: 'Woody', image: 'https://blog.kakaocdn.net/dn/cUSmDH/btrA33nSqs2/u0sT7gV0QJhKHfx1kMSRRk/img.jpg', description: '우아하고 자연스러운 삼나무의 향' },
        { id: 13, name: 'Jasmine', koreanName: '자스민', category: 'Floral 계열', filter: 'Floral', image: 'https://i.namu.wiki/i/tVlI5FN8DzhxMCFztMxgMVY72fw9mdVv-5XY23ANPSk4wi9Sbr-3VIBXTyaf3o7d4DXUMTGt_7obsilVBkiFUQ.webp', description: '달콤하고 강렬한 자스민의 향기' },
        { id: 14, name: 'Mint', koreanName: '민트', category: 'Green 계열', filter: 'Green', image: 'https://src.hidoc.co.kr/image/lib/2020/8/25/1598328226869_0.jpg', description: '상쾌하고 활력을 주는 민트 향' },
        { id: 15, name: 'Peach', koreanName: '복숭아', category: 'Fruity 계열', filter: 'Fruity', image: 'https://www.healthweek.co.kr/boardImage/healthweek/20200827/MC4xMjIyMTIwMCAxNTk4NTE2NjA5.jpeg', description: '달콤하고 상큼한 복숭아 향기' },
        { id: 16, name: 'Cinnamon', koreanName: '시나몬', category: 'Spicy 계열', filter: 'Spicy', image: 'https://i.namu.wiki/i/zF0wcwGksW9QUWXsASybErJSEqGJIl5Pgs8RCfXQRk0C69u3TQwaeGMvgoDHhKewB2La4p-HO-JaPaTJe-tKKg.webp', description: '따뜻하고 달콤한 계피의 향기' },
        { id: 17, name: 'Lime', koreanName: '라임', category: 'Citrus 계열', filter: 'Citrus', image: 'https://i.namu.wiki/i/qFtsfHDfxxYpJdC4dtzORabDYdi-jnrxx69Q7vK8QOZU2RX4wk6FqgIbVBHSrk2KN6HthO0OtjugcYmMe_6U7w.webp', description: '톡 쏘고 상큼한 라임의 향' },
        { id: 18, name: 'Ylang Ylang', koreanName: '일랑일랑', category: 'Floral 계열', filter: 'Floral', image: 'https://lh4.googleusercontent.com/proxy/MSvaqQcHOFFv0noCnmeqimEbtBLxDkOn245NZUE0HJ30CJTjRrdo4zHRhytGfvETw3JL3diEjpq4EseiXpb7szQfM5CwXsiePR8H', description: '부드럽고 풍부한 일랑일랑의 향기' },
    ];

    const [activeFilters, setActiveFilters] = useState(new Set(['ALL']));
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const itemsPerPage = 12;

    const filteredItems =
        activeFilters.has('ALL') || activeFilters.size === 0
            ? allItems
            : allItems.filter((item) => activeFilters.has(item.filter));

    const searchedItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.koreanName.includes(searchTerm)
    );

    const totalPages = Math.ceil(searchedItems.length / itemsPerPage);
    const displayedItems = searchedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFilterClick = (filterName) => {
        const newFilters = new Set(activeFilters);

        if (filterName === 'ALL') {
            if (activeFilters.has('ALL')) {
                newFilters.clear();
            } else {
                newFilters.clear();
                newFilters.add('ALL');
            }
        } else {
            newFilters.delete('ALL');

            if (newFilters.has(filterName)) {
                newFilters.delete(filterName);
            } else {
                newFilters.add(filterName);
            }
        }

        setActiveFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getTextColor = (backgroundColor) => {
        const brightness =
            parseInt(backgroundColor.slice(1, 3), 16) * 0.299 +
            parseInt(backgroundColor.slice(3, 5), 16) * 0.587 +
            parseInt(backgroundColor.slice(5, 7), 16) * 0.114;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    const navigate = useNavigate();

    return (
        <>
            <img src="/images/logo.png" alt="1번 이미지" className="main-logo-image"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            />
        <div className="spices-container">
            <div className="spices-header">
                <div className="spices-title">향료</div>
                <form className="spices-search-bar">
                    <input
                        type="text"
                        className="spices-search-input"
                        placeholder="향료명"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                        className="spices-list-search-icon"
                        size={20}
                        color="#333"
                    />
                </form>
            </div>
            <div className="spices-filters">
                {filters.map((filter, index) => (
                    <div
                        key={index}
                        className={`spices-filter-item ${activeFilters.has(filter.name) ? 'active' : ''}`}
                        style={{
                            backgroundColor: activeFilters.has(filter.name) || activeFilters.has('ALL') ? filter.color : '#EFEDED',
                            color: activeFilters.has(filter.name) || activeFilters.has('ALL') ? getTextColor(filter.color) : '#000000',
                            borderColor: 'black',
                        }}
                        onClick={() => handleFilterClick(filter.name)}
                    >
                        {filter.name}
                    </div>
                ))}
            </div>
            <div className="spices-items-container">
                {displayedItems.map((item) => {
                    const filterColor = filters.find((f) => f.name === item.filter)?.color || '#FFFFFF';

                    return (
                        <div
                            key={item.id}
                            className={`spices-item-card ${hoveredItemId === item.id ? 'hover' : ''}`}
                            onMouseEnter={() => setHoveredItemId(item.id)}
                            onMouseLeave={() => setHoveredItemId(null)}
                            style={{
                                backgroundColor: hoveredItemId === item.id ? filterColor : '#FFFFFF',
                            }}
                        >
                            {hoveredItemId === item.id ? (
                                <div
                                    className="spices-description"
                                    style={{
                                        color: getTextColor(filterColor), // 밝기에 따라 텍스트 색상 결정
                                    }}
                                >
                                    {item.description}
                                </div>
                            ) : (
                                <>
                                    <img src={item.image} alt={item.name} />
                                    <div className="spices-name">{item.name}</div>
                                    <div className="spices-divider-small"></div>
                                    <div className="spices-category">{item.category}</div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="spices-pagination">
                {/* 처음으로 이동 버튼 */}
                <button
                    className={`spices-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    {'<<'}
                </button>

                {/* 이전 페이지로 이동 버튼 */}
                <button
                    className={`spices-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    {'<'}
                </button>

                {/* 페이지 번호 */}
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`spices-pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                {/* 다음 페이지로 이동 버튼 */}
                <button
                    className={`spices-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    {'>'}
                </button>

                {/* 마지막으로 이동 버튼 */}
                <button
                    className={`spices-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    {'>>'}
                </button>
            </div>

        </div>
        </>
    );
}

export default SpicesList;
