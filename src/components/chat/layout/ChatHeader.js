import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../../css/modules/ChatHeader.module.css';

/**
 * 채팅 헤더 컴포넌트
 * 뒤로가기, 로고, 설명 텍스트를 포함
 */
const ChatHeader = memo(({ onGoBack }) => {
    return (
        <div className={styles.header}>
            <button
                className={styles.backButton}
                onClick={onGoBack}
                aria-label="뒤로 가기"
            >
                <img src="/images/back.png" alt="back" className={styles.backImage} />
            </button>

            <NavLink to="/">
                <img src="/images/logo.png" alt="방향" className={styles.titleImage} />
            </NavLink>

            <p className={styles.subtitle}>
                일상의 순간을 향으로 기록해보세요. <br />
                원하는 향의 느낌을 이미지 또는 텍스트로 작성하면,
                센티크가 향을 추천해 줄거예요 :)
            </p>
        </div>
    );
});

export default ChatHeader;
