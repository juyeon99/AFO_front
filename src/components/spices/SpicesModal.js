import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../../css/spices/SpicesModal.module.css';
import line_ from '../../data/line_.json';

/**
 * 향료 추가/수정 모달 컴포넌트
 * @param {boolean} show - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {object} spice - 수정할 향료 데이터 (수정 시에만 사용)
 * @param {function} onSubmit - 제출 핸들러 함수
 * @param {boolean} isEditing - 수정 모드 여부
 */

const SpicesModal = ({ show, onClose, spice, onSubmit, isEditing }) => {
    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        nameEn: '',
        nameKr: '',
        lineName: 'Spicy',
        description: '',
        imageUrl: null
    });

    // 이미지 미리보기 상태
    const [imagePreview, setImagePreview] = useState(null);

    // 수정 모드일 때 기존 데이터로 폼 초기화
    useEffect(() => {
        if (spice) {
            setFormData(spice);
            setImagePreview(spice.imageUrl);
        }
    }, [spice]);

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
                {/* 모달 헤더 */}
                <div className={styles.modalHeader}>
                    <h2>{isEditing ? '향료 수정' : '향료 추가'}</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={20} />
                    </button>
                </div>

                {/* 향료 정보 입력 폼 */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* 이미지 업로드 섹션 */}
                    <div className={styles.imageUpload}>
                        <img
                            src={imagePreview || '/images/default-spice.png'}
                            alt="Preview"
                            className={styles.preview}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                        />
                    </div>

                    {/* 향료 정보 입력 필드들 */}
                    <input
                        type="text"
                        name="nameEn"
                        value={formData.nameEn}
                        onChange={handleChange}
                        placeholder="영문 이름"
                        required
                    />
                    <input
                        type="text"
                        name="nameKr"
                        value={formData.nameKr}
                        onChange={handleChange}
                        placeholder="한글 이름"
                        required
                    />
                    <select
                        name="lineName"
                        value={formData.lineName}
                        onChange={handleChange}
                        required
                    >
                        {line_.map(line => (
                            <option key={line.name} value={line.name}>
                                {line.name}
                            </option>
                        ))}
                    </select>
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

export default SpicesModal;