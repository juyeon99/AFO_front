import '../../css/admin/AdminPerfumeList.css';
import React, { useState } from 'react';
import { Search, Trash2, Edit } from 'lucide-react';
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
        , {
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
    const [showCheckboxes, setShowCheckboxes] = useState(false); // 체크박스 표시 여부
    const [checkedCards, setCheckedCards] = useState([]); // 선택된 카드 목록
    const [showAddModal, setShowAddModal] = useState(false); // 추가 모달 표시
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 표시
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPerfume, setSelectedPerfume] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const itemsPerPage = 12;

    const handleCheckboxToggle = () => setShowCheckboxes(!showCheckboxes);

    const handleCardCheckboxChange = (id) => {
        setCheckedCards((prev) =>
            prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
        );
    };

    const handleAddButtonClick = () => setShowAddModal(true);
    const handleDeleteButtonClick = () => setShowDeleteModal(true);

    // 추가 및 삭제 처리
    const handleAddSubmit = () => {
        setShowAddModal(false); // 추가 모달 닫기
        setSuccessMessage('항수가 성공적으로 등록되었습니다!'); // 성공 메시지 설정
    };

    const handleDeleteConfirm = () => {
        setShowDeleteModal(false); // 삭제 모달 닫기
        setSuccessMessage(`${selectedPerfume} 항료 카드가 삭제되었습니다!`); // 성공 메시지 설정
    };

    const handleEditSubmit = () => {
        // 데이터 수정 로직 추가 (현재는 콘솔 출력)
        console.log("수정된 데이터:", editingItem);

        setShowEditModal(false); // 수정 모달 닫기
        setEditingItem(null); // 수정 데이터 초기화
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedPerfume(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFilterClick = (filterId) => {
        setActiveFilter(filterId === activeFilter ? "" : filterId);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditButtonClick = (perfume) => {
        setSelectedPerfume(perfume);
        setShowEditModal(true);
    };

    const handleSuccessClose = () => setSuccessMessage('');

    const filteredAdminPerfumes = perfumes.filter((perfume) => {
        const matchesSearch = perfume.brandEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            perfume.brandKr.includes(searchTerm);
        const matchesFilter = !activeFilter || perfume.name.includes(activeFilter);
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredAdminPerfumes.length / itemsPerPage);

    const perfumesToDisplay = filteredAdminPerfumes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const navigate = useNavigate();

    const handleReset = () => {
        setImagePreview(null); // 파일 선택 영역 초기화
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

                                {/* Edit 아이콘 버튼 */}
                                <button
                                    className="admin-spices-edit-button"
                                    onClick={() => handleEditButtonClick(perfume)} // 수정 버튼 클릭 시 실행
                                >
                                    <Edit size={16} color="#333" /> {/* Edit 아이콘 사용 */}
                                </button>
                                <img
                                    src={perfume.imageUrl}
                                    alt={perfume.name}
                                    className="admin-perfume-item-image"
                                />
                                <div className="admin-perfume-item-name">{perfume.name}</div>
                                <div className="admin-perfume-category">{perfume.brandEn}</div>
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
                    <div className="admin-perfume-modal-backdrop">
                        <div className="admin-perfume-modal-container">
                            <h2 className="admin-perfume-modal-title">향수 카드 추가하기</h2>
                            <div className="admin-perfume-modal-content">
                                <div className="admin-perfume-modal-row">
                                    <label>향수명</label>
                                    <input
                                        className="admin-perfume-modal-row-name"
                                        type="text"
                                        placeholder="향수 이름을 입력하세요"
                                        required
                                    />
                                </div>
                                <div className="admin-perfume-modal-row">
                                    <label>브랜드명</label>
                                    <input
                                        className="admin-perfume-modal-row-brand"
                                        type="text"
                                        placeholder="브랜드명을 입력하세요"
                                        required
                                    />
                                </div>
                                <div className="admin-perfume-modal-row">
                                    <label className="perfume-form-label">
                                        부향률
                                    </label>
                                    <select className="admin-perfume-form-select" required>
                                        <option value="Eau de Parfum">Eau de Parfum</option>
                                        <option value="Eau de Toilette">Eau de Toilette</option>
                                        <option value="Eau de Cologne">Eau de Cologne</option>
                                        <option value="Parfum">Parfum</option>
                                    </select>
                                </div>
                                <div className="admin-perfume-modal-row-description">
                                    <label>향수 설명</label>
                                    <textarea
                                        className="admin-perfume-modal-row-textarea"
                                        placeholder="향수 설명을 입력하세요"
                                        required
                                    ></textarea>
                                </div>
                                <div className="admin-perfume-modal-row">
                                    <label className="admin-perfume-modal-row-image-label">이미지</label>
                                    <div
                                        className="admin-perfume-image-upload"
                                        onClick={() => document.getElementById("admin-perfume-file-input").click()}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="미리보기"
                                                className="admin-perfume-image-preview"
                                            />
                                        ) : (
                                            <div className="admin-perfume-placeholder">+</div>
                                        )}
                                        <input
                                            id="admin-perfume-file-input"
                                            type="file"
                                            className="admin-perfume-file-input"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="admin-perfume-modal-actions">
                                <button
                                    onClick={() => {
                                        handleAddSubmit(); handleReset();
                                    }}
                                    className="admin-perfume-save-button"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="admin-perfume-cancel-button"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {showEditModal && selectedPerfume && (
                    <div className="admin-perfume-modal-backdrop">
                        <div className="admin-perfume-modal-container">
                            <h2 className="admin-perfume-modal-title">향수 카드 수정하기</h2>
                            <div className="admin-perfume-modal-content">
                                <div className="admin-perfume-modal-row">
                                    <label>향수명</label>
                                    <input
                                        type="text"
                                        className="admin-perfume-modal-row-name"
                                        value={selectedPerfume?.name || ""}
                                        onChange={(e) =>
                                            setSelectedPerfume((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        placeholder="향수 이름 수정"
                                    />
                                </div>
                                <div className="admin-perfume-modal-row">
                                    <label>브랜드명</label>
                                    <input
                                        type="text"
                                        className="admin-perfume-modal-row-brand"
                                        value={selectedPerfume?.brandEn || ""}
                                        onChange={(e) =>
                                            setSelectedPerfume((prev) => ({ ...prev, brandEn: e.target.value }))
                                        }
                                        placeholder="브랜드명 수정"
                                    />
                                </div>
                                <div className="admin-perfume-modal-row">
                                    <label>부향률</label>
                                    <select
                                        className="admin-perfume-modal-row-concentration"
                                        value={selectedPerfume?.concentration || "Eau de Parfum"}
                                        onChange={(e) =>
                                            setSelectedPerfume((prev) => ({
                                                ...prev,
                                                concentration: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="Eau de Parfum">Eau de Parfum</option>
                                        <option value="Eau de Toilette">Eau de Toilette</option>
                                        <option value="Eau de Cologne">Eau de Cologne</option>
                                        <option value="Parfum">Parfum</option>
                                    </select>
                                </div>
                                <div className="admin-perfume-modal-row-description">
                                    <label>향수 설명</label>
                                    <textarea
                                        className="admin-perfume-modal-row-textarea"
                                        value={selectedPerfume?.description || ""}
                                        onChange={(e) =>
                                            setSelectedPerfume((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="향수 설명 수정"
                                    />
                                </div>
                                <div className="admin-perfume-modal-row">
                                    <label className="admin-perfume-modal-row-image-label">이미지</label>
                                    <div
                                        className="admin-perfume-image-upload"
                                        onClick={() => document.getElementById("admin-perfume-file-input-edit").click()}
                                    >
                                        {imagePreview || selectedPerfume?.image ? (
                                            <img
                                                src={imagePreview || selectedPerfume?.image}
                                                alt="미리보기"
                                                className="admin-perfume-image-preview"
                                            />
                                        ) : (
                                            <div className="admin-perfume-placeholder">+</div>
                                        )}
                                        <input
                                            id="admin-perfume-file-input-edit"
                                            type="file"
                                            className="admin-perfume-file-input"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setSelectedPerfume((prev) => ({
                                                            ...prev,
                                                            image: reader.result,
                                                        }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="admin-perfume-modal-actions">
                                <button onClick={handleEditSubmit} className="admin-perfume-save-button">
                                    저장
                                </button>
                                <button onClick={closeModal} className="admin-perfume-cancel-button">
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* 성공 메시지 모달 */}
                {successMessage && (
                    <div className="admin-perfume-modal-backdrop">
                        <div className="admin-perfume-modal-container-success">
                            <p className="admin-perfume-success-message-success">{successMessage}</p>
                            <div className="admin-perfume-modal-actions-success">
                                <button onClick={handleSuccessClose} className="admin-perfume-cancel-button-success">
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default AdminPerfumeList;
