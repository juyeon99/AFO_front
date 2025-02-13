import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { selectSpices } from '../../module/SpicesModule';
import SpicesFilters from '../../components/spices/SpicesFilters';
import SpicesCard from '../../components/spices/SpicesCard';
import SpicesModal from '../../components/spices/SpicesModal';
import Pagination from '../../components/spices/Pagination';
import LoadingScreen from '../../components/loading/LoadingScreen';
import useSpicesState from './hooks/useSpicesState';
import styles from '../../css/spices/SpicesList.module.css';

const SpicesList = () => {
    const navigate = useNavigate();
    const spices = useSelector(selectSpices);
    const {
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
        handleSearch,
        handleFilterClick,
        handleCheckboxToggle,
        handleCardCheckboxChange,
        handleAddButtonClick,
        handleEditButtonClick,
        handleDeleteButtonClick,
        handleDeleteConfirm,
        handleSuccessClose,
        setIsDeleting,
        handleModalClose,
        handleSubmit,
        handlePageChange,
        totalPages,
    } = useSpicesState(spices);

    if (isLoading) {
        return <LoadingScreen message="향료를 불러오는 중..." />;
    }

    return (
        <>
            <div className={styles.container}>
                <img
                    src="/images/logo.png"
                    alt="방향"
                    className={styles.logo}
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                />

                <div className={styles.header}>
                    <div className={styles.title}>향료</div>
                    <div className={styles.searchArea}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="향료 이름 검색 가능"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search
                            className={styles.searchIcon}
                            size={20}
                            color="#333"
                        />
                    </div>
                </div>

                <div>
                    <SpicesFilters
                        activeFilters={activeFilters}
                        handleFilterClick={handleFilterClick}
                        role={role}
                        handleAddButtonClick={handleAddButtonClick}
                        handleCheckboxToggle={handleCheckboxToggle}
                        handleDeleteButtonClick={handleDeleteButtonClick}
                    />
                </div>

                <div className={styles.divider}></div>

                <div className={styles.cardContainer}>
                {filteredSpices
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((spice) => (
                            <div key={spice.id} className={styles.card}>
                                <SpicesCard
                                    spice={spice}
                                    showCheckboxes={showCheckboxes}
                                    selectedCard={selectedCard}
                                    role={role}  // role prop 추가
                                    onCheckboxChange={handleCardCheckboxChange}
                                    onEditClick={handleEditButtonClick}
                                />
                            </div>
                        ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                <SpicesModal
                    show={showAddModal || showEditModal}
                    onClose={handleModalClose}
                    spice={selectedSpice}
                    onSubmit={handleSubmit}
                    isEditing={isEditing}
                    isDeleting={isDeleting}
                    onDelete={handleDeleteConfirm}
                    onDeleteClose={() => setIsDeleting(false)}
                    successMessage={successMessage}
                    onSuccessClose={handleSuccessClose}
                />
            </div>
        </>
    );
};

export default SpicesList;