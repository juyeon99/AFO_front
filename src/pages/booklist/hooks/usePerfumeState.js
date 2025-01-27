import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { createPerfume, modifyPerfume, deletePerfume } from '../../../module/PerfumeModule';

/**
 * 향수 관리를 위한 커스텀 훅
 * @param {Array} perfumes - 향수 데이터 배열
 */
const usePerfumeState = (perfumes) => {
    const dispatch = useDispatch();
    
    // 기본 상태 관리
    const [searchTerm, setSearchTerm] = useState('');           // 검색어
    const [activeFilters, setActiveFilters] = useState([]);     // 활성화된 필터
    const [currentPage, setCurrentPage] = useState(1);          // 현재 페이지
    const [paginationGroup, setPaginationGroup] = useState(0);  // 페이지네이션 그룹
    
    // UI 상태 관리
    const [showCheckboxes, setShowCheckboxes] = useState(false);// 체크박스 표시 여부
    const [selectedCard, setSelectedCard] = useState(null);     // 선택된 카드
    const [showAddModal, setShowAddModal] = useState(false);    // 추가 모달 표시
    const [showEditModal, setShowEditModal] = useState(false);  // 수정 모달 표시
    const [selectedPerfume, setSelectedPerfume] = useState(null);// 선택된 향수
    const [imagePreview, setImagePreview] = useState(null);     // 이미지 미리보기
    const [successMessage, setSuccessMessage] = useState('');   // 성공 메시지
    
    // 작업 상태 관리
    const [isAdding, setIsAdding] = useState(false);           // 추가 모드
    const [isEditing, setIsEditing] = useState(false);         // 수정 모드
    const [isDeleting, setIsDeleting] = useState(false);       // 삭제 모드
    const [editingImage, setEditingImage] = useState(false);   // 이미지 수정 모드

    // 페이지당 표시할 아이템 수
    const itemsPerPage = 12;

    // 필터링된 향수 목록 계산
    const filteredPerfumes = useMemo(() => {
        return Array.isArray(perfumes) ? perfumes.filter((perfume) => {
            const name = perfume?.name || '';
            const brand = perfume?.brand || '';
            const description = perfume?.description || '';

            // 검색어 매칭 여부
            const matchesSearch =
                name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                description.toLowerCase().includes(searchTerm.toLowerCase());

            // 필터 매칭 여부
            const matchesFilter =
                activeFilters.length === 0 ||
                activeFilters.includes(brand);

            return matchesSearch && matchesFilter;
        }) : [];
    }, [perfumes, searchTerm, activeFilters]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);

    /**
     * 페이지 변경 핸들러
     * @param {number} pageNumber - 새로운 페이지 번호
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    /**
     * 폼 제출 핸들러
     * @param {Object} formData - 제출할 향수 데이터
     */
    const handleSubmit = async (formData) => {
        try {
            if (isAdding) {
                await dispatch(createPerfume(formData));
                setSuccessMessage('향수가 성공적으로 추가되었습니다!');
            } else if (isEditing) {
                await dispatch(modifyPerfume(formData));
                setSuccessMessage('향수가 성공적으로 수정되었습니다!');
            }
            handleReset();
        } catch (error) {
            console.error("제출 실패:", error);
            alert("작업에 실패했습니다. 다시 시도해주세요.");
        }
    };

    /**
     * 삭제 확인 핸들러
     */
    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deletePerfume(selectedCard));
            setSuccessMessage('향수가 성공적으로 삭제되었습니다!');
            setIsDeleting(false);
            setSelectedCard(null);
            setSelectedPerfume(null);
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    /**
     * 상태 초기화 핸들러
     */
    const handleReset = () => {
        setImagePreview(null);
        setSelectedPerfume(null);
        setIsAdding(false);
        setIsEditing(false);
        setShowAddModal(false);
        setShowEditModal(false);
    };

    return {
        searchTerm,
        setSearchTerm,
        activeFilters,
        setActiveFilters,
        currentPage,
        setCurrentPage,
        paginationGroup,
        setPaginationGroup,
        showCheckboxes,
        setShowCheckboxes,
        selectedCard,
        setSelectedCard,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        selectedPerfume,
        setSelectedPerfume,
        imagePreview,
        setImagePreview,
        successMessage,
        setSuccessMessage,
        isAdding,
        setIsAdding,
        isEditing,
        setIsEditing,
        isDeleting,
        setIsDeleting,
        editingImage,
        setEditingImage,
        filteredPerfumes,
        totalPages,
        itemsPerPage,
        handlePageChange,
        handleSubmit,
        handleDeleteConfirm,
        handleReset
    };
};

export default usePerfumeState;