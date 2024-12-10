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

    // 타임스탬프를 YYYY-MM-DD 형식의 문자열로 변환
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const [currentDateIndex, setCurrentDateIndex] = useState(0); // 현재 선택된 날짜의 인덱스를 저장
    const [currentCardIndex, setCurrentCardIndex] = useState(0); // 현재 표시되는 카드의 인덱스를 저장
    const [userName, setUserName] = useState(""); // 사용자의 이름을 저장

    const dispatch = useDispatch(); // Redux 액션을 디스패치
    const navigate = useNavigate(); // 페이지 이동
    const divRef = useRef(null); // 이미지 저장

    const { historyData } = useSelector((state) => state.history || {}); // history 상태에서 historyData 가져옴

    const sortedHistory = [...(historyData || [])].sort((a, b) => {
        const dateA = new Date(a.timeStamp);
        const dateB = new Date(b.timeStamp);
        return dateB - dateA; // 내림차순 정렬
    });

    const uniqueDates = [...new Set(sortedHistory.map(item => formatDate(item.timeStamp)))]; // 날짜를 중복 없이 정리하기

    // 현재 선택된 날짜의 데이터 가져오기: content와 recommendations를 추출
    const { lineId, recommendations } = sortedHistory[currentDateIndex] || { lineId: "", recommendations: [] };

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

    const currentLine = lines.find(line => line.id === lineId?.toString()) || { name: "Unknown", color: "#000000" };
    const lineName = currentLine.name;
    const lineColor = currentLine.color;

    const cardsPerPage = 3; // 페이지당 표시할 카드 수

    useEffect(() => {
        const localAuth = JSON.parse(localStorage.getItem("auth")); // 로그인 정보 가져오기
        console.log("로그인한 사용자의 정보 : ", localAuth)
        const memberId = localAuth?.id;
        const name = localAuth?.name;
        setUserName(name || "사용자");


        if (memberId) {
            console.log("향기 카드 데이터 요청 시작");
            dispatch(fetchHistory(memberId))
                .then(() => console.log("향기 카드 데이터 불러오기 성공"))
                .catch((err) => console.error("향기 카드 데이터 불러오기 실패:", err));
        }
    }, [dispatch]);

    // 해당 날짜의 카드만 필터링 및 정렬
    const filteredCards = sortedHistory
        .filter(item => formatDate(item.timeStamp) === uniqueDates[currentDateIndex])
        .flatMap(item =>
            item.recommendations.map(rec => ({
                ...rec,
                imageUrl: item.imageUrl, // 부모의 imageUrl 추가
                lineId: item.lineId     // 부모의 lineId 추가
            }))
        )
        .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    console.log('Filtered Cards:', filteredCards);

    // 현재 날짜의 카드 가져오기
    const visibleCards = filteredCards.slice(currentCardIndex, currentCardIndex + cardsPerPage);
    console.log('Visible Cards:', visibleCards);

    // 점의 개수: 필터링된 카드 개수에 따라 계산
    const dotCount = Math.ceil(filteredCards.length / cardsPerPage);

    // 점 클릭 시 해당 페이지로 이동
    const handleDotClick = (index) => {
        setCurrentCardIndex(index * cardsPerPage);
    };

    // 날짜 클릭 시 해당 날짜로 이동
    const handleDateClick = (selectedDate) => {
        // 선택한 날짜의 인덱스를 uniqueDates에서 찾음
        const index = uniqueDates.findIndex(date => date === selectedDate);
        setCurrentDateIndex(index); // 클릭한 날짜의 인덱스를 설정
        setCurrentCardIndex(0); // 카드 인덱스를 초기화
    };

    // 이전 카드로 이동: prev 방향이면 currentCardIndex를 cardsPerPage만큼 감소
    // 다음 카드로 이동: next 방향이면 currentCardIndex를 cardsPerPage만큼 증가
    // 순환 기능: 첫 페이지에서 이전으로 가면 마지막 페이지로, 마지막 페이지에서 다음으로 가면 첫 페이지로 이동
    const handleCardChange = (direction) => {
        const totalCards = filteredCards.length;

        if (direction === 'prev') {
            setCurrentCardIndex((prevIndex) =>
                prevIndex - cardsPerPage >= 0
                    ? prevIndex - cardsPerPage
                    : totalCards - (totalCards % cardsPerPage || cardsPerPage)
            );
        } else {
            setCurrentCardIndex((prevIndex) =>
                prevIndex + cardsPerPage < totalCards ? prevIndex + cardsPerPage : 0
            );
        }
    };

    // 이미지 다운로드 기능
    const handleDownload = async () => {
        if (!divRef.current) return;

        try {
            const div = divRef.current;
            const canvas = await html2canvas(div, {
                scale: 2, // 고해상도
                useCORS: true, // 외부 이미지 캡처를 허용
                allowTaint: false, // CORS가 설정된 이미지 처리
            });
            canvas.toBlob((blob) => {
                if (blob !== null) {
                    saveAs(blob, "향수 히스토리 카드.png");
                }
            });
        } catch (error) {
            console.error("Error converting div to image:", error);
        }
    };

    return (
        <div className="history-main-container">
            <img src="/images/logo.png" alt="Logo" className="history-logo"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
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

            <div className="history-container"
                ref={divRef}
                style={{ borderColor: lineColor }}
            >
                {historyData.length === 0 || recommendations.length === 0 ? ( // 데이터 유무 확인
                    <div className="empty-history-message">
                        저장된 향기 히스토리가 없습니다.
                    </div>
                ) : (
                    <>
                        <div className='history-title-set'>
                            <h2 className="history-main-title">{` ${userName}님의 향수 카드`}</h2>
                            <h2
                                className="history-title"
                                style={{ color: lineColor }}
                            >
                                {lineName} 계열
                            </h2>
                        </div>
                        <div className="card-container">
                            {visibleCards.map((card, index) => (
                                <div className="history-card" key={index}>
                                    <img src={card.perfumeImageUrl ||
                                        "https://cafe24.poxo.com/ec01/mataba/Xeym8gXyw/uNs04t9Tz1DqGEhx/RFwxojjA1nGGahjRqV6u/3bljc3eRqaK7vJ2SKd4ixXX36YNhP777nnJTfA==/_/web/product/big/202007/ffc65a83cb4b7d9b0d37bdf93581a71c.jpg"}
                                        alt={card.perfume || "Default Image"}
                                        className="card-image" />
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


                        {/* 좌우 화살표 버튼 */}
                        <button className="prev-arrow" onClick={() => handleCardChange('prev')}>&#5130;</button>
                        <button className="next-arrow" onClick={() => handleCardChange('next')}>&#5125;</button>
                    </>
                )}
            </div>
            {/* 페이지네이션 점 표시 (카드 컨테이너 외부) */}
            <div className="dot-container">
                {Array.from({ length: dotCount }, (_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === Math.floor(currentCardIndex / cardsPerPage) ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    ></span>
                ))}
            </div>
            <div className='imageSaveButton'>
            <button className='imageSave' onClick={handleDownload}>이미지 저장 <Download strokeWidth={2} size={20} /></button>
            </div>
        </div>
    );
}

export default History;
