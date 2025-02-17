import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    fetchPerfumes,
    selectPerfumes,
    deletePerfume,
    createPerfume,
    modifyPerfume
} from '../../../module/PerfumeModule';

const usePerfumeState = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const perfumes = useSelector(selectPerfumes) || [];

    // URL에서 페이지 번호 가져오기
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get('page')) || 1;

    // 기본 상태 관리
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPerfume, setSelectedPerfume] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [role, setRole] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageUrls, setImageUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [imageUrlCount, setImageUrlCount] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const itemsPerPage = 12;

    // URL 변경 감지 및 페이지 상태 업데이트
    useEffect(() => {
        const page = parseInt(queryParams.get('page')) || 1;
        setCurrentPage(page);
    }, [location.search]);

    // 초기 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                await dispatch(fetchPerfumes());
                const storedUser = JSON.parse(localStorage.getItem('auth'));
                if (storedUser && storedUser.role) {
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

    useEffect(() => {
        if (selectedPerfume) {
            setFormData(selectedPerfume);
            setImageUrls(selectedPerfume.imageUrls || [selectedPerfume.imageUrl].filter(Boolean));
        }
    }, [selectedPerfume]);

    const filteredPerfumes = perfumes.filter(perfume => {
        const name = perfume?.nameKr || '';
        const brand = perfume?.brand || '';
        const content = perfume?.content || '';
        return (
            (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                content.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (activeFilters.length === 0 || activeFilters.includes(perfume.grade))
        );
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterClick = (filterId) => {
        setActiveFilters(prev => {
            if (prev.includes(filterId)) {
                return prev.filter(id => id !== filterId);
            }
            return [...prev, filterId];
        });
        setCurrentPage(1);
    };

    const handleCheckboxToggle = () => setShowCheckboxes(!showCheckboxes);

    const handleCardCheckboxChange = (id) => {
        setSelectedCard(selectedCard === id ? null : id);
    };

    const handleAddButtonClick = () => {
        setSelectedPerfume({
            name: '',
            description: '',
            brand: '',
            grade: '오 드 퍼퓸',
            singleNote: '',
            topNote: '',
            middleNote: '',
            baseNote: '',
            imageUrl: '',
        });
        setShowAddModal(true);
    };

    const handleEditButtonClick = (perfume) => {
        setSelectedPerfume(perfume);
        setShowEditModal(true);
    };

    const handleDeleteButtonClick = () => {
        if (!selectedCard) {
            alert("삭제할 카드를 선택하세요.");
            return;
        }
        const perfumeToDelete = perfumes.find(p => p.id === selectedCard);
        setSelectedPerfume(perfumeToDelete);
        setIsDeleting(true);
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            await dispatch(deletePerfume(selectedCard));
            setSuccessMessage(`${selectedPerfume.name} 향수 카드가 삭제되었습니다!`);
            setIsDeleting(false);
            setSelectedPerfume(null);
            setSelectedCard(null);
            await dispatch(fetchPerfumes());
        } catch (error) {
            console.error("향수 삭제 실패:", error);
            alert("향수 삭제에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedPerfume(null);
        setFormData({});
        setImageUrls([]);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUrlAdd = () => {
        setImageUrls([...imageUrls, '']);
        setImageUrlCount(prev => prev + 1);
    };

    const handleImageUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const handleImageUrlRemove = (index) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
        setImageUrlCount(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updatedData = {
                ...formData,
                imageUrls: imageUrls.filter(url => url.trim() !== '')
            };

            if (showEditModal) {
                await dispatch(modifyPerfume({ id: selectedPerfume.id, ...updatedData }));
                setSuccessMessage('향수가 성공적으로 수정되었습니다!');
            } else {
                await dispatch(createPerfume(updatedData));
                setSuccessMessage('향수가 성공적으로 추가되었습니다!');
            }

            handleModalClose();
            await dispatch(fetchPerfumes());
        } catch (error) {
            console.error('향수 저장 실패:', error);
            alert('향수 저장에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccessMessage('');
        dispatch(fetchPerfumes());
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate(`/perfumelist?page=${pageNumber}`);
    };

    const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);

    return {
        searchTerm,
        activeFilters,
        currentPage,
        showCheckboxes,
        selectedCard,
        showAddModal,
        showEditModal,
        selectedPerfume,
        successMessage,
        isDeleting,
        role,
        filteredPerfumes,
        itemsPerPage,
        formData,
        imageUrls,
        isLoading,
        showUrlInput,
        setShowUrlInput,
        imageUrlCount,
        currentImageIndex,
        setShowAddModal,
        setShowEditModal,
        setIsDeleting,
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
        handleInputChange,
        handleImageUrlAdd,
        handleImageUrlChange,
        handleImageUrlRemove,
        handleSubmit,
        totalPages,
        handlePageChange
    };
};

export default usePerfumeState;