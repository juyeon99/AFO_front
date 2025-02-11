import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import '../../css/admin/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Calendar } from 'lucide-react';
import KeywordRankingTable from './KeywordRankingTable';


function AdminDashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 10;

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Search Term:", e.target.value); // 입력값 확인
        setSearchTerm(e.target.value || "");
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    // 페이지네이션 계산
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === "startDate") {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    return (
        <>
            <img
                src="/images/logo.png"
                alt="1번 이미지"
                className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
            <div className="admin-dashboard-container">
                <div className="admin-dashboard-header">
                    <div className="admin-dashboard-title">사용자 대시보드</div>
                    <div className="admin-dashboard-date-picker">
                        <input
                            type="date"
                            name="startDate"
                            className="admin-dashboard-date-input"
                            value={startDate}
                            onChange={handleDateChange}
                        />
                        <span className="date-separator">→</span>
                        <input
                            type="date"
                            name="endDate"
                            className="admin-dashboard-date-input"
                            value={endDate}
                            onChange={handleDateChange}
                        />
                        <Calendar className="calendar-icon" size={20} />
                    </div>
                </div>

                <div className="admin-dashboard-divider-line" />

                <div className="admin-dashboard-keywordranking">
                    <KeywordRankingTable />
                </div>

            </div>
        </>
    );
}

export default AdminDashboard;