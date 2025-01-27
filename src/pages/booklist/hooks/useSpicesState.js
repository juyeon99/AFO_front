import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { createSpices, modifySpices, deleteSpices } from '../../../module/SpicesModule';

/**
 * 향료 관리를 위한 커스텀 훅
 * @param {Array} spices - 향료 데이터 배열
 */

const useSpicesState = (spices) => {
    const dispatch = useDispatch();
    // 기본 상태 관리
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationGroup, setPaginationGroup] = useState(0);

    // UI 상태 관리
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSpice, setSelectedSpice] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // 작업 상태 관리
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingImage, setEditingImage] = useState(false);

    // 페이지당 표시할 아이템 수
    const itemsPerPage = 12;

    // 필터링된 향료 목록 계산
    const filteredSpices = useMemo(() => {
        return Array.isArray(spices) ? spices.filter((spice) => {
            // 각 필드에서 검색어 매칭 확인
            const nameEn = spice?.nameEn || '';
            const nameKr = spice?.nameKr || '';
            const lineName = spice?.lineName || '';
            const description = spice?.description || '';

            // 검색어 매칭 여부
            const matchesSearch =
                nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                nameKr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                description.toLowerCase().includes(searchTerm.toLowerCase());

            // 필터 매칭 여부
            const matchesFilter =
                activeFilters.length === 0 ||
                activeFilters.includes(lineName);

            return matchesSearch && matchesFilter;
        }) : [];
    }, [spices, searchTerm, activeFilters]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredSpices.length / itemsPerPage);

    /**
     * 페이지 변경 핸들러
     * @param {number} page - 이동할 페이지 번호
     */

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const groupStart = paginationGroup * 10 + 1;
        const groupEnd = groupStart + 9;
        if (page < groupStart) {
            setPaginationGroup(paginationGroup - 1);
        } else if (page > groupEnd) {
            setPaginationGroup(paginationGroup + 1);
        }
    };

        /**
     * 향료 추가/수정 제출 핸들러
     * @param {Object} formData - 제출할 향료 데이터
     */

    const handleSubmit = async (formData) => {
        // 필수 필드 검증
        if (!formData.nameEn || !formData.nameKr || !formData.lineName || !formData.description) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        try {
            if (isAdding) {
                // 새 향료 추가
                await dispatch(createSpices(formData));
                setSuccessMessage('향료가 성공적으로 추가되었습니다!');
                setShowAddModal(false);
            } else if (isEditing) {
                // 기존 향료 수정
                await dispatch(modifySpices(formData));
                setSuccessMessage('향료가 성공적으로 수정되었습니다!');
                setShowEditModal(false);
            }
            handleReset();
        } catch (error) {
            console.error("작업 실패:", error);
            alert("작업에 실패했습니다. 다시 시도해주세요.");
        }
    };

    /**
     * 향료 삭제 확인 핸들러
     */

    const handleDeleteConfirm = async () => {
        if (!selectedCard) {
            alert("삭제할 카드를 선택하세요.");
            return;
        }

        try {
            await dispatch(deleteSpices(selectedCard));
            setSuccessMessage('향료가 성공적으로 삭제되었습니다!');
            setIsDeleting(false);
            setSelectedCard(null);
            setSelectedSpice(null);
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
        setSelectedSpice(null);
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
        selectedSpice,
        setSelectedSpice,
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
        filteredSpices,
        totalPages,
        itemsPerPage,
        handlePageChange,
        handleSubmit,
        handleDeleteConfirm,
        handleReset
    };
};

export default useSpicesState;