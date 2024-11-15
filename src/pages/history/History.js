import React, { useState } from 'react';
import '../../css/History.css';

function History() {
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const cardsPerPage = 3; // 한 번에 표시할 카드 수

    // 히스토리 날짜와 카드 데이터 배열
    const historyData = [
        {
            date: '2024.11.11',
            title: "햇살 속에 담긴 포근함과 나른함을 표현한 향기",
            cards: [
                {
                    title: "조 말론 우드 세이지 & 씨 솔트",
                    description: "자연스러운 우디 향과 소금기 섞인 바다 내음이 어우러져 따뜻하고 편안한 느낌",
                    imageUrl: "/images/per1.png"
                },
                {
                    title: "메종 마르지엘라 레플리카 레이지 선데이 모닝",
                    description: "머스크와 플로럴 향이 부드럽게 어우러져, 포근하고 여유로운 감성을 담은 향",
                    imageUrl: "/images/per2.png"
                },
                {
                    title: "딥티크 탐다오",
                    description: "샌달우드의 깊고 편안한 우디 향의 풍요로움, 따뜻한 숲속과 잘 어울리는 차분한 향",
                    imageUrl: "/images/per3.png"
                },
                {
                    title: "혜연바보",
                    description: "설명4",
                    imageUrl: "/images/per1.png"
                },
                {
                    title: "성민바보",
                    description: "설명5",
                    imageUrl: "/images/per2.png"
                },
                {
                    title: "강현바보",
                    description: "설명6",
                    imageUrl: "/images/per3.png"
                },
                {
                    title: "성은구리 바보",
                    description: "설명4",
                    imageUrl: "/images/per1.png"
                },
                {
                    title: "동동구리 바보",
                    description: "설명5",
                    imageUrl: "/images/per2.png"
                },
                {
                    title: "효찬구리 바보",
                    description: "설명6",
                    imageUrl: "/images/per3.png"
                },
            ]
        },
        {
            date: '2024.10.15',
            title: "가을의 차분함과 따스함을 담은 향기",
            cards: [
                {
                    title: "향수7",
                    description: "설명7",
                    imageUrl: "/images/per4.png"
                },
                {
                    title: "향수8",
                    description: "설명8",
                    imageUrl: "/images/per5.png"
                },
                {
                    title: "향수9",
                    description: "설명9",
                    imageUrl: "/images/per6.png"
                },
                {
                    title: "향수10",
                    description: "설명10",
                    imageUrl: "/images/per7.png"
                },
                {
                    title: "향수11",
                    description: "설명11",
                    imageUrl: "/images/per8.png"
                },
                {
                    title: "향수12",
                    description: "설명12",
                    imageUrl: "/images/per9.png"
                },
            ]
        },
    ];

    const handleDateClick = (index) => {
        setCurrentDateIndex(index);
        setCurrentCardIndex(0); // 날짜 변경 시 첫 번째 카드로 초기화
    };

    const handleCardChange = (direction) => {
        const totalCards = historyData[currentDateIndex].cards.length;

        if (direction === 'prev') {
            setCurrentCardIndex((prevIndex) => (prevIndex - cardsPerPage >= 0 ? prevIndex - cardsPerPage : totalCards - (totalCards % cardsPerPage || cardsPerPage)));
        } else {
            setCurrentCardIndex((prevIndex) => (prevIndex + cardsPerPage < totalCards ? prevIndex + cardsPerPage : 0));
        }
    };

    const handleDotClick = (index) => {
        setCurrentCardIndex(index * cardsPerPage);
    };
    

    const { date, title, cards } = historyData[currentDateIndex];
    const visibleCards = cards.slice(currentCardIndex, currentCardIndex + cardsPerPage);

    // 점 개수 계산
    const dotCount = Math.ceil(cards.length / cardsPerPage);

    return (
        <div className="history-main-container">
            <img src="/images/logo.png" alt="Logo" className="history-logo" />
            <div className="history-header">
                {historyData.map((item, index) => (
                    <button
                        key={index}
                        className={`history-date-button ${index === currentDateIndex ? 'active' : ''}`}
                        onClick={() => handleDateClick(index)}
                    >
                        {item.date}
                    </button>
                ))}
            </div>

            <div className="history-container">
                <h2 className="history-title">{`"${title}"`}</h2>
                <div className="card-container">
                    {visibleCards.map((card, index) => (
                        <div className="history-card" key={index}>
                            <img src={card.imageUrl} alt={card.title} className="card-image" />
                            <div className="card-content">
                                <h3 className="card-title">{card.title}</h3>
                                <hr className="divider" />
                                <p className="card-description">{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 좌우 화살표 버튼 */}
                <button className="prev-arrow" onClick={() => handleCardChange('prev')}>&#5130;</button>
                <button className="next-arrow" onClick={() => handleCardChange('next')}>&#5125;</button>
            </div>

            {/* 페이지네이션 점 표시 (카드 컨테이너 외부) */}
            <div className="dot-container">
                {Array.from({ length: dotCount }, (_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === Math.floor(currentCardIndex / cardsPerPage) ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)} // 클릭 이벤트 추가
                    ></span>
                ))}
            </div>
        </div>

    );
}

export default History;
