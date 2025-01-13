import React, { memo } from 'react';
import styles from '../../../css/modules/Modal.module.css';

/**
 * 로그인 모달 컴포넌트
 * 로그인 안내 및 처리
 */
const LoginModal = memo(({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.nonMemberModalOverlay}>
            <div className={styles.nonMemberModalContent}>
                <h2 className={styles.nonMemberModalContent1}>로그인이 필요합니다</h2>
                <p>
                    회원가입 후 이용하시면<br />
                    더 많은 서비스를 이용하실 수 있습니다.
                </p>
                <div className="button-group">
                    <button className={styles.nonMemberLoginButton} onClick={onLogin}>로그인하기</button>
                    <button className={styles.nonMemberCloseButton} onClick={onClose}>비회원으로 계속하기</button>
                </div>
            </div>
        </div>
    );
});

export default LoginModal;
