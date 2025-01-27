import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeModal.module.css';

/**
 * 향수 추가/수정 모달 컴포넌트
 * @param {boolean} show - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {object} perfume - 수정할 향수 데이터 (수정 시에만 사용)
 * @param {function} onSubmit - 제출 핸들러 함수
 * @param {boolean} isEditing - 수정 모드 여부
 */
const PerfumeModal = ({ show, onClose, perfume, onSubmit, isEditing }) => {
    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        description: '',
        imageUrl: null
    });

    // 이미지 미리보기 상태
    const [imagePreview, setImagePreview] = useState(null);

    // 수정 모드일 때 기존 데이터로 폼 초기화
    useEffect(() => {
        if (perfume) {
            setFormData(perfume);
            setImagePreview(perfume.imageUrl);
        }
    }, [perfume]);

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 이미지 파일 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!show) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>
                <h2>{isEditing ? '향수 수정' : '새 향수 추가'}</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* 이미지 업로드 영역 */}
                    <div className={styles.imageUpload}>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className={styles.imagePreview}
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                        />
                    </div>

                    {/* 입력 필드들 */}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="향수 이름"
                        required
                    />
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="브랜드"
                        required
                    />
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="카테고리"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="설명"
                        required
                    />

                    {/* 버튼 영역 */}
                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.submitButton}>
                            {isEditing ? '수정' : '추가'}
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