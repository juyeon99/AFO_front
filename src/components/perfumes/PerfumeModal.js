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
    // ✅ safeImageUrlList 변수를 가장 먼저 선언
    const safeImageUrlList = imageUrlList.length > 0 ? imageUrlList : [''];

    // ✅ imagePreview를 safeImageUrlList를 참조해서 초기화
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
                <form onSubmit={onSubmit} 
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                e.preventDefault(); 
                    }
                }}>
                    <h2 className={styles.modalTitle}>
                        {isEditing ? '향수 카드 수정하기' : '향수 카드 추가하기'}
                    </h2>
    
                    <div className={styles.inputRow}>
                        {[
                            { label: '향수영어명', key: 'nameEn', placeholder: '향수 이름을 입력하세요' },
                            { label: '향수한글명', key: 'nameKr', placeholder: '향수 이름을 입력하세요' },
                            { label: '브랜드명', key: 'brand', placeholder: '브랜드명을 입력하세요' },
                        ].map(({ label, key, placeholder }) => (
                            <div key={key} className={styles.modalRow}>
                                <label className={styles.formLabel}>{label}</label>
                                <input
                                    type="text"
                                    className={styles.modalRowName}
                                    value={formData[key] || ''}
                                    onChange={(e) => onInputChange(key, e.target.value)}
                                    placeholder={placeholder}
                                    required
                                />
                            </div>
                        ))}
    
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>부향률</label>
                            <select
                                className={styles.modalRowConcentration}
                                value={formData.grade || ''}
                                onChange={(e) => onInputChange('grade', e.target.value)}
                                required
                            >
                                {['오 드 퍼퓸', '오 드 뚜왈렛', '오 드 코롱', '퍼퓸', '솔리드 퍼퓸'].map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
    
                        {[
                            { label: '싱글노트', key: 'singleNoteList', placeholder: '싱글노트를 입력하세요 (예: 라벤더, 바닐라)' },
                            { label: '탑노트', key: 'topNoteList', placeholder: '탑노트를 입력하세요 (예: 레몬, 베르가못)' },
                            { label: '미들노트', key: 'middleNoteList', placeholder: '미들노트를 입력하세요 (예: 장미, 자스민)' },
                            { label: '베이스노트', key: 'baseNoteList', placeholder: '베이스노트를 입력하세요 (예: 샌달우드, 머스크)' },
                        ].map(({ label, key, placeholder }) => (
                            <div key={key} className={styles.modalRow}>
                                <label className={styles.formLabel}>{label}</label>
                                <input
                                    type="text"
                                    className={styles.modalRowName}
                                    value={formData[key] ? formData[key].join(', ') : ''}
                                    onChange={(e) => handleonInputChange(key, e.target.value)}
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}
    
                        {[
                            { label: '메인어코드', key: 'mainAccord', placeholder: '계열 설명을 입력하세요' },
                            { label: '성분', key: 'ingredients', placeholder: '성분 설명을 입력하세요' },
                            { label: 'size', key: 'sizeOption', placeholder: 'size 설명을 입력하세요' },
                            { label: '향수 설명', key: 'content', placeholder: '향수 설명을 입력하세요' },
                        ].map(({ label, key, placeholder }) => (
                            <div key={key} className={styles.modalRow}>
                                <label className={styles.formLabel}>{label}</label>
                                <textarea
                                    className={styles.modalRowDescription}
                                    value={formData[key] || ''}
                                    onChange={(e) => onInputChange(key, e.target.value)}
                                    placeholder={placeholder}
                                    required
                                />
                            </div>
                        ))}
    
                        {/* ✅ 이미지 URL 입력 및 미리보기 */}
                        <div className={styles.modalRow}>
                            <label className={styles.formLabel}>이미지</label>
                            <div className={styles.imageInputContainer}>
                                {/* ✅ 이미지 미리보기 */}
                                <div className={styles.imagePreviewBox} onClick={() => setShowUrlInput(true)}>
                                    {imageUrlList.length > 0 ? (
                                        <img
                                            src={imageUrlList[currentImageIndex] || ''}
                                            alt="미리보기"
                                            className={styles.previewImage}
                                            onError={(e) => {
                                                e.target.src = 'https://mblogthumb-phinf.pstatic.net/MjAyMDA1MDZfMTk3/MDAxNTg4Nzc1MjcwMTQ2.l8lHrUz8ZfSDCShKbMs8RzQj37B3jxpwRnQK7byS9k4g.OORSv5IlMThMSNj20nz7_OYBzSTkxwnV9QGGV8a3tVkg.JPEG.herbsecret/essential-oils-2738555_1920.jpg?type=w800';
                                            }}
                                        />
                                    ) : (
                                        <span>+</span>
                                    )}
                                </div>
    
                                {/* ✅ URL 입력 필드 */}
                                <input
                                    type="text"
                                    value={imageUrlList[currentImageIndex] || ''}
                                    onChange={(e) => handleImageUrlChange(currentImageIndex, e.target.value)}
                                    placeholder="이미지 URL을 입력하세요"
                                    className={styles.modalRowImageUrl}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // ✅ 기본 폼 제출 방지
                                            setShowUrlInput(false); // ✅ 입력창 닫기
                                        }
                                    }}
                                />
    
                                {/* ✅ URL 추가 버튼 */}
                                <button type="button" onClick={onImageUrlAdd} className={styles.addImageButton}>
                                    +
                                </button>
                            </div>
                        </div>
    
                        {/* ✅ 이미지 페이징 (이전/다음 버튼 추가) */}
                        <div className={styles.imagePagination}>
                            <button
                                type="button"
                                disabled={currentImageIndex === 0}
                                onClick={() => setCurrentImageIndex((prev) => Math.max(prev - 1, 0))}
                                className={styles.paginationArrow}
                            >
                                ◀
                            </button>
    
                            {imageUrlList.map((_, index) => (
                                <span
                                    key={index}
                                    className={`${styles.paginationDot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                                    onClick={() => {
                                        if (typeof setCurrentImageIndex === 'function') {
                                            setCurrentImageIndex(index);
                                        } else {
                                            console.error('❌ setCurrentImageIndex is not a function:', setCurrentImageIndex);
                                        }
                                    }}
                                    tabIndex={0} 
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); 
                                            setShowUrlInput(false);  
                                        }
                                    }}
                                />
                            ))}
    
                            <button
                                type="button"
                                disabled={currentImageIndex === imageUrlList.length - 1}
                                onClick={() => setCurrentImageIndex((prev) => Math.min(prev + 1, imageUrlList.length - 1))}
                                className={styles.paginationArrow}
                            >
                                ▶
                            </button>
                        </div>
                    </div>
    
                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.saveButton}>저장</button>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );    
};    

export default PerfumeModal;
