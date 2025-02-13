import { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createSpices, modifySpices, deleteSpices, fetchSpices } from '../../../module/SpicesModule';

const useSpicesState = (spices) => {
    const dispatch = useDispatch();

    // 기본 상태 관리
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationGroup, setPaginationGroup] = useState(0);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    // 초기 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                await dispatch(fetchSpices());
                const storedUser = JSON.parse(localStorage.getItem('auth'));
                if (storedUser?.role) {
                    setRole(storedUser.role);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [dispatch]);

    // 검색 핸들러
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // 필터 핸들러
    const handleFilterClick = (filter) => {
        setActiveFilters(prev => 
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
        setCurrentPage(1);
    };

    // 체크박스 토글 핸들러
    const handleCheckboxToggle = () => {
        setShowCheckboxes(prev => !prev);
        setSelectedCard(null);
    };

    // 카드 체크박스 변경 핸들러
    const handleCardCheckboxChange = (id) => {
        setSelectedCard(prev => prev === id ? null : id);
    };

    // 추가 버튼 클릭 핸들러
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

    // 수정 버튼 클릭 핸들러
    const handleEditButtonClick = (spice) => {
        setSelectedSpice(spice);
        setShowEditModal(true);
        setIsEditing(true);
        setIsAdding(false);
    };

    // 삭제 버튼 클릭 핸들러
    const handleDeleteButtonClick = () => {
        if (!selectedCard) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }
        setIsDeleting(true);
    };

    // 모달 닫기 핸들러
    const handleModalClose = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedSpice(null);
        setIsAdding(false);
        setIsEditing(false);
        setImagePreview(null);
    };

    // 성공 메시지 닫기 핸들러
    const handleSuccessClose = () => {
        setSuccessMessage('');
    };

    // 페이지 변경 핸들러
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

    // 필터링된 향료 목록 계산
    const filteredSpices = useMemo(() => {
        return Array.isArray(spices) ? spices.filter((spice) => {
            const nameEn = spice?.nameEn || '';
            const nameKr = spice?.nameKr || '';
            const lineName = spice?.lineName || '';
            const description = spice?.description || '';

            const matchesSearch =
                nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                nameKr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                activeFilters.length === 0 ||
                activeFilters.includes(lineName);

            return matchesSearch && matchesFilter;
        }) : [];
    }, [spices, searchTerm, activeFilters]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredSpices.length / itemsPerPage);

    // 제출 핸들러
    const handleSubmit = async (formData) => {
        if (!formData.nameEn || !formData.nameKr || !formData.lineName || !formData.description) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        setIsLoading(true);
        try {
            if (isAdding) {
                await dispatch(createSpices(formData));
                setSuccessMessage('향료가 성공적으로 추가되었습니다!');
                setShowAddModal(false);
            } else if (isEditing) {
                await dispatch(modifySpices(formData));
                setSuccessMessage('향료가 성공적으로 수정되었습니다!');
                setShowEditModal(false);
            }
            handleModalClose();
        } catch (error) {
            console.error("작업 실패:", error);
            alert("작업에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    // 삭제 확인 핸들러
    const handleDeleteConfirm = async () => {
        if (!selectedCard) {
            alert("삭제할 카드를 선택하세요.");
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(deleteSpices(selectedCard));
            setSuccessMessage('향료가 성공적으로 삭제되었습니다!');
            setIsDeleting(false);
            setSelectedCard(null);
            setSelectedSpice(null);
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    // 상태 초기화 핸들러
    const handleReset = () => {
        setImagePreview(null);
        setSelectedSpice(null);
        setIsAdding(false);
        setIsEditing(false);
        setShowAddModal(false);
        setShowEditModal(false);
    };

    return {
        // 상태 반환
        searchTerm,
        activeFilters,
        currentPage,
        showCheckboxes,
        selectedCard,
        showAddModal,
        showEditModal,
        successMessage,
        isDeleting,
        role,
        filteredSpices,
        itemsPerPage,
        selectedSpice,
        isEditing,
        isLoading,
        imagePreview,
        paginationGroup,
        editingImage,
        isAdding,

        // 상태 설정 함수 반환
        setSearchTerm,
        setActiveFilters,
        setCurrentPage,
        setShowCheckboxes,
        setSelectedCard,
        setShowAddModal,
        setShowEditModal,
        setSelectedSpice,
        setSuccessMessage,
        setIsDeleting,
        setIsEditing,
        setImagePreview,
        setPaginationGroup,
        setEditingImage,
        setIsAdding,

        // 핸들러 반환
        handleSearch,
        handleFilterClick,
        handleCheckboxToggle,
        handleCardCheckboxChange,
        handleAddButtonClick,
        handleEditButtonClick,
        handleDeleteButtonClick,
        handleDeleteConfirm,
        handleSuccessClose,
        handleModalClose,
        handleSubmit,
        handlePageChange,
        handleReset,
        totalPages,
    };
};

export default useSpicesState;