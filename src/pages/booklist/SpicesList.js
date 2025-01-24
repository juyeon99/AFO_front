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
        searchTerm,
        setSearchTerm,
        activeFilters,
        setActiveFilters,
        currentPage,
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
        successMessage,
        setSuccessMessage,
        isAdding,
        setIsAdding,
        isEditing,
        setIsEditing,
        isDeleting,
        setIsDeleting,
        filteredSpices,
        totalPages,
        itemsPerPage,
        handlePageChange,
        handleSubmit,
        handleDeleteConfirm,
        handleReset
    } = useSpicesState(spices);

    useEffect(() => {
        dispatch(fetchSpices());
        const storedUser = JSON.parse(localStorage.getItem('auth'));
        if (storedUser?.role) {
            setRole(storedUser.role);
        }
    }, [dispatch]);

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

    const handleEditButtonClick = (spice) => {
        setSelectedSpice(spice);
        setShowEditModal(true);
        setIsEditing(true);
        setIsAdding(false);
    };

    const handleDeleteButtonClick = () => {
        if (!selectedCard) {
            alert("삭제할 카드를 선택하세요.");
            return;
        }
        setIsDeleting(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setIsAdding(false);
        setIsEditing(false);
        setSelectedSpice(null);
        handleReset();
    };

    return (
        <>
            <div className={styles.container}>
                <img src="/images/logo.png" alt="방향" className={styles.logo} />
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h1>향료</h1>
                    </div>
                </div>
                <SpicesFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                />
                <div className={styles.divider}></div>

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

                <div className={styles.cardContainer}>
                    {filteredSpices
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((spice) => (
                            <SpicesCard
                                key={spice.id}
                                spice={spice}
                                isAdmin={role === 'ADMIN'}
                                showCheckboxes={showCheckboxes}
                                selected={selectedCard === spice.id}
                                onSelect={() => setSelectedCard(spice.id)}
                                onEdit={() => handleEditButtonClick(spice)}
                            />
                        ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                {(showAddModal || showEditModal) && (
                    <SpicesModal
                        show={showAddModal || showEditModal}
                        onClose={closeModal}
                        spice={selectedSpice}
                        onSubmit={handleSubmit}
                        isEditing={isEditing}
                    />
                )}

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