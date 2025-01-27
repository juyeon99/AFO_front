import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Search } from 'lucide-react';
import { fetchPerfumes, selectPerfumes } from '../../module/PerfumeModule';
import PerfumeFilters from '../../components/perfumes/PerfumeFilters';
import PerfumeCard from '../../components/perfumes/PerfumeCard';
import PerfumeModal from '../../components/perfumes/PerfumeModal';
import Pagination from '../../components/perfumes/Pagination';
import usePerfumeState from './hooks/usePerfumeState';
import styles from '../../css/perfumes/PerfumeList.module.css';

/**
 * 향수 목록 페이지 컴포넌트
 */
const PerfumeList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const perfumes = useSelector(selectPerfumes);
    const [role, setRole] = useState(null);

    // 커스텀 훅에서 상태와 핸들러 가져오기
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
        selectedPerfume,     // 선택된 향수 데이터
        setSelectedPerfume,  // 향수 선택 함수
        successMessage,      // 성공 메시지
        setSuccessMessage,   // 성공 메시지 설정 함수
        isAdding,           // 추가 모드 여부
        setIsAdding,        // 추가 모드 설정 함수
        isEditing,          // 수정 모드 여부
        setIsEditing,       // 수정 모드 설정 함수
        isDeleting,         // 삭제 모드 여부
        setIsDeleting,      // 삭제 모드 설정 함수
        filteredPerfumes,   // 필터링된 향수 목록
        totalPages,         // 전체 페이지 수
        itemsPerPage,       // 페이지당 아이템 수
        handlePageChange,    // 페이지 변경 핸들러
        handleSubmit,       // 제출 핸들러
        handleDeleteConfirm, // 삭제 확인 핸들러
        handleReset         // 상태 초기화 핸들러
    } = usePerfumeState(perfumes);

    // 컴포넌트 마운트 시 향수 데이터 로드 및 사용자 권한 확인
    useEffect(() => {
        dispatch(fetchPerfumes());
        const storedUser = JSON.parse(localStorage.getItem('auth'));
        if (storedUser?.role) {
            setRole(storedUser.role);
        }
    }, [dispatch]);

    // 새 향수 추가 버튼 클릭 핸들러
    const handleAddButtonClick = () => {
        setSelectedPerfume({
            name: '',
            brand: '',
            description: '',
            imageUrl: null,
        });
        setShowAddModal(true);
        setIsAdding(true);
        setIsEditing(false);
    };

    // 향수 수정 버튼 클릭 핸들러
    const handleEditButtonClick = (perfume) => {
        setSelectedPerfume(perfume);
        setShowEditModal(true);
        setIsEditing(true);
        setIsAdding(false);
    };

    // 향수 삭제 버튼 클릭 핸들러
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
        setSelectedPerfume(null);
        handleReset();
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
                    <div className={styles.title}>향수</div>
                    <div className={styles.searchArea}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="향수 이름, 브랜드 검색 가능"
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
                <PerfumeFilters
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                />
                <div className={styles.divider}></div>

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
                        {showCheckboxes && (
                            <button onClick={handleDeleteButtonClick} className={styles.deleteButton}>
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* 향수 카드 그리드 */}
                <div className={styles.cardContainer}>
                    {filteredPerfumes
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((perfume) => (
                            <PerfumeCard
                                key={perfume.id}
                                perfume={perfume}
                                isAdmin={role === 'ADMIN'}
                                showCheckboxes={showCheckboxes}
                                selected={selectedCard === perfume.id}
                                onSelect={() => setSelectedCard(perfume.id)}
                                onEdit={() => handleEditButtonClick(perfume)}
                            />
                        ))}
                </div>

                {/* 페이지네이션 */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                {/* 모달 컴포넌트들 */}
                {(showAddModal || showEditModal) && (
                    <PerfumeModal
                        show={showAddModal || showEditModal}
                        onClose={closeModal}
                        perfume={selectedPerfume}
                        onSubmit={handleSubmit}
                        isEditing={isEditing}
                    />
                )}

                {/* 삭제 확인 모달 */}
                {isDeleting && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.deleteModal}>
                            <h2>향수 카드 삭제</h2>
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

export default PerfumeList;