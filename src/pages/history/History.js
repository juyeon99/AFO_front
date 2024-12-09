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
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const divRef = useRef(null); // 이미지 저장 관련

    const { historyData, loading, error } = useSelector((state) => state.history || {});

    const cardsPerPage = 3; // 한 번에 표시할 카드 수

    useEffect(() => {
        const localAuth = JSON.parse(localStorage.getItem("auth")); // 로그인 정보 가져오기
        console.log("로그인한 사용자의 정보 : ", localAuth)
        const memberId = localAuth?.id;
        console.log("로그인한 사용자의 아이디 : ", memberId)


        if (memberId) {
            console.log("향기 카드 데이터 요청 시작");
            dispatch(fetchHistory(memberId))
                .then(() => console.log("향기 카드 데이터 불러오기 성공"))
                .catch((err) => console.error("향기 카드 데이터 불러오기 실패:", err));
        }
    }, [dispatch]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류 발생: {error}</div>;
    }

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


    const { content, recommendations } = historyData[currentDateIndex] || { content: "", recommendations: [] };
    const visibleCards = recommendations.slice(currentCardIndex, currentCardIndex + cardsPerPage);

    // 점 개수 계산
    const dotCount = Math.ceil(recommendations.length / cardsPerPage);

    const handleDownload = async () => {
        if (!divRef.current) return;

        try {
            const div = divRef.current;
            const canvas = await html2canvas(div, { scale: 2 });
            canvas.toBlob((blob) => {
                if (blob !== null) {
                    saveAs(blob, "result.png");
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

            <div className="history-container"
                ref={divRef}>
                {historyData.length === 0 || recommendations.length === 0 ? ( // 데이터 유무 확인
                    <div className="empty-history-message">
                        저장된 향기 히스토리가 없습니다.
                    </div>
                ) : (
                    <>
                        <h2 className="history-title">{`"${content}"`}</h2>
                        <div className="card-container">
                            {visibleCards.map((card, index) => (
                                <div className="history-card" key={index}>
                                    <img src={card.perfumeImageUrl ||
                                        "https://cafe24.poxo.com/ec01/mataba/Xeym8gXyw/uNs04t9Tz1DqGEhx/RFwxojjA1nGGahjRqV6u/3bljc3eRqaK7vJ2SKd4ixXX36YNhP777nnJTfA==/_/web/product/big/202007/ffc65a83cb4b7d9b0d37bdf93581a71c.jpg"}
                                        alt={card.perfume}
                                        className="card-image" />
                                    <div className="card-content">
                                        <h3 className="card-title">{card.perfumeName}</h3>
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
                        onClick={() => handleDotClick(index)} // 클릭 이벤트 추가
                    ></span>
                ))}
            </div>
            <button className='imageSave' onClick={handleDownload}>이미지 저장하기 <Download strokeWidth={2} size={28} /></button>
        </div>
    );
}

export default History;
