import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Search } from 'lucide-react';
import { fetchSpices, selectSpices } from '../../module/SpicesModule';
import SpicesFilters from '../../components/spices/SpicesFilters';
import SpicesCard from '../../components/spices/SpicesCard';
import SpicesModal from '../../components/spices/SpicesModal';
import Pagination from '../../components/spices/Pagination';
import useSpicesState from './hooks/useSpicesState';
import styles from '../../css/spices/SpicesList.module.css';

const SpicesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spices = useSelector(selectSpices);
    const [role, setRole] = useState(null);

    const {
        searchTerm,          // 검색어
        setSearchTerm,       // 검색어 설정 함수
        activeFilters,       // 활성화된 필터 배열
        setActiveFilters,    // 필터 설정 함수
        currentPage,         // 현재 페이지
        showCheckboxes,      // 체크박스 표시 여부
        setShowCheckboxes,   // 체크박스 표시 설정 함수
        selectedCard,        // 선택된 카드 ID
        setSelectedCard,     // 카드 선택 함수
        showAddModal,        // 추가 모달 표시 여부
        setShowAddModal,     // 추가 모달 표시 설정 함수
        showEditModal,       // 수정 모달 표시 여부
        setShowEditModal,    // 수정 모달 표시 설정 함수
        selectedSpice,       // 선택된 향료 데이터
        setSelectedSpice,    // 향료 선택 함수
        successMessage,      // 성공 메시지
        setSuccessMessage,   // 성공 메시지 설정 함수
        isAdding,           // 추가 모드 여부
        setIsAdding,        // 추가 모드 설정 함수
        isEditing,          // 수정 모드 여부
        setIsEditing,       // 수정 모드 설정 함수
        isDeleting,         // 삭제 모드 여부
        setIsDeleting,      // 삭제 모드 설정 함수
        filteredSpices,     // 필터링된 향료 목록
        totalPages,         // 전체 페이지 수
        itemsPerPage,       // 페이지당 아이템 수
        handlePageChange,    // 페이지 변경 핸들러
        handleSubmit,       // 제출 핸들러
        handleDeleteConfirm, // 삭제 확인 핸들러
        handleReset         // 상태 초기화 핸들러
    } = useSpicesState(spices);

    // 컴포넌트 마운트 시 향료 데이터 로드 및 사용자 권한 확인
    useEffect(() => {
        dispatch(fetchSpices());
        const storedUser = JSON.parse(localStorage.getItem('auth'));
        if (storedUser?.role) {
            setRole(storedUser.role);
        }
    }, [dispatch]);

    // 새 향료 추가 버튼 클릭 핸들러
    const handleAddButtonClick = () => {
        setSelectedSpice({
            nameEn: '',
            nameKr: '',
            lineName: 'Spicy',
            description: '',
            imageUrl: null,
        });
        setShowAddModal(true);
        setIsAdding(true);
        setIsEditing(false);
    };

    // 향료 수정 버튼 클릭 핸들러
    const handleEditButtonClick = (spice) => {
        setSelectedSpice(spice);
        setShowEditModal(true);
        setIsEditing(true);
        setIsAdding(false);
    };

    // 향료 삭제 버튼 클릭 핸들러
    const handleDeleteButtonClick = () => {
        if (!selectedCard) {
            alert("삭제할 카드를 선택하세요.");
            return;
        }
        setIsDeleting(true);
    };

    // 모달 닫기 핸들러
    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setIsAdding(false);
        setIsEditing(false);
        setSelectedSpice(null);
        handleReset();
    };

    const handleEditClick = (spice) => {
        setSelectedSpice(spice);
        setIsEditing(true);
        setShowEditModal(true);
    };

    return (
        <>
            <div className={styles.container}>
                {/* 로고 이미지 */}
                <img
                    src="/images/logo.png"
                    alt="방향"
                    className={styles.logo}
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                />
                {/* 헤더 영역 (제목 + 검색) */}
                <div className={styles.header}>
                    <div className={styles.title}>향료</div>
                    <div className={styles.searchArea}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="향료 이름, 계열 검색 가능"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search
                            className={styles.searchIcon}
                            size={20}
                            color="#333"
                        />
                    </div>
                </div>
                
                {/* 필터 컴포넌트 */}
                <div>
                <SpicesFilters
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                />
                 {/* 관리자 컨트롤 버튼들 */}
                {role === 'ADMIN' && (
                    <div className={styles.adminControls}>
                        <button onClick={handleAddButtonClick} className={styles.addButton}>
                            +
                        </button>
                        <button
                            onClick={() => setShowCheckboxes(!showCheckboxes)}
                            className={styles.selectButton}
                        >
                            ✓
                        </button>
                        <button onClick={handleDeleteButtonClick} className={styles.deleteButton}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
                </div>

                <div className={styles.divider}></div>

                {/* 향료 카드 그리드 */}
                <div className={styles.cardContainer}>
                    {filteredSpices
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((spice) => (
                            <div key={spice.id} className={styles.card}>
                                <SpicesCard
                                    spice={spice}
                                    isAdmin={role === 'ADMIN'}
                                    showCheckboxes={showCheckboxes}
                                    selected={selectedCard === spice.id}
                                    onSelect={() => {
                                        if (selectedCard === spice.id) {
                                            setSelectedCard(null);
                                        } else {
                                            setSelectedCard(spice.id);
                                        }
                                    }}
                                    onEdit={() => handleEditClick(spice)}
                                />
                            </div>
                        ))}
                </div>
                
                {/* 페이지네이션 */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                {/* 추가/수정 모달 */}
                {(showAddModal || showEditModal) && (
                    <SpicesModal
                        show={showAddModal || showEditModal}
                        onClose={closeModal}
                        spice={selectedSpice}
                        onSubmit={handleSubmit}
                        isEditing={isEditing}
                    />
                )}

                {/* 삭제 확인 모달 */}
                {isDeleting && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.deleteModal}>
                            <h2>향료 카드 삭제</h2>
                            <p>정말로 삭제하시겠습니까?</p>
                            <div className={styles.modalActions}>
                                <button onClick={handleDeleteConfirm}>확인</button>
                                <button onClick={() => setIsDeleting(false)}>취소</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 성공 메시지 모달 */}
                {successMessage && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.successModal}>
                            <p>{successMessage}</p>
                            <button onClick={() => setSuccessMessage('')}>확인</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SpicesList;