import { useState, useRef } from 'react';

/**
 * 파일 업로드를 위한 커스텀 훅
 */
export const useUpload = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 이미지 파일인지 확인
            if (file.type.startsWith('image/')) {
                setSelectedImages([file]); // 단일 이미지만 허용
                console.log('Image uploaded:', file); // 디버깅용
            } else {
                alert('이미지 파일만 업로드 가능합니다.');
            }
        }
    };

    const handleRemoveImage = (index) => {
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // 파일 입력 초기화
        }
    };

    return {
        uploadProps: {
            input: {
                handleImageUpload,
                handleRemoveImage,
                fileInputRef
            },
            preview: {
                selectedImages
            }
        }
    };
};
