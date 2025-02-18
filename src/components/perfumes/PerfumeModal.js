import React from 'react';
import { useState } from 'react';
import styles from '../../css/perfumes/PerfumeModal.module.css';

const PerfumeModal = ({
    show,
    onClose,
    isEditing,
    isDeleting,
    onDelete,
    onDeleteClose,
    formData,
    setFormData,
    imageUrlList = [],
    showUrlInput,
    setShowUrlInput,
    imageUrlCount,
    currentImageIndex,
    onInputChange,
    onImageUrlAdd,
    onImageUrlChange,
    onImageUrlRemove,
    onSubmit,
    setCurrentImageIndex
}) => {
    // 이미지 URL 리스트가 undefined일 경우를 대비한 안전한 접근
    const safeImageUrlList = imageUrlList || [];

    // useState 초기값도 안전하게 설정
    const [imagePreview, setImagePreview] = useState(safeImageUrlList[0] || '');
    const [imageError, setImageError] = useState(false);

    // 이미지 URL 변경 핸들러 수정
    const handleImageUrlChange = (index, value) => {
        if (onImageUrlChange) {
            onImageUrlChange(index, value);
        }
        setImagePreview(value);
        setImageError(false);
    };

    if (!show) return null;

    const handleonInputChange = (field, value) => {
        if (!setFormData) {
            console.error("❌ `setFormData`가 정의되지 않음!");
            return;
        }
    
        console.log(`🟢 변경됨: ${field} = ${value}`);
    
        setFormData((prev) => ({
            ...prev,
            [field]: field.includes("List")  // ✅ `List`가 포함된 경우 배열로 변환
                ? value.split(",").map((item) => item.trim())
                : value
        }));
    };
    

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContainer}>
                <form onSubmit={onSubmit}>
                    <h2 className={styles.modalTitle}>
                        {isEditing ? '향수 카드 수정하기' : '향수 카드 추가하기'}
                    </h2>
    
                    <div className={styles.inputRow}>
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>향수영어명</label>
                            <input
                                type="text"
                                className={styles.modalRowName}
                                value={formData.nameEn || ""}
                                onChange={(e) => onInputChange('nameEn', e.target.value)}
                                placeholder="향수 이름을 입력하세요"
                                required
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>향수한글명</label>
                            <input
                                type="text"
                                className={styles.modalRowName}
                                value={formData.nameKr || ""}
                                onChange={(e) => onInputChange('nameKr', e.target.value)}
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
                            <label className={styles.formLabel}>싱글노트</label>
                            <input
                                type="text"
                                className={styles.modalRowSingleNote}
                                value={formData.singleNoteList ? formData.singleNoteList.join(", ") : ""}
                                onChange={(e) => handleonInputChange("singleNoteList", e.target.value)}
                                placeholder="싱글노트를 입력하세요 (예: 라벤더, 바닐라)"
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>탑노트</label>
                            <input
                                type="text"
                                className={styles.modalRowTopNote}
                                value={formData.topNoteList ? formData.topNoteList.join(", ") : ""}
                                onChange={(e) => handleonInputChange("topNoteList", e.target.value)}
                                placeholder="탑노트를 입력하세요 (예: 레몬, 베르가못)"
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>미들노트</label>
                            <input
                                type="text"
                                className={styles.modalRowMiddleNote}
                                value={formData.middleNoteList ? formData.middleNoteList.join(", ") : ""}
                                onChange={(e) => handleonInputChange("middleNoteList", e.target.value)}
                                placeholder="미들노트를 입력하세요 (예: 장미, 자스민)"
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>베이스노트</label>
                            <input
                                type="text"
                                className={styles.modalRowBaseNote}
                                value={formData.baseNoteList ? formData.baseNoteList.join(", ") : ""}
                                onChange={(e) => handleonInputChange("baseNoteList", e.target.value)}
                                placeholder="베이스노트를 입력하세요 (예: 샌달우드, 머스크)"
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>메인어코드</label>
                            <textarea
                                className={styles.modalRowDescription}
                                value={formData.mainAccord || ""}
                                onChange={(e) => onInputChange('mainAccord', e.target.value)}
                                placeholder="계열 설명을 입력하세요"
                                required
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>성분</label>
                            <textarea
                                className={styles.modalRowDescription}
                                value={formData.ingredients || ""}
                                onChange={(e) => onInputChange('ingredients', e.target.value)}
                                placeholder="성분 설명을 입력하세요"
                                required
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>size</label>
                            <textarea
                                className={styles.modalRowDescription}
                                value={formData.sizeOption || ""}
                                onChange={(e) => onInputChange('sizeOption', e.target.value)}
                                placeholder="size 설명을 입력하세요"
                                required
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>향수 설명</label>
                            <textarea
                                className={styles.modalRowDescription}
                                value={formData.content || ""}
                                onChange={(e) => onInputChange('content', e.target.value)}
                                placeholder="향수 설명을 입력하세요"
                                required
                            />
                        </div>
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>이미지</label>
                            <div className={styles.imageInputContainer}>
                                {/* 이미지 미리보기 영역 */}
                                <div className={styles.imagePreviewBox} onClick={() => setShowUrlInput(true)}>
                                    {safeImageUrlList.length > 0 ? (
                                        <img
                                            src={safeImageUrlList[currentImageIndex] || ''}
                                            alt="미리보기"
                                            className={styles.previewImage}
                                            onError={(e) => {
                                                e.target.src = 'https://mblogthumb-phinf.pstatic.net/MjAyMDA1MDZfMTk3/MDAxNTg4Nzc1MjcwMTQ2.l8lHrUz8ZfSDCShKbMs8RzQj37B3jxpwRnQK7byS9k4g.OORSv5IlMThMSNj20nz7_OYBzSTkxwnV9QGGV8a3tVkg.JPEG.herbsecret/essential-oils-2738555_1920.jpg?type=w800';
                                                setImageError(true);
                                            }}
                                        />
                                    ) : (
                                        <span>+</span>
                                    )}
                                </div>
    
                                {/* URL 입력 필드 */}
                                {showUrlInput && (
                                    <input
                                        type="text"
                                        value={imageUrlList[0]}
                                        onChange={(e) => handleImageUrlChange(0, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
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
                                    onClick={() => setCurrentImageIndex(index)} // 클릭 시 이미지 인덱스 변경
                                />
                            ))}
                        </div>
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
