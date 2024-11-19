import '../../css/components/admin/AdminPerfumeList.css';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPerfumeList = () => {
    const tempAdminPerfumes = [
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
        ,{
            id: 14,
            imageUrl: '/images/dior-pink.jpg',
            brandEn: 'DIOR',
            brandKr: '디올',
            name: 'MISS DIOR BLOOMING BOUQUET EDT',
            concentration: '미스 디올 블루밍 뿌리오 드 뚜왈렛'
        }
    ];

    const filterButtons = [
        { id: 'PARFUM', label: 'Parfum' },
        { id: 'EDP', label: 'Eau de Parfum' },
        { id: 'EDT', label: 'Eau de Toilette' },
        { id: 'EDC', label: 'Eau de Cologne' }
    ];

    const [perfumes, setPerfumes] = useState(tempAdminPerfumes);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPerfume, setSelectedPerfume] = useState(null);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [checkedCards, setCheckedCards] = useState([]);

    const itemsPerPage = 12;

    const handleFilterClick = (filterId) => {
        setActiveFilter(activeFilter === filterId ? '' : filterId);
        setCurrentPage(1);
    };

    const handleAddButtonClick = () => setShowAddModal(true);
    const handleEditButtonClick = (perfume) => {
        console.log('수정할 향수:', perfume); // 디버깅 로그
        setSelectedPerfume(perfume);
        setShowEditModal(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCheckboxToggle = () => setShowCheckboxes(!showCheckboxes);
    const handleCardCheckboxChange = (id) => {
        setCheckedCards((prev) =>
            prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
        );
    };

    const handleDeleteButtonClick = () => {
        setPerfumes(perfumes.filter((perfume) => !checkedCards.includes(perfume.id)));
        setCheckedCards([]);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedPerfume(null);
    };

    const filteredAdminPerfumes = perfumes.filter((perfume) => {
        const matchesSearch = perfume.brandEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            perfume.brandKr.includes(searchTerm);
        const matchesFilter = !activeFilter || perfume.name.includes(activeFilter);
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredAdminPerfumes.length / itemsPerPage);

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
            <div className="admin-perfume-list-container">
                <div className="admin-perfume-header">
                    <div className="admin-perfume-title">향수</div>
                    <form className="admin-perfume-list-search-container">
                        <input
                            type="text"
                            className="admin-perfume-list-search"
                            placeholder="브랜드명"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="admin-perfume-list-search-icon" size={20} color="#333" />
                    </form>
                </div>

                <div className="admin-perfume-list-divider-line" />

                <div className="admin-perfume-list-filters">
                    {filterButtons.map((button) => (
                        <button
                            key={button.id}
                            className={`admin-perfume-list-filter-btn ${activeFilter === button.id ? 'active' : ''}`}
                            onClick={() => handleFilterClick(button.id)}
                        >
                            {button.label}
                        </button>
                    ))}
                    <button className="add-button" onClick={handleAddButtonClick}>+</button>
                    <button className="checkbox-button" onClick={handleCheckboxToggle}>✓</button>
                    <button className="delete-button" onClick={handleDeleteButtonClick}>🗑</button>
                </div>

                <div className="admin-perfume-items-container">
                    {filteredAdminPerfumes
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((perfume) => (
                            <div key={perfume.id} className="admin-perfume-item-card">
                                {showCheckboxes && (
                                    <input
                                        type="checkbox"
                                        className="card-checkbox"
                                        onChange={() => handleCardCheckboxChange(perfume.id)}
                                    />
                                )}
                                <img
                                    src={perfume.imageUrl}
                                    alt={perfume.name}
                                    className="admin-perfume-item-image"
                                />
                                <div className="admin-perfume-item-name">{perfume.name}</div>
                                <div className="admin-perfume-category">{perfume.brandEn}</div>
                                <div
                                    className="edit-button"
                                    onClick={() => handleEditButtonClick(perfume)}
                                >
                                    ✏
                                </div>
                            </div>
                        ))}
                </div>

                <div className="admin-perfume-pagination">
                <button
                        className={`admin-perfume-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        {'<<'}
                    </button>

                    <button
                        className={`admin-perfume-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`admin-perfume-pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className={`admin-perfume-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </button>

                    <button
                        className={`admin-perfume-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        {'>>'}
                    </button>
                </div>

                {showAddModal && (
                    <Modal onClose={closeModal} title="향수 카드 추가하기">
                        <form className="perfume-form" onSubmit={(e) => {
                            e.preventDefault();
                            // 추가 로직 처리
                            console.log("향수 추가 완료!");
                            closeModal();
                        }}>
                            <label className="perfume-form-label">
                                향수명:
                                <input
                                    type="text"
                                    className="perfume-form-input"
                                    placeholder="향수 이름을 입력하세요"
                                    required
                                />
                            </label>
                            <label className="perfume-form-label">
                                브랜드명:
                                <input
                                    type="text"
                                    className="perfume-form-input"
                                    placeholder="브랜드명을 입력하세요"
                                    required
                                />
                            </label>
                            <label className="perfume-form-label">
                                부향률:
                                <select className="perfume-form-select" required>
                                    <option value="Eau de Parfum">Eau de Parfum</option>
                                    <option value="Eau de Toilette">Eau de Toilette</option>
                                    <option value="Eau de Cologne">Eau de Cologne</option>
                                    <option value="Parfum">Parfum</option>
                                </select>
                            </label>
                            <label className="perfume-form-label">
                                향수 설명:
                                <textarea
                                    className="perfume-form-textarea"
                                    placeholder="향수 설명을 입력하세요"
                                    required
                                ></textarea>
                            </label>
                            <label className="perfume-form-label">
                                이미지 추가:
                                <input type="file" className="perfume-form-file" accept="image/*" />
                            </label>
                            <div className="perfume-form-actions">
                                <button type="submit" className="perfume-form-button save">
                                    저장
                                </button>
                                <button
                                    type="button"
                                    className="perfume-form-button cancel"
                                    onClick={closeModal}
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {showEditModal && selectedPerfume && (
                    <Modal onClose={closeModal} title="향수 카드 수정하기">
                        <form className="perfume-form" onSubmit={(e) => {
                            e.preventDefault();
                            // 수정 로직 처리
                            console.log("향수 수정 완료!");
                            closeModal();
                        }}>
                            <label className="perfume-form-label">
                                향수명:
                                <input
                                    type="text"
                                    className="perfume-form-input"
                                    placeholder="향수 이름 수정"
                                    defaultValue={selectedPerfume?.name || ""}
                                    required
                                />
                            </label>
                            <label className="perfume-form-label">
                                브랜드명:
                                <input
                                    type="text"
                                    className="perfume-form-input"
                                    placeholder="브랜드명 수정"
                                    defaultValue={selectedPerfume?.brandEn || ""}
                                    required
                                />
                            </label>
                            <label className="perfume-form-label">
                                부향률:
                                <select
                                    className="perfume-form-select"
                                    defaultValue={selectedPerfume?.concentration || "Eau de Parfum"}
                                    required
                                >
                                    <option value="Eau de Parfum">Eau de Parfum</option>
                                    <option value="Eau de Toilette">Eau de Toilette</option>
                                    <option value="Eau de Cologne">Eau de Cologne</option>
                                    <option value="Parfum">Parfum</option>
                                </select>
                            </label>
                            <label className="perfume-form-label">
                                향수 설명:
                                <textarea
                                    className="perfume-form-textarea"
                                    placeholder="향수 설명 수정"
                                    defaultValue={selectedPerfume?.description || ""}
                                    required
                                ></textarea>
                            </label>
                            <label className="perfume-form-label">
                                이미지 추가:
                                <input type="file" className="perfume-form-file" accept="image/*" />
                            </label>
                            <div className="perfume-form-actions">
                                <button type="submit" className="perfume-form-button save">
                                    저장
                                </button>
                                <button
                                    type="button"
                                    className="perfume-form-button cancel"
                                    onClick={closeModal}
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </>
    );
};

const Modal = ({ onClose, title, children }) => (
    <div className="modal-container">
        <div className="modal-content">
            <h2>{title}</h2>
            {children}
            <button onClick={onClose}>닫기</button>
        </div>
    </div>
);

export default AdminPerfumeList;
