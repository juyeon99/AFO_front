// AdminMembers.js
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../../css/admin/AdminMembers.css';
import { useNavigate } from 'react-router-dom';

function AdminMembers() {
    const tempMembers = [
        {
            id: 1,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 2,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 3,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 4,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 5,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 6,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 7,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 8,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 9,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 10,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 11,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 12,
            memberId: '은혜감자',
            name: '권은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        }
    ];

    const [members] = useState(tempMembers);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 10;

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    const filteredMembers = members.filter(member =>
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 페이지네이션 계산
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const navigate = useNavigate();

    return (
        <>
            <img
                src="/images/logo.png"
                alt="1번 이미지"
                className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
            <div className="admin-members-container">
                <div className="admin-members-header">
                    <div className="admin-members-title">회원정보</div>
                    <form className="admin-members-search-container">
                        <input
                            type="text"
                            className="admin-members-search"
                            placeholder="아이디 검색"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search
                            className="admin-members-search-icon"
                            size={20}
                            color="#333"
                        />
                    </form>
                </div>

                <div className="admin-members-divider-line" />

                <div className="admin-members-table">
                    <table>
                        <thead>
                            <tr>
                                <th>회원 아이디</th>
                                <th>회원 이름</th>
                                <th>성별</th>
                                <th>나이</th>
                                <th>이메일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMembers.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.memberId}</td>
                                    <td>{member.name}</td>
                                    <td>{member.gender}</td>
                                    <td>{member.age}</td>
                                    <td>{member.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="admin-member-pagination">
                    <button
                        className={`admin-member-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        {'<<'}
                    </button>

                    <button
                        className={`admin-member-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`admin-member-pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className={`admin-member-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </button>

                    <button
                        className={`admin-member-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
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

export default AdminMembers;