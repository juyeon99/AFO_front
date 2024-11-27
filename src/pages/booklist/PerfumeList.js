import '../../css/PerfumeList.css';
import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchPerfumes, selectPerfumes } from '../../module/PerfumeModule';

const PerfumeList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const perfumes = useSelector(selectPerfumes) || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState('');
    const [showCheckboxes, setShowCheckboxes] = useState(false); // 체크박스 표시 여부
    const [role, setRole] = useState(null);
    const [checkedCards, setCheckedCards] = useState([]); // 선택된 카드 목록
    console.log("현재 선택된 카드 ID:", checkedCards);

    const [showAddModal, setShowAddModal] = useState(false); // 추가 모달 표시
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 표시
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedPerfume, setSelectedPerfume] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [successMessage, setSuccessMessage] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [paginationGroup, setPaginationGroup] = useState(0); // 페이지네이션 그룹 관리
    const [currentPage, setCurrentPage] = useState(1);

    const filteredPerfumes = perfumes.filter((perfume) => {
        // 안전하게 perfume.name을 처리
        const name = perfume?.name || '';
        const brand = perfume?.brand || '';

        // 검색 조건 (searchTerm)
        const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.toLowerCase().includes(searchTerm.toLowerCase());

        // 필터 조건 (activeFilters)
        const matchesFilter =
        activeFilters.length === 0 || // 필터가 없으면 true
        activeFilters.some((filter) => name.includes(filter) || brand.includes(filter)); // 이름 또는 브랜드와 일치

    return matchesSearch && matchesFilter;
    });

    const itemsPerPage = 12;

    const totalPages = filteredPerfumes.length
        ? Math.ceil(filteredPerfumes.length / itemsPerPage)
        : 1;

    const pageStart = paginationGroup * 15 + 1;
    const pageEnd = Math.min((paginationGroup + 1) * 15, totalPages);

    useEffect(() => {
        // 향수 목록 가져오기
        dispatch(fetchPerfumes());
    }, [dispatch]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('auth'));
        if (storedUser && storedUser.role) {
            setRole(storedUser.role); // 사용자 역할 저장
        }
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleEditButtonClick = (perfume) => {
        setSelectedPerfume(perfume);
        setShowEditModal(true);
        setIsEditing(true); // 수정 모드 활성화
        setIsAdding(false); // 추가 모드 비활성화
    };

    const handleSuccessClose = () => setSuccessMessage('');

    const handleFilterClick = (filterId) => {
        setActiveFilters(prev => {
            if (prev.includes(filterId)) {
                return prev.filter(id => id !== filterId);
            } else {
                return [...prev, filterId];
            }
        });
        setCurrentPage(1);
    };

    const handleReset = () => {
        setImagePreview(null); // 파일 선택 영역 초기화
    };

    const filterButtons = [
        { id: '오 드 퍼퓸', label: 'Eau de Perfume' },
        { id: '오 드 뚜왈렛', label: 'Eau de Toilette' },
        { id: '오 드 코롱', label: 'Eau de Cologne' },
        { id: '퍼퓸', label: 'Perfume' },
        { id: '솔리드 퍼퓸', label: 'Solid Perfume'}

    ];

    const handleCheckboxToggle = () => setShowCheckboxes(!showCheckboxes);

    const handleCardCheckboxChange = (id) => {
        console.log("체크박스 클릭됨, ID:", id); // 디버깅 메시지
        setCheckedCards((prev) =>
            prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
        );
    };

    const handleAddButtonClick = () => {
        setShowAddModal(true);
        setIsAdding(true); // 추가 모드 활성화
        setIsEditing(false); // 수정 모드 비활성화
    };

    const handleDeleteButtonClick = () => {
        if (checkedCards.length === 0) {
            alert("삭제할 카드를 선택하세요.");
            return;
        }

        const perfumeToDelete = perfumes.find((perfume) => perfume.id === checkedCards[0]); // 첫 번째 선택된 카드
        setSelectedPerfume(perfumeToDelete); // 삭제할 카드 설정
        setIsDeleting(true); // 삭제 모달 활성화
    };

    const handleDeleteConfirm = () => {
        if (!selectedPerfume) {
            // selectedPerfume이 null일 경우 에러 방지
            console.error("선택된 향수 카드가 없습니다.");
            return;
        }

        // 삭제 로직 실행
        setIsDeleting(false); // 삭제 모달 닫기
        setSuccessMessage(`${selectedPerfume.name} 향수 카드가 삭제되었습니다!`); // 성공 메시지 표시
    };

    const handleDeleteClose = () => {
        setIsDeleting(false); // 삭제 모달 닫기
        setShowDeleteModal(false); // 추가 안전을 위해 모달 닫기
    };

    const handleSubmit = () => {
        if (isAdding) {
            // 추가 로직
            setSuccessMessage('향수가 성공적으로 등록되었습니다!'); // 추가 성공 메시지
            setShowAddModal(false); // 추가 모달 닫기
            setIsAdding(false); // 추가 상태 초기화
        }

        if (isEditing) {
            // 수정 로직
            console.log("수정된 데이터:", editingItem); // 수정 데이터 확인
            setSuccessMessage('향수가 성공적으로 수정되었습니다!'); // 수정 성공 메시지
            setShowEditModal(false); // 수정 모달 닫기
            setIsEditing(false); // 수정 상태 초기화
        }

        // 상태 초기화 (공통)
        setEditingItem(null);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedPerfume(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    
        // 페이지 그룹 변경 로직
        const groupStart = paginationGroup * 15 + 1;
        const groupEnd = groupStart + 14;
        if (page < groupStart) {
            setPaginationGroup(paginationGroup - 1);
        } else if (page > groupEnd) {
            setPaginationGroup(paginationGroup + 1);
        }
    };

    const handleNextGroup = () => {
        if ((paginationGroup + 1) * 15 < totalPages) {
            setPaginationGroup(paginationGroup + 1);
        }
    };
    
    const handlePreviousGroup = () => {
        if (paginationGroup > 0) {
            setPaginationGroup(paginationGroup - 1);
        }
    };

    // 데이터가 비어 있는 경우 처리
    if (!perfumes || perfumes.length === 0) {
        return <p>데이터를 불러오는 중입니다...</p>;
    }

    return (
        <>
            <img src="/images/logo.png" alt="로고 이미지" className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
            <div className="perfume-list-container">
                <div className="perfume-header">
                    <div className="perfume-title">향수</div>
                    <form className="perfume-list-search-container">
                        <input
                            type="text"
                            className="perfume-list-search"
                            placeholder="브랜드명, 향수 이름 검색"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search
                            className="perfume-list-search-icon"
                            size={20}
                            color="#333"
                        />
                    </form>
                </div>

                <div className="perfume-list-divider-line" />

                <div className="perfume-list-filters">
                    {filterButtons.map(button => (
                        <button
                            key={button.id}
                            className={`perfume-list-filter-btn ${activeFilters.includes(button.id) ? 'active' : ''}`}
                            onClick={() => handleFilterClick(button.id)}
                        >
                            {button.label}
                        </button>
                    ))}
                    {role === 'ADMIN' && (
                        <div className="admin-perfume-controls">
                            <button className="admin-perfume-add-button" onClick={handleAddButtonClick}>+</button>
                            <button className="admin-perfume-checkbox-button" onClick={handleCheckboxToggle}>✓</button>
                            <button onClick={handleDeleteButtonClick} className="admin-perfume-delete-button">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    )}

                </div>

                <div className="perfume-items-container">
                    {filteredPerfumes
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((perfume) => (
                            <div key={perfume.id} className="perfume-item-card">
                                {showCheckboxes && (
                                    <input
                                        type="checkbox"
                                        className="admin-perfume-card-select-circle"
                                        name={`perfume-select-${perfume.id}`}
                                        checked={checkedCards.includes(perfume.id)}
                                        onChange={() => handleCardCheckboxChange(perfume.id)}
                                        
                                    />
                                )}

                                {/* Edit 아이콘 버튼 */}
                                {role === 'ADMIN' && (
                                    <>
                                        <button
                                            className="admin-perfume-edit-button"
                                            onClick={() => handleEditButtonClick(perfume)} // 수정 버튼 클릭 시 실행
                                        >
                                            <Edit size={16} color="#333" /> {/* Edit 아이콘 사용 */}
                                        </button>
                                    </>
                                )}

                                <img
                                    src={perfume.imageUrl}
                                    alt={perfume.name}
                                    className="perfume-item-image"
                                />
                                <div className="perfume-item-name"><strong>{perfume.name}</strong></div>
                                <div className="perfume-divider-small"></div>  {/* 중간 선임 */}
                                <div className="perfume-category">{perfume.brand}</div>
                                <div className="perfume-grade">{perfume.grade}</div>
                                <div className="perfume-description">
                                <p>"{perfume.description}"</p>
                                <br/>
                                <div className='perfume-description-singleNote'>
                                    {perfume.singleNote && <p><strong>싱글 노트 | </strong> {perfume.singleNote}</p>}
                                </div>
                                <div className='perfume-description-multiNote'>
                                    {perfume.topNote && <p><strong>탑 노트 | </strong> {perfume.topNote}</p>}
                                    {perfume.middleNote && <p><strong>미들 노트 | </strong> {perfume.middleNote}</p>}
                                    {perfume.baseNote && <p><strong>베이스 노트 | </strong> {perfume.baseNote}</p>}
                                </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="perfume-pagination">
                    <button
                        className={`perfume-pagination-button ${paginationGroup === 1 ? 'disabled' : ''}`}
                        onClick={handlePreviousGroup}
                        disabled={paginationGroup === 0}
                    >
                        {'<<'}
                    </button>

                    <button
                        className={`perfume-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </button>

                    {Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => (
                        <button
                            key={index + pageStart}
                            className={`perfume-pagination-button ${currentPage === index + pageStart ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + pageStart)}
                        >
                            {index + pageStart}
                        </button>
                    ))}

                    <button
                        className={`perfume-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </button>

                    <button
                        className={`perfume-pagination-button ${pageEnd === totalPages ? 'disabled' : ''}`}
                        onClick={handleNextGroup}
                        disabled={pageEnd === totalPages}
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
                                        <option value="Eau de Perfume">Eau de Perfume</option>
                                        <option value="Eau de Toilette">Eau de Toilette</option>
                                        <option value="Eau de Cologne">Eau de Cologne</option>
                                        <option value="Perfume">Perfume</option>
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
                                        handleSubmit(); handleReset();
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
                                        value={selectedPerfume?.concentration || "Eau de perfume"}
                                        onChange={(e) =>
                                            setSelectedPerfume((prev) => ({
                                                ...prev,
                                                concentration: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="Eau de perfume">Eau de perfume</option>
                                        <option value="Eau de Toilette">Eau de Toilette</option>
                                        <option value="Eau de Cologne">Eau de Cologne</option>
                                        <option value="perfume">perfume</option>
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
                                <button
                                    onClick={() => {
                                        handleSubmit(); handleReset();
                                    }}
                                    className="admin-perfume-save-button"
                                >
                                    저장
                                </button>
                                <button onClick={closeModal} className="admin-perfume-cancel-button">
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 삭제 모달 */}
                {isDeleting && (
                    <div className="admin-spices-modal-backdrop">
                        <div className="admin-spices-modal-container-delete">
                            <h2 className="admin-spices-modal-title-delete">- 향수카드 삭제 -</h2>
                            <p>향수카드를 삭제하시겠습니까?</p>
                            <div className="admin-spices-modal-actions-delete">
                                <button onClick={handleDeleteConfirm} className="admin-spices-confirm-button">확인</button>
                                <button onClick={handleDeleteClose} className="admin-spices-cancel-button-delete">취소</button>
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

export default PerfumeList;