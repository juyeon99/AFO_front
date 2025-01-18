import { useState } from 'react';

/**
 * 팝업창(모달)을 관리하는 Hook
 * 
 * 이 Hook은 두 가지 팝업창을 관리합니다:
 * 1. 이미지 확대 팝업 - 채팅에서 이미지 클릭시 크게 보기
 * 2. 로그인 안내 팝업 - 비회원 사용자에게 로그인 권유
 */

export const useModal = () => {
    // 각 팝업창의 열림/닫힘 상태 관리
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    // 현재 확대해서 보고 있는 이미지 정보
    const [modalImage, setModalImage] = useState(null);

    /**
  * 이미지 팝업 열기
  * - 클릭한 이미지를 크게 보여줌
  */

    const openImageModal = (image) => {
        setModalImage(image);   // 보여줄 이미지 설정
        setIsImageModalOpen(true); // 팝업창 열기
    };

    /**
     * 이미지 팝업 닫기
     * - 팝업창을 닫고 이미지 정보도 초기화
     */

    const closeImageModal = () => {
        setIsImageModalOpen(false); // 팝업창 닫기
        setModalImage(null);       // 이미지 정보 초기화
    };

    // 모든 팝업 관련 속성을 하나의 객체로 묶어서 반환
    return {
        modalProps: {
            // 팝업창들의 열림/닫힘 상태
            isImageModalOpen,
            isLoginModalOpen,

            // 이미지 팝업 관련 속성
            imageModal: {
                image: modalImage,
                openModal: openImageModal,
                onClose: closeImageModal
            },

            // 로그인 팝업 관련 속성
            loginModal: {
                isOpen: isLoginModalOpen,
                onClose: () => setIsLoginModalOpen(false)
            }
        }
    };
};
