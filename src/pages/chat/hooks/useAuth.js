import { useState, useEffect } from 'react';

/**
 * 사용자 로그인 상태를 관리하는 Hook
 * 
 * 이 Hook은 두 가지 정보를 관리합니다:
 * 1. 로그인 여부
 * 2. 비회원이 사용한 채팅 횟수
 */

export const useAuth = () => {
    // 로그인 상태를 저장하는 변수
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // 비회원이 채팅한 횟수를 저장하는 변수
    const [nonMemberChatCount, setNonMemberChatCount] = useState(0);
    
    // 페이지가 처음 로드될 때 실행
    useEffect(() => {
        // 로컬 스토리지에서 로그인 정보 확인
        const userData = localStorage.getItem('auth');
        setIsLoggedIn(!!userData);  // 로그인 정보가 있으면 true, 없으면 false
        
        // 로컬 스토리지에서 비회원 채팅 횟수 가져오기
        const savedCount = parseInt(localStorage.getItem('nonMemberChatCount'), 10);
        // 저장된 횟수가 있으면 설정
        if (!isNaN(savedCount)) {
            setNonMemberChatCount(savedCount);
        }
    }, []); // 빈 배열을 넣어서 한 번만 실행되도록 함

    // 로그인 상태와 비회원 채팅 횟수 관련 함수들을 반환
    return {
        isLoggedIn,              // 로그인 여부
        setIsLoggedIn,           // 로그인 상태 변경 함수
        nonMemberChatCount,      // 비회원 채팅 횟수
        setNonMemberChatCount    // 비회원 채팅 횟수 변경 함수
    };
};
