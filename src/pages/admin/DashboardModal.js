import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../css/admin/DashboardModal.css';
import ChartComponent from './ChartComponent'; // ChartComponent 임포트

const DashboardModal = ({ isOpen, onClose }) => {
    const [isDetailPage, setIsDetailPage] = useState(false);

    // 향수 데이터
    const perfumeDataLastWeek = [1447, 1283, 1100, 978, 856]; // 지난 주 향수 데이터
    const perfumeDataThisWeek = [1447, 1283, 1100, 978, 856]; // 이번 주 향수 데이터
    const perfumeLabels = ['넘버5 오 드 퍼퓸', '필로시코스 오 드 퍼퓸', '우드 세이지 앤 씨 솔트 오 드 코롱', '블랑쉬 오 드 퍼퓸', '엔젤스 웨어 오 드 퍼퓸'];

    // 키워드 데이터
    const keywordDataLastWeek = [958, 976, 1102, 1228, 1362]; // 지난 주 키워드 데이터
    const keywordDataThisWeek = [958, 976, 1102, 1228, 1362]; // 이번 주 키워드 데이터
    const keywordLabels = ['청량한', '따뜻한', '겨울', '시트러스', '우디'];

    // 상세 페이지로 전환
    const goToDetailPage = () => setIsDetailPage(true);
    // 메인 페이지로 돌아가기
    const goBackToMainPage = () => setIsDetailPage(false);

    useEffect(() => {
        if (isDetailPage) {
            // 상세 페이지로 이동 시 추가 로직이 있다면 처리
            console.log("상세 페이지로 이동");
        } else {
            // 메인 페이지로 돌아갈 때 추가 로직이 있다면 처리
            console.log("메인 페이지로 돌아가기");
        }
    }, [isDetailPage]);

    if (!isOpen) return null;

    return (
        <div className="dashboard-modal-overlay" onClick={onClose}>
            <div className="dashboard-modal-content" onClick={e => e.stopPropagation()}>
                <button className="dashboard-close-button" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* 상세 페이지 보기 버튼과 돌아가기 버튼은 같은 위치에 배치 */}
                <button
                    className="dashboard-toggle-button"
                    onClick={isDetailPage ? goBackToMainPage : goToDetailPage}
                >
                    {isDetailPage ? '< 돌아가기' : '상세 페이지 보기 >'}
                </button>

                {/* 첫 번째 페이지 (주간 인기 키워드 및 향수 카드) */}
                {!isDetailPage && (
                    <div key="mainPage" className="dashboard-section">
                        <h2 className="dashboard-section-title">주간 인기 키워드</h2>
                        <div className="dashboard-grid">
                            {/* 시트러스 카드 */}
                            <div className="dashboard-card">
                                <div className="dashboard-card-inner">
                                    <img src="/images/citrus-line.png" alt="시트러스" className="dashboard-card-icon" />
                                    <h3 className="dashboard-card-label">시트러스</h3>
                                    <p className="dashboard-card-stats">사용자의 선택 횟수: 120회</p>
                                    <p className="dashboard-card-change">지난 날부터 대비 ▲17%</p>
                                </div>
                            </div>
                            {/* 청량함 카드 */}
                            <div className="dashboard-card">
                                <div className="dashboard-card-inner">
                                    <img src="/images/fresh-line.png" alt="청량함" className="dashboard-card-icon" />
                                    <h3 className="dashboard-card-label">청량함</h3>
                                    <p className="dashboard-card-stats">사용자의 선택 횟수: 98회</p>
                                    <p className="dashboard-card-change">지난 날부터 대비 ▲17%</p>
                                </div>
                            </div>
                            {/* 우디 카드 */}
                            <div className="dashboard-card">
                                <div className="dashboard-card-inner">
                                    <img src="/images/woody-line.png" alt="우디" className="dashboard-card-icon" />
                                    <h3 className="dashboard-card-label">우디</h3>
                                    <p className="dashboard-card-stats">사용자의 선택 횟수: 96회</p>
                                    <p className="dashboard-card-change">지난 날부터 대비 ▼12%</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="dashboard-section-title">주간 인기 향수</h2>
                        <div className="dashboard-grid">
                            {/* 샤넬 향수 카드 */}
                            <div className="dashboard-card">
                                <div className="dashboard-card-inner">
                                    <img src="/images/chanel.png" alt="샤넬" className="dashboard-card-perfume" />
                                    <h3 className="dashboard-card-label">샤넬</h3>
                                    <p className="dashboard-card-name">넘버5 오 드 퍼퓸</p>
                                    <p className="dashboard-card-stats">추천 횟수: 62회</p>
                                    <p className="dashboard-card-change">지난 날부터 대비 ▲25%</p>
                                </div>
                            </div>
                            {/* 딥티크 향수 카드 */}
                            <div className="dashboard-card">
                                <div className="dashboard-card-inner">
                                    <img src="/images/diptyque.png" alt="딥티크" className="dashboard-card-perfume" />
                                    <h3 className="dashboard-card-label">딥티크</h3>
                                    <p className="dashboard-card-name">필로시코스 오 드 퍼퓸</p>
                                    <p className="dashboard-card-stats">추천 횟수: 58회</p>
                                    <p className="dashboard-card-change">지난 날부터 대비 ▲17%</p>
                                </div>
                            </div>
                            {/* 조 말론 향수 카드 */}
                            <div className="dashboard-card">
                                <div className="dashboard-card-inner">
                                    <img src="/images/jomalone.png" alt="조 말론" className="dashboard-card-perfume" />
                                    <h3 className="dashboard-card-label">조 말론</h3>
                                    <p className="dashboard-card-name">우드 세이지 앤 씨 솔트 오 드 코롱</p>
                                    <p className="dashboard-card-stats">추천 횟수: 49회</p>
                                    <p className="dashboard-card-change">지난 날부터 대비 ▼5%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Second Page - Detailed Charts for Keywords and Perfumes */}
                {isDetailPage && (
                    <div className="dashboard-section">
                        <h2 className="dashboard-section-title">주간 인기 키워드</h2>
                        <div className="chart-container">
                            {/* 두 개의 차트를 한 번에 표시 */}
                            <ChartComponent title="지난주 인기 키워드" labels={keywordLabels} data={keywordDataLastWeek} />
                            <ChartComponent title="이번주 인기 키워드" labels={keywordLabels} data={keywordDataThisWeek} />
                        </div>

                        <h2 className="dashboard-section-title">주간 인기 향수</h2>
                        <div className="chart-container">
                            {/* 두 개의 향수 차트를 한 번에 표시 */}
                            <ChartComponent title="지난주 인기 향수" labels={perfumeLabels} data={perfumeDataLastWeek} />
                            <ChartComponent title="이번주 인기 향수" labels={perfumeLabels} data={perfumeDataThisWeek} />
                        </div>

                        <button className="dashboard-toggle-button" onClick={goBackToMainPage}>
                            돌아가기 &lt;
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DashboardModal;