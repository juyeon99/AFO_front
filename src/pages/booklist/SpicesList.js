import '../../css/SpicesList.css';
import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchSpices, selectSpices, modifySpices, deleteSpices, createSpices } from '../../module/SpicesModule';
import LoadingScreen from '../../components/loading/LoadingScreen';

const SpicesList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spices = useSelector(selectSpices);

    const [searchTerm, setSearchTerm] = useState(''); // 검색창
    const [activeFilters, setActiveFilters] = useState([]); // 버튼 필터
    const [showCheckboxes, setShowCheckboxes] = useState(false); // 체크박스 표시 여부
    const [role, setRole] = useState(null); // 사용자 역할
    const [selectedCard, setSelectedCard] = useState(null); // 선택된 단일 카드
    // console.log("현재 선택된 카드 ID:", selectedCard);

    const [showAddModal, setShowAddModal] = useState(false); // 추가 모달 표시
    const [showEditModal, setShowEditModal] = useState(false); // 수정 모달

    const [selectedSpice, setSelectedSpice] = useState(null); // 향료 데이터 값 설정
    const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기

    const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
    const [isAdding, setIsAdding] = useState(false); // 추가할 값
    const [isEditing, setIsEditing] = useState(false); // 수정할 값
    const [isDeleting, setIsDeleting] = useState(false); // 삭제할 값
    const [paginationGroup, setPaginationGroup] = useState(0); // 페이지네이션 그룹 관리
    const [currentPage, setCurrentPage] = useState(1); // 페이지
    const [editingImage, setEditingImage] = useState(false);  // 이미지 수정

    // 검색창
    // spices가 배열인지 확인하고 필터링
    const filteredSpices = Array.isArray(spices) ? spices.filter((spice) => {
        // 안전하게 spice.name을 처리
        const name = spice?.name || '';
        const nameKr = spice?.nameKr || '';
        const lineName = spice?.lineName || '';
        const description = spice?.description || '';

        // 검색 조건 (searchTerm)
        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nameKr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase());

        // 필터 조건 (activeFilters)
        const matchesFilter =
            activeFilters.length === 0 || // 필터가 없으면 true
            activeFilters.some((filter) =>
                name.includes(filter) ||
                nameKr.includes(filter) ||
                lineName.includes(filter) ||
                description.includes(filter)
            );

        return matchesSearch && matchesFilter;
    }) : [];

    // 컴포넌트에서 spices 상태 확인을 위한 디버깅
    useEffect(() => {
        console.log('현재 spices:', spices);
    }, [spices]);


    // 페이지 관련 설정
    const itemsPerPage = 12;

    const totalPages = filteredSpices.length
        ? Math.ceil(filteredSpices.length / itemsPerPage)
        : 1;

    const pageStart = paginationGroup * 10 + 1;
    const pageEnd = Math.min((paginationGroup + 1) * 10, totalPages);

    const handlePageChange = (page) => {
        setCurrentPage(page);

        // 페이지 그룹 변경 로직
        const groupStart = paginationGroup * 10 + 1;
        const groupEnd = groupStart + 9;
        if (page < groupStart) {
            setPaginationGroup(paginationGroup - 1);
        } else if (page > groupEnd) {
            setPaginationGroup(paginationGroup + 1);
        }
    };

    const handleNextGroup = () => {
        if ((paginationGroup + 1) * 10 < totalPages) {
            setPaginationGroup(paginationGroup + 1);
        }
    };

    const handlePreviousGroup = () => {
        if (paginationGroup > 0) {
            setPaginationGroup(paginationGroup - 1);
        }
    };

    const filterButtons = [
        { name: 'ALL', color: '#FFFFFF' },
        { name: 'Spicy', color: '#FF5757' },
        { name: 'Fruity', color: '#FFBD43' },
        { name: 'Citrus', color: '#FFE043' },
        { name: 'Green', color: '#62D66A' },
        { name: 'Floral', color: '#FF80C1' },
        { name: 'Oriental', color: '#C061FF' },
        { name: 'Musk', color: '#F8E4FF' },
        { name: 'Powdery', color: '#FFFFFF' },
        { name: 'Tobacco Leather', color: '#000000' },
        { name: 'Fougere', color: '#7ED3BB' },
        { name: 'Gourmand', color: '#A1522C' },
        { name: 'Woody', color: '#86390F' },
        { name: 'Aldehyde', color: '#98D1FF' },
        { name: 'Aquatic', color: '#56D2FF' },
        { name: 'Amber', color: '#FFE8D3' },
    ];

    // 라인 별 색깔
    const getFilterColor = (lineName) => {
        const filter = filterButtons.find((filter) => filter.name === lineName);
        return filter ? filter.color : '#EFEDED';
    };

    // 텍스트 색깔 계산 함수 (배경에 따른 가독성을 보장하기 위해)
    const getTextColor = (backgroundColor) => {
        const brightness =
            parseInt(backgroundColor.slice(1, 3), 16) * 0.299 +
            parseInt(backgroundColor.slice(3, 5), 16) * 0.587 +
            parseInt(backgroundColor.slice(5, 7), 16) * 0.114;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };



    // 필터 버튼 핸들러
    const handleFilterClick = (filterName) => {
        if (filterName === 'ALL') {
            if (activeFilters.length === filterButtons.length - 1) {
                // 모든 필터가 이미 선택되어 있는 경우, 전체 해제
                setActiveFilters([]);
            } else {
                // 모든 필터 선택
                setActiveFilters(filterButtons.filter(filter => filter.name !== 'ALL').map(filter => filter.name));
            }
        } else {
            setActiveFilters((prev) => {
                if (prev.includes(filterName)) {
                    // 이미 필터에 포함되어 있으면 제거
                    const updatedFilters = prev.filter((name) => name !== filterName);
                    if (updatedFilters.length === 0) {
                        // 마지막 필터를 해제하면 ALL 필터도 해제
                        return [];
                    }
                    return updatedFilters;
                } else {
                    // 필터에 추가
                    const updatedFilters = [...prev, filterName];
                    // 모든 필터가 선택되면 "ALL"도 활성화된 상태로 추가
                    if (updatedFilters.length === filterButtons.length - 1) {
                        return ['ALL', ...updatedFilters];
                    }
                    return updatedFilters;
                }
            });
        }
        setCurrentPage(1);
    };

    // 조회 API 요청
    useEffect(() => {
        // 향료 목록 가져오기
        dispatch(fetchSpices());
    }, [dispatch]);

    // 로그인한 사용자의 role 상태
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('auth'));
        if (storedUser && storedUser.role) {
            setRole(storedUser.role); // 사용자 역할 저장
        }
    }, []);


    // **핸들러들**

    // 검색
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };


    // 수정
    const handleEditButtonClick = (spice) => {

        setSelectedSpice(spice);
        setShowEditModal(true);
        setIsEditing(true); // 수정 모드 활성화
        setIsAdding(false); // 추가 모드 비활성화
    };

    // 성공 메시지
    const handleSuccessClose = () => {
        setSuccessMessage(''); // 메시지 초기화
        dispatch(fetchSpices()); // 최신 데이터 가져오기
    };

    // 이미지 선택
    const handleReset = () => {
        setImagePreview(null); // 파일 선택 영역 초기화
    };

    // 체크박스 선택
    const handleCheckboxToggle = () => setShowCheckboxes(!showCheckboxes);

    const handleCardCheckboxChange = (id) => {
        if (selectedCard === id) {
            setSelectedCard(null); // 같은 항목 클릭 시 선택 해제
        } else {
            setSelectedCard(id); // 새로운 항목 선택
        }
        console.log("현재 선택된 카드 ID:", id); // 디버깅 메시지
    };

    // 추가 버튼
    const handleAddButtonClick = () => {
        setSelectedSpice({
            name: null,
            description: null,
            brand: null,
            line: "Spicy",
            imageUrl: null,
        });

        setShowAddModal(true); // 모달 열기
        setIsAdding(true); // 추가 모드 활성화
        setIsEditing(false);   // 수정 모드 비활성화
    };

    // 삭제 버튼
    const handleDeleteButtonClick = () => {
        if (!selectedCard) {
            alert("삭제할 카드를 선택하세요.");
            return;
        }

        const spiceToDelete = spices.find((spice) => spice.id === selectedCard);
        setSelectedSpice(spiceToDelete); // 삭제할 카드 설정
        setIsDeleting(true); // 삭제 모달 활성화
    };

    // 삭제 버튼
    const handleDeleteConfirm = async () => {
        if (!selectedSpice) {
            console.error("선택된 향료 카드가 없습니다.");
            alert("삭제할 카드를 선택하세요.");
            return;
        }
        console.log("삭제 요청 ID:", selectedCard);

        try {
            // Redux를 통해 삭제 API 호출
            await dispatch(deleteSpices(selectedCard));
            setSuccessMessage(`${selectedSpice.name} 향료 카드가 삭제되었습니다!`);

            // 삭제 모달 닫기
            setIsDeleting(false);
            setSelectedSpice(null);
        } catch (error) {
            console.error("향료 삭제 실패:", error);
            alert("향료 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 삭제 모달창 닫기
    const handleDeleteClose = () => {
        setIsDeleting(false); // 삭제 모달 닫기
        setSelectedSpice(null);
        setSelectedCard(null); // 선택 초기화
    };


    // 추가 버튼, 수정 버튼
    const handleSubmit = async () => {
        // console.log("추가할 향료 데이터:", selectedSpice);
        if (!selectedSpice.name) {
            alert("향료의 영어 이름을 입력하세요.");
            return;
        }
        if (!selectedSpice.nameKr) {
            alert("향료의 한글 이름을 입력하세요.");
            return;
        }
        if (!selectedSpice.lineName) {
            alert("계열을 선택하세요.");
            return;
        }
        if (!selectedSpice.description) {
            alert("향료의 설명을 입력하세요.");
            return;
        }

        if (isAdding && selectedSpice) {
            const newSpiceData = {
                name: selectedSpice?.name || "",
                nameKr: selectedSpice?.nameKr || "",
                lineName: selectedSpice?.lineName || "Spicy",
                description: selectedSpice?.description || "",
                imageUrl: selectedSpice?.imageUrl || "https://cdn-icons-png.flaticon.com/512/8081/8081401.png", // 이미지 기본 설정
            };

            try {
                console.log("향료 추가 요청 데이터:", newSpiceData);
                const response = await dispatch(createSpices(newSpiceData));
                console.log("향료 추가 응답:", response);
                setSuccessMessage('향료가 성공적으로 추가되었습니다!');
                setShowAddModal(false); // 추가 모달 닫기
                setIsAdding(false);     // 추가 모드 비활성화
                handleReset();          // 입력 값 초기화
            } catch (error) {
                console.error("향료 추가 실패:", error);
                alert("향료 추가에 실패했습니다. 다시 시도해주세요.");
            }
        }

        // 수정 모드 처리
        if (isEditing && selectedSpice) {
            const updatedSpiceData = {
                ...selectedSpice,
            };
            console.log("수정하려는 향료 ID:", updatedSpiceData.id);
            try {
                await dispatch(modifySpices(updatedSpiceData));
                setSuccessMessage('향료가 성공적으로 수정되었습니다!');
                setShowEditModal(false); // 수정 모달 닫기
            } catch (error) {
                console.error("향료 수정 실패:", error);
                alert("향료 수정에 실패했습니다. 다시 시도해주세요.");
            }
        }

        // 공통 처리
        setIsEditing(false);
        setIsAdding(false);
        setSelectedSpice(null);
    };

    // 모달 상태들
    const closeModal = () => {
        setShowAddModal(false); // 추가 모달 닫기
        setShowEditModal(false); // 수정 모달 닫기
        setIsAdding(false);      // 추가 모드 비활성화
        setIsEditing(false);     // 수정 모드 비활성화
        setSelectedSpice(null); // 선택된 데이터 초기화
        setImagePreview(null);   // 이미지 미리보기 초기화
    };

    // 로딩창 - 데이터가 비어 있는 경우 처리
    if (!spices || spices.length === 0) {
        return <LoadingScreen message="향료를 불러오는 중..." />;
    }

    return (
        <>
            <img src="/images/logo.png" alt="로고 이미지" className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
            <div className="spices-container">
                <div className="spices-header">
                    <div className="spices-title">향료</div>
                    <form className="spices-search-bar">
                        <input
                            type="text"
                            className="spices-search-input"
                            placeholder="향료이름, 계열 검색 가능"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search
                            className="spices-list-search-icon"
                            size={20}
                            color="#333"
                        />
                    </form>
                </div>

                <div className="spices-list-divider-line" />

                {/* 상단 계열 필터 */}
                <div className="spices-filters">
                    {filterButtons.map((filter, index) => (
                        <button
                            key={index}
                            className={`spices-filter-item ${activeFilters.includes(filter.name) ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeFilters.includes(filter.name) ? filter.color : '#FFFFFF', // 필터 색상 설정
                                color: getTextColor(activeFilters.includes(filter.name) ? filter.color : '#FFFFFF'), // 텍스트 색상 계산
                                borderColor: 'black', // 테두리 색상 지정
                            }}
                            onClick={() => handleFilterClick(filter.name)}
                        >
                            {filter.name}
                        </button>
                    ))}
                    {role === 'ADMIN' && (
                        <div className="admin-spices-controls">
                            <button className="admin-spices-add-button" onClick={handleAddButtonClick}>+</button>
                            <button className="admin-spices-select-button" onClick={handleCheckboxToggle}>✓</button>
                            <button onClick={handleDeleteButtonClick} className="admin-spices-delete-button">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    )}

                </div>

                <div className="spices-items-container">
                    {filteredSpices
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((spice) => (
                            <div key={spice.id} className="spice-item-card">
                                <div className="spices-item-card">
                                    {/* 카드 앞면 */}
                                    <div className="spices-item-front">
                                        {showCheckboxes && (
                                            <input
                                                type="checkbox"
                                                className="admin-spices-card-select-circle"
                                                name={`spice-select-${spice.id}`}
                                                checked={selectedCard === spice.id}
                                                onChange={() => handleCardCheckboxChange(spice.id)}
                                            />
                                        )}

                                        {/* Edit 아이콘 버튼 */}
                                        {role === 'ADMIN' && (
                                            <>
                                                <button
                                                    className="admin-spices-edit-button"
                                                    onClick={() => handleEditButtonClick(spice)} // 수정 버튼 클릭 시 실행
                                                >
                                                    <Edit size={16} color="#333" /> {/* Edit 아이콘 사용 */}
                                                </button>
                                            </>
                                        )}

                                        <img
                                            src={spice.imageUrl}
                                            alt={spice.name}
                                            className="spice-item-image"
                                        />
                                        <div className="spices-name"><strong>{spice.name}</strong></div>
                                        <div className="spices-nameKr">{spice.nameKr}</div>
                                        <div className="spices-divider-small"></div>
                                        <div className="spices-category">{spice.lineName}</div>
                                    </div>

                                    {/* 카드 뒷면 */}
                                    <div className="spices-item-back">
                                        <div className="spice-description">
                                            <p>{spice.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="spices-pagination">
                    <button
                        className={`spices-pagination-button ${paginationGroup === 1 ? 'disabled' : ''}`}
                        onClick={handlePreviousGroup}
                        disabled={paginationGroup === 0}
                    >
                        {'<<'}
                    </button>

                    <button
                        className={`spices-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </button>

                    {Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => (
                        <button
                            key={index + pageStart}
                            className={`spices-pagination-button ${currentPage === index + pageStart ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + pageStart)}
                        >
                            {index + pageStart}
                        </button>
                    ))}

                    <button
                        className={`spices-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </button>

                    <button
                        className={`spices-pagination-button ${pageEnd === totalPages ? 'disabled' : ''}`}
                        onClick={handleNextGroup}
                        disabled={pageEnd === totalPages}
                    >
                        {'>>'}
                    </button>
                </div>

                {showAddModal && (
                    <div className="admin-spices-modal-backdrop">
                        <div className="admin-spices-modal-container">
                            <h2 className="admin-spices-modal-title">향료 카드 추가하기</h2>
                            <div className="admin-spices-modal-row">
                                <label className="spices-form-label">향료명(영어)</label>
                                <input
                                    className="admin-spices-modal-row-name"
                                    type="text"
                                    value={selectedSpice?.name || ""}
                                    onChange={(e) =>
                                        setSelectedSpice((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="향료 이름(영어)을 입력하세요"
                                    required
                                />
                            </div>
                            <div className="admin-spices-modal-row">
                                <label className="spices-form-label">향료명(한글)</label>
                                <input
                                    className="admin-spices-modal-row-name-Kr"
                                    type="text"
                                    value={selectedSpice?.nameKr || ""}
                                    onChange={(e) =>
                                        setSelectedSpice((prev) => ({ ...prev, nameKr: e.target.value }))
                                    }
                                    placeholder="향료 이름(한글)을 입력하세요"
                                    required
                                />
                            </div>
                            <div className="admin-spices-modal-row">
                                <label className="spices-form-label">계열</label>
                                <select
                                    className="admin-spices-modal-row-spices"
                                    value={selectedSpice?.lineName || ""} // 상태에서 line 값을 가져옴
                                    onChange={(e) =>
                                        setSelectedSpice((prev) => ({
                                            ...prev,
                                            lineName: e.target.value, // 선택한 값을 상태에 업데이트
                                        }))
                                    }
                                    required
                                >
                                    <option value="Spicy">Spicy</option>
                                    <option value="Fruity">Fruity</option>
                                    <option value="Citrus">Citrus</option>
                                    <option value="Green">Green</option>
                                    <option value="Aldehyde">Aldehyde</option>
                                    <option value="Aquatic">Aquatic</option>
                                    <option value="Fougere">Fougere</option>
                                    <option value="Gourmand">Gourmand</option>
                                    <option value="Woody">Woody</option>
                                    <option value="Oriental">Oriental</option>
                                    <option value="Floral">Floral</option>
                                    <option value="Musk">Musk</option>
                                    <option value="Powdery">Powdery</option>
                                    <option value="Amber">Amber</option>
                                    <option value="Tobacco Leather">Tobacco Leather</option>
                                </select>
                            </div>
                            <div className="admin-spices-modal-row-description">
                                <label className="spices-form-label">향료 설명</label>
                                <textarea
                                    className="admin-spices-modal-row-description-input"
                                    value={selectedSpice?.description || ""}
                                    onChange={(e) =>
                                        setSelectedSpice((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    placeholder="향료 설명을 입력하세요"
                                    required
                                ></textarea>
                            </div>
                            <div className="admin-spices-modal-row">
                                <label className="admin-spices-modal-row-image-label">이미지</label>
                                <div
                                    className="admin-spices-image-upload"
                                    onClick={() => {
                                        if (!editingImage) setEditingImage(true);
                                    }}
                                >
                                    {editingImage ? (
                                        <input
                                            type="text"
                                            className="admin-spices-image-url-input"
                                            placeholder="이미지 URL을 입력하세요"
                                            value={selectedSpice?.imageUrl || "https://example.com/default-image.jpg"}
                                            onChange={(e) => {
                                                const newUrl = e.target.value;
                                                setSelectedSpice((prev) => ({
                                                    ...prev,
                                                    imageUrl: newUrl, // URL 입력값으로 imageUrl 수정
                                                }));
                                            }}
                                            onBlur={() => setEditingImage(false)} // 입력 필드 외 클릭 시 수정 모드 해제
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") setEditingImage(false); // Enter 키로 수정 모드 해제
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {imagePreview || selectedSpice?.imageUrl ? (
                                                <img
                                                    src={imagePreview || selectedSpice?.imageUrl}
                                                    alt="미리보기"
                                                    className="admin-spices-image-preview"
                                                />
                                            ) : (
                                                <div className="admin-spices-placeholder">+</div>
                                            )}
                                        </>
                                    )}
                                    <input
                                        id="admin-spices-file-input"
                                        type="file"
                                        className="admin-spices-file-input"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImagePreview(reader.result); // 미리보기 이미지 설정
                                                    setSelectedSpice((prev) => ({
                                                        ...prev,
                                                        imageUrl: reader.result, // 이미지 URL 업데이트
                                                    }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="admin-spices-modal-actions">
                                <button
                                    onClick={() => {
                                        handleSubmit(); handleReset();
                                    }}
                                    className="admin-spices-save-button"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="admin-spices-cancel-button"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {showEditModal && selectedSpice && (
                    <div className="admin-spices-modal-backdrop">
                        <div className="admin-spices-modal-container">
                            <h2 className="admin-spices-modal-title">향료 카드 수정하기</h2>
                            <div className="admin-spices-modal-row">
                                <label className="spices-form-label">향료명</label>
                                <input
                                    type="text"
                                    className="admin-spices-modal-row-name"
                                    value={selectedSpice?.name || ""}
                                    onChange={(e) =>
                                        setSelectedSpice((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="향료 이름 수정"
                                />
                            </div>
                            <div className="admin-spices-modal-row">
                                <label className="spices-form-label">향료 이름(한글)</label>
                                <input
                                    type="text"
                                    className="admin-spices-modal-row-brand"
                                    value={selectedSpice?.nameKr || ""}
                                    onChange={(e) =>
                                        setSelectedSpice((prev) => ({ ...prev, nameKr: e.target.value }))
                                    }
                                    placeholder="향료 이름(한글) 수정"
                                />
                            </div>
                            <div className="admin-spices-modal-row">
                                <label className="spices-form-label">계열</label>
                                <select
                                    className="admin-spices-modal-row-spices"
                                    value={selectedSpice?.lineName || ""} // 상태에서 line 값을 가져옴
                                    onChange={(e) =>
                                        setSelectedSpice((prev) => ({
                                            ...prev,
                                            lineName: e.target.value, // 선택한 값을 상태에 업데이트
                                        }))
                                    }
                                    required
                                >
                                    <option value="Spicy">Spicy</option>
                                    <option value="Fruity">Fruity</option>
                                    <option value="Citrus">Citrus</option>
                                    <option value="Green">Green</option>
                                    <option value="Aldehyde">Aldehyde</option>
                                    <option value="Aquatic">Aquatic</option>
                                    <option value="Fougere">Fougere</option>
                                    <option value="Gourmand">Gourmand</option>
                                    <option value="Woody">Woody</option>
                                    <option value="Oriental">Oriental</option>
                                    <option value="Floral">Floral</option>
                                    <option value="Musk">Musk</option>
                                    <option value="Powdery">Powdery</option>
                                    <option value="Amber">Amber</option>
                                    <option value="Tobacco Leather">Tobacco Leather</option>
                                </select>
                            </div>
                            <div className="admin-spices-modal-row">
                                <label className="spices-form-label">향료 설명</label>
                                <textarea
                                    className="admin-spices-modal-row-description"
                                    value={selectedSpice?.description || ""}
                                    onChange={(e) =>
                                        setSelectedSpice((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="향료 설명 수정"
                                />
                            </div>
                            <div className="admin-spices-modal-row2">
                                <label className="admin-spices-modal-row-image-label">이미지</label>
                                <div
                                    className="admin-spices-image-upload"
                                    onClick={() => {
                                        if (!editingImage) setEditingImage(true);
                                    }}
                                >
                                    {editingImage ? (
                                        <input
                                            type="text"
                                            className="admin-spices-image-url-input"
                                            placeholder="이미지 URL을 입력하세요"
                                            value={selectedSpice?.imageUrl || ""}
                                            onChange={(e) => {
                                                const newUrl = e.target.value;
                                                setSelectedSpice((prev) => ({
                                                    ...prev,
                                                    imageUrl: newUrl, // URL 입력값으로 imageUrl 수정
                                                }));
                                            }}
                                            onBlur={() => setEditingImage(false)} // 입력 필드 외 클릭 시 수정 모드 해제
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") setEditingImage(false); // Enter 키로 수정 모드 해제
                                            }}
                                        />
                                    ) : (
                                        // 이미지 미리보기 또는 기본 플러스 버튼
                                        <>
                                            {imagePreview || selectedSpice?.imageUrl ? (
                                                <img
                                                    src={imagePreview || selectedSpice?.imageUrl}
                                                    alt="미리보기"
                                                    className="admin-spices-image-preview"
                                                />
                                            ) : (
                                                <div className="admin-spices-placeholder">+</div>
                                            )}
                                        </>
                                    )}
                                    {/* 파일 업로드 input */}
                                    <input
                                        id="admin-spices-file-input-edit"
                                        type="file"
                                        className="admin-spices-file-input"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImagePreview(reader.result); // 미리보기 이미지 설정
                                                    setSelectedSpice((prev) => ({
                                                        ...prev,
                                                        imageUrl: reader.result, // 이미지 URL 업데이트
                                                    }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="admin-spices-modal-actions">
                                <button
                                    onClick={() => {
                                        handleSubmit(); handleReset();
                                    }}
                                    className="admin-spices-save-button"
                                >
                                    저장
                                </button>
                                <button onClick={closeModal} className="admin-spices-cancel-button">
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
                            <h2 className="admin-spices-modal-title-delete">- 향료 카드 삭제 -</h2>
                            <p>향료 카드를 삭제하시겠습니까?</p>
                            <div className="admin-spices-modal-actions-delete">
                                <button onClick={handleDeleteConfirm} className="admin-spices-confirm-button">확인</button>
                                <button onClick={handleDeleteClose} className="admin-spices-cancel-button-delete">취소</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 성공 메시지 모달 */}
                {successMessage && (
                    <div className="admin-spices-modal-backdrop">
                        <div className="admin-spices-modal-container-success">
                            <p className="admin-spices-success-message-success">{successMessage}</p>
                            <div className="admin-spices-modal-actions-success">
                                <button onClick={handleSuccessClose} className="admin-spices-cancel-button-success">
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

export default SpicesList;
