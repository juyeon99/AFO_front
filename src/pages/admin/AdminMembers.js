// AdminMembers.js
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../../css/pages/admin/AdminMembers.css';

function AdminMembers() {
    // 임시 회원 데이터
    const tempMembers = [
        {
            id: 1,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 2,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 3,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 4,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 5,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 6,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 7,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 8,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 9,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 10,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 11,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        },
        {
            id: 12,
            memberId: '은혜감자',
            name: '문은혜',
            gender: '여자',
            age: 26,
            email: 'king@gmail.com'
        }
    ];

    const [members] = useState(tempMembers);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMembers = members.filter(member => 
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
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
                        {filteredMembers.map((member) => (
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
        </div>
    );
}

export default AdminMembers;