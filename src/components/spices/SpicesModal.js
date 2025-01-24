import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../../css/spices/SpicesModal.module.css';
import line_ from '../../data/line_.json';

const SpicesModal = ({ show, onClose, spice, onSubmit, isEditing }) => {
    const [formData, setFormData] = useState({
        nameEn: '',
        nameKr: '',
        lineName: 'Spicy',
        description: '',
        imageUrl: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (spice) {
            setFormData(spice);
            setImagePreview(spice.imageUrl);
        }
    }, [spice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!show) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{isEditing ? '향료 수정' : '향료 추가'}</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
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