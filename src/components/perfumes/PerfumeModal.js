import React from 'react';
import styles from '../../css/perfumes/PerfumeModal.module.css';

const PerfumeModal = ({
    show,
    onClose,
    isEditing,
    isDeleting,
    onDelete,
    onDeleteClose,
    successMessage,
    onSuccessClose,
    formData,
    imageUrls,
    showUrlInput,
    setShowUrlInput,
    imageUrlCount,
    currentImageIndex,
    onInputChange,
    onImageUrlAdd,
    onImageUrlChange,
    onImageUrlRemove,
    onSubmit
}) => {
    if (!show) return null;

    if (successMessage) {
        return (
            <div className={styles.modalBackdrop}>
                <div className={styles.modalContainerSuccess}>
                    <p className={styles.successMessage}>{successMessage}</p>
                    <div className={styles.modalActions}>
                        <button onClick={onSuccessClose} className={styles.cancelButtonSuccess}>
                            확인
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isDeleting) {
        return (
            <div className={styles.modalBackdrop}>
                <div className={styles.modalContainerDelete}>
                    <h2 className={styles.modalTitleDelete}>향수카드 삭제</h2>
                    <p>선택한 향수카드를 삭제하시겠습니까?</p>
                    <div className={styles.modalActionsDelete}>
                        <button onClick={onDelete} className={styles.confirmButton}>확인</button>
                        <button onClick={onDeleteClose} className={styles.cancelButtonDelete}>취소</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContainer}>
                <form onSubmit={onSubmit}>
                    <h2 className={styles.modalTitle}>
                        {isEditing ? '향수 카드 수정하기' : '향수 카드 추가하기'}
                    </h2>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>향수명</label>
                        <input
                            type="text"
                            className={styles.modalRowName}
                            value={formData.name || ""}
                            onChange={(e) => onInputChange('name', e.target.value)}
                            placeholder="향수 이름을 입력하세요"
                            required
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>브랜드명</label>
                        <input
                            type="text"
                            className={styles.modalRowBrand}
                            value={formData.brand || ""}
                            onChange={(e) => onInputChange('brand', e.target.value)}
                            placeholder="브랜드명을 입력하세요"
                            required
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>부향률</label>
                        <select
                            className={styles.modalRowConcentration}
                            value={formData.grade || ""}
                            onChange={(e) => onInputChange('grade', e.target.value)}
                            required
                        >
                            <option value="오 드 퍼퓸">Eau de perfume</option>
                            <option value="오 드 뚜왈렛">Eau de Toilette</option>
                            <option value="오 드 코롱">Eau de Cologne</option>
                            <option value="퍼퓸">Perfume</option>
                            <option value="솔리드 퍼퓸">Solid Perfume</option>
                        </select>
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>향수 설명</label>
                        <textarea
                            className={styles.modalRowDescription}
                            value={formData.description || ""}
                            onChange={(e) => onInputChange('description', e.target.value)}
                            placeholder="향수 설명을 입력하세요"
                            required
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>싱글노트</label>
                        <input
                            type="text"
                            className={styles.modalRowSingleNote}
                            value={formData.singleNote || ""}
                            onChange={(e) => onInputChange('singleNote', e.target.value)}
                            placeholder="싱글노트를 입력하세요"
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>탑노트</label>
                        <input
                            type="text"
                            className={styles.modalRowTopNote}
                            value={formData.topNote || ""}
                            onChange={(e) => onInputChange('topNote', e.target.value)}
                            placeholder="탑노트를 입력하세요"
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>미들노트</label>
                        <input
                            type="text"
                            className={styles.modalRowMiddleNote}
                            value={formData.middleNote || ""}
                            onChange={(e) => onInputChange('middleNote', e.target.value)}
                            placeholder="미들노트를 입력하세요"
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>베이스노트</label>
                        <input
                            type="text"
                            className={styles.modalRowBaseNote}
                            value={formData.baseNote || ""}
                            onChange={(e) => onInputChange('baseNote', e.target.value)}
                            placeholder="베이스노트를 입력하세요"
                        />
                    </div>

                    <div className={styles.modalRow}>
                        <label className={styles.formLabel}>이미지</label>
                        <div className={styles.imageInputContainer}>
                            {/* 이미지 미리보기 영역 */}
                            <div className={styles.imagePreviewBox} onClick={() => setShowUrlInput(true)}>
                                {imageUrls[0] ? (
                                    <img
                                        src={imageUrls[0]}
                                        alt="미리보기"
                                        className={styles.previewImage}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                ) : (
                                    <span>+</span>
                                )}
                            </div>

                            {/* URL 입력 필드 */}
                            {showUrlInput && (
                                <input
                                    type="text"
                                    value={imageUrls[0] || ''}
                                    onChange={(e) => onImageUrlChange(0, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); // 폼 제출 방지
                                        }
                                    }}
                                    placeholder="이미지 URL을 입력하세요"
                                    className={styles.modalRowImageUrl}
                                />
                            )}

                            {/* 추가 버튼 */}
                            <button
                                type="button"
                                onClick={onImageUrlAdd}
                                className={styles.addImageButton}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* 이미지 페이징 */}
                    <div className={styles.imagePagination}>
                        {Array(imageUrlCount).fill(null).map((_, index) => (
                            <span
                                key={index}
                                className={`${styles.paginationDot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                            />
                        ))}
                    </div>

                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.saveButton}>
                            저장
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PerfumeModal;
