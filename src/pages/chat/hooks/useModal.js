import { useState } from 'react';

/**
 * 모달 상태 관리를 위한 커스텀 훅
 */
export const useModal = () => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const openImageModal = (image) => {
        setModalImage(image);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setModalImage(null);
    };

    return {
        modalProps: {
            isImageModalOpen,
            isLoginModalOpen,
            imageModal: {
                image: modalImage,
                onClose: closeImageModal
            },
            loginModal: {
                isOpen: isLoginModalOpen,
                onClose: () => setIsLoginModalOpen(false)
            }
        }
    };
};
