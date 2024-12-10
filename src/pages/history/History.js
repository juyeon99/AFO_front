import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchHistory } from '../../module/HistoryModule';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import html2canvas from "html2canvas";
import saveAs from "file-saver";
import { useRef } from "react";
import '../../css/History.css';

function History() {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const [currentDateIndex, setCurrentDateIndex] = useState(0); // 현재 선택된 날짜의 인덱스 저장
    const [currentCardIndex, setCurrentCardIndex] = useState(0); // 현재 표시되는 카드의 인덱스 저장
    const [userName, setUserName] = useState(""); // 사용자 이름 저장
    const [mappedHistory, setMappedHistory] = useState([]); // 매핑된 데이터를 저장
    const [uniqueDates, setUniqueDates] = useState([]); // 유니크한 날짜 저장

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const divRef = useRef(null);

    const { historyData } = useSelector((state) => state.history || {});

    const lines = [
        { name: 'Spicy', color: '#FF5757', id: '1' },
        { name: 'Fruity', color: '#FFBD43', id: '2' },
        { name: 'Citrus', color: '#FFE043', id: '3' },
        { name: 'Fougere', color: '#7ED3BB', id: '4' },
        { name: 'Green', color: '#62D66A', id: '5' },
        { name: 'Aldehyde', color: '#98D1FF', id: '6' },
        { name: 'Aquatic', color: '#56D2FF', id: '7' },
        { name: 'Amber', color: '#FFE8D3', id: '8' },
        { name: 'Gourmand', color: '#A1522C', id: '9' },
        { name: 'Woody', color: '#86390F', id: '10' },
        { name: 'Musk', color: '#F8E4FF', id: '11' },
        { name: 'Floral', color: '#FF80C1', id: '12' },
        { name: 'Oriental', color: '#C061FF', id: '13' },
        { name: 'Powdery', color: '#FFFFFF', id: '14' },
        { name: 'Tobacco Leather', color: '#000000', id: '15' },
    ];

    const cardsPerPage = 3;

    useEffect(() => {
        const localAuth = JSON.parse(localStorage.getItem("auth"));
        const memberId = localAuth?.id;
        const name = localAuth?.name;
        setUserName(name || "사용자");

        if (memberId) {
            dispatch(fetchHistory(memberId))
                .then(() => console.log("데이터 로드 성공"))
                .catch((err) => console.error("데이터 로드 실패:", err));
        }
    }, [dispatch]);

    useEffect(() => {
        // 데이터가 로드되면 매핑 및 날짜 정리
        if (historyData?.length > 0) {
            const mapped = historyData.map((item) => ({
                ...item,
                recommendations: item.recommendations.map((rec) => ({
                    ...rec,
                    imageUrl: item.imageUrl,
                    lineId: item.lineId,
                })),
            }));

            const dates = [...new Set(mapped.map((item) => formatDate(item.timeStamp)))];

            setMappedHistory(mapped);
            setUniqueDates(dates);
        }
    }, [historyData]);

    // 현재 선택된 날짜에 맞는 카드 필터링
    const filteredCards = mappedHistory
        .filter((item) => formatDate(item.timeStamp) === uniqueDates[currentDateIndex])
        .flatMap((item) => item.recommendations);

    const visibleCards = filteredCards.slice(currentCardIndex, currentCardIndex + cardsPerPage);

    const currentCardLineId = visibleCards[0]?.lineId || "";
    const currentCardLine = lines.find((line) => line.id === currentCardLineId?.toString()) || { name: "Unknown", color: "#000000" };
    const currentCardLineName = currentCardLine.name;
    const currentCardLineColor = currentCardLine.color;

    const handleDotClick = (index) => {
        setCurrentCardIndex(index * cardsPerPage);
    };

    const handleDateClick = (selectedDate) => {
        const index = uniqueDates.findIndex((date) => date === selectedDate);
        setCurrentDateIndex(index);
        setCurrentCardIndex(0);
    };

    const handleCardChange = (direction) => {
        const totalCards = filteredCards.length;
        if (direction === 'prev') {
            setCurrentCardIndex((prevIndex) =>
                prevIndex - cardsPerPage >= 0 ? prevIndex - cardsPerPage : totalCards - (totalCards % cardsPerPage || cardsPerPage)
            );
        } else {
            setCurrentCardIndex((prevIndex) =>
                prevIndex + cardsPerPage < totalCards ? prevIndex + cardsPerPage : 0
            );
        }
    };

    const handleDownload = async () => {
        if (!divRef.current) return;

        try {
            const canvas = await html2canvas(divRef.current, { scale: 2, useCORS: true, allowTaint: false });
            canvas.toBlob((blob) => {
                if (blob !== null) saveAs(blob, "향수 히스토리 카드.png");
            });
        } catch (error) {
            console.error("Error converting div to image:", error);
        }
    };

    return (
        <div className="history-main-container">
            <img src="/images/logo.png" alt="Logo" className="history-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
            <div className="history-header">
                {uniqueDates.map((date, index) => (
                    <button
                        key={index}
                        className={`history-date-button ${index === currentDateIndex ? 'active' : ''}`}
                        onClick={() => handleDateClick(date)}
                    >
                        {date}
                    </button>
                ))}
            </div>

            <div className="history-container" ref={divRef} style={{ borderColor: currentCardLineColor }}>
                {mappedHistory.length === 0 ? (
                    <div className="empty-history-message">저장된 향기 히스토리가 없습니다.</div>
                ) : (
                    <>
                        <div className="history-title-set">
                            <h2 className="history-main-title">{`${userName}님의 향수 카드`}</h2>
                            <h2 className="history-title" style={{ color: currentCardLineColor }}>{currentCardLineName} 계열</h2>
                        </div>
                        <div className="card-container">
                            {visibleCards.map((card, index) => (
                                <div className="history-card" key={index}>
                                    <img src={card.perfumeImageUrl || "https://via.placeholder.com/150"} alt={card.perfume || "Default"} className="card-image" />
                                    <div className="card-content">
                                        <h3 className="card-perfume-name">{card.perfumeName}</h3>
                                        <h3 className="card-perfume-brand">{card.perfumeBrand}</h3>
                                        <hr className="divider" />
                                        <p className="card-description"><strong>추천 이유:</strong> {card.reason}</p>
                                        <p className="card-description"><strong>추천 상황:</strong> {card.situation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="prev-arrow" onClick={() => handleCardChange('prev')}>&#5130;</button>
                        <button className="next-arrow" onClick={() => handleCardChange('next')}>&#5125;</button>
                    </>
                )}
            </div>

            <div className="dot-container">
                {Array.from({ length: Math.ceil(filteredCards.length / cardsPerPage) }, (_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === Math.floor(currentCardIndex / cardsPerPage) ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    ></span>
                ))}
            </div>
            <div className="imageSaveButton">
                <button className="imageSave" onClick={handleDownload}>이미지 저장 <Download strokeWidth={2} size={20} /></button>
            </div>
        </div>
    );
}

export default History;
