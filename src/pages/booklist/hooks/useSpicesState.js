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
    const [error, setError] = useState(null);

    // UI 상태 관리
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSpice, setSelectedSpice] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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
                handleError("데이터 로드 실패");
                console.error('Error loading spices:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [dispatch]);

    // 검색어와 필터에 따른 향료 필터링
    const filteredSpices = useMemo(() => {
        if (!Array.isArray(spices)) return [];

        return spices.filter(spice => {
            const matchesSearch = searchTerm === '' ||
                spice.nameKr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                spice.nameEn.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilters = activeFilters.length === 0 ||
                activeFilters.includes(spice.lineName);

            return matchesSearch && matchesFilters;
        });
    }, [spices, searchTerm, activeFilters]);

    // 현재 페이지의 향료 목록 계산
    const currentSpices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSpices.slice(startIndex, endIndex);
    }, [filteredSpices, currentPage, itemsPerPage]);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredSpices.length / itemsPerPage);

    // 에러 핸들러
    const handleError = (errorMessage) => {
        setError(errorMessage);
        setTimeout(() => setError(null), 3000);
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = (imageUrl) => {
        setImagePreview(imageUrl);
        setSelectedSpice(prev => ({
            ...prev,
            imageUrl: imageUrl
        }));
    };

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
            contentKr: '',
            imageUrl: null,
            imageUrlList: []
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

    // 폼 제출 핸들러
    const handleSubmit = async (formData) => {
        if (!formData.nameEn || !formData.nameKr || !formData.contentKr) {
            handleError("모든 필수 항목을 입력해주세요.");
            return;
        }
    
        try {
            if (isAdding) {
                await dispatch(createSpices({
                    nameEn: formData.nameEn,
                    nameKr: formData.nameKr,
                    lineName: formData.lineName,
                    contentKr: formData.contentKr,
                    imageUrlList: formData.imageUrlList || []
                }));
                setSuccessMessage('향료 추가가 완료되었습니다.');
            } else if (isEditing) {
                await dispatch(modifySpices({
                    id: formData.id,
                    nameEn: formData.nameEn,
                    nameKr: formData.nameKr,
                    lineName: formData.lineName,
                    contentKr: formData.contentKr,
                    imageUrlList: formData.imageUrlList || []
                }));
                setSuccessMessage('향료 수정이 완료되었습니다.');
            }
    
            console.log("✅ `handleModalClose()` 실행됨 → 입력 모달 닫힘");
            handleModalClose();
    
            // ✅ 다음 이벤트 루프에서 실행 (상태 업데이트 보장)
            setTimeout(() => {
                console.log("✅ `setShowSuccessModal(true);` 실행됨 → 성공 모달 표시");
                setShowSuccessModal(true);
            }, 0);
        } catch (error) {
            console.error("❌ `handleSubmit` 실패:", error);
            handleError("작업에 실패했습니다. 다시 시도해주세요.");
        }
    };
    

    // 모달 닫기 핸들러
    const handleModalClose = () => {
        console.log("📌 `handleModalClose` 실행됨 → 입력 모달 닫힘");

        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedSpice(null);
        setImagePreview(null);
        setIsAdding(false);
        setIsEditing(false);
    };


    // 성공 메시지 닫기 핸들러
    const handleSuccessClose = async () => {
        console.log("✅ `handleSuccessClose()` 실행됨 → 성공 모달 닫힘");
        setShowSuccessModal(false);
        setSuccessMessage('');
    
        // ✅ 로딩 화면 표시
        setIsLoading(true);
    
        try {
            console.log("🔄 `fetchSpices()` 실행됨 → 데이터 새로고침");
            await dispatch(fetchSpices());
            console.log("✅ `fetchSpices()` 완료 → 화면 갱신 준비");
        } catch (error) {
            console.error("❌ `fetchSpices()` 실패:", error);
            handleError("데이터 새로고침에 실패했습니다.");
        } finally {
            setTimeout(() => {
                console.log("✅ 로딩 종료 → 화면 갱신");
                setIsLoading(false);
            }, 500); // 500ms 후 로딩 해제 (UI 깜빡임 방지)
        }
    };
    

    // 삭제 확인 핸들러
    const handleDeleteConfirm = async () => {
        if (!selectedCard) {
            handleError("삭제할 카드를 선택하세요.");
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(deleteSpices(selectedCard)); // ✅ unwrap 제거
            setSuccessMessage('향료 삭제가 완료되었습니다.');
            setShowSuccessModal(true);
            setIsDeleting(false);
            setSelectedCard(null);
        } catch (error) {
            console.error('Error:', error);
            handleError("삭제에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
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
        showSuccessModal,
        isDeleting,
        role,
        filteredSpices,
        currentSpices,
        itemsPerPage,
        selectedSpice,
        isEditing,
        isLoading,
        imagePreview,
        paginationGroup,
        editingImage,
        isAdding,
        error,
        totalFilteredItems: filteredSpices.length,
        currentPageGroup: Math.floor((currentPage - 1) / 5),
        maxPageGroup: Math.floor((totalPages - 1) / 5),
        isModalOpen: showAddModal || showEditModal,

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
        handleImageUpload,
        handleError,
        totalPages,

        // 카드 컴포넌트용 핸들러
        onAddClick: handleAddButtonClick,
        onEditClick: handleEditButtonClick,
        onDeleteClick: handleDeleteButtonClick
    };
};

export default useSpicesState;