import React from 'react';
import styles from '../../../css/modules/Loading.module.css';

/**
 * 로딩 표시 컴포넌트
 */
const LoadingDots = () => (
    <div className={styles.loadingEnhancedLoader}>
        <div className={styles.smoke1}></div>
        <div className={styles.smoke2}></div>
        <div className={styles.smoke3}></div>
        <div className={styles.smoke4}></div>
    </div>
);

export default LoadingDots;
