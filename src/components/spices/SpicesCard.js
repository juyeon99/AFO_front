import React from 'react';
import { Edit } from 'lucide-react';
import styles from '../../css/spices/SpicesCard.module.css';

// 유틸리티 함수들을 컴포넌트 외부에 정의
const getMainDescription = (description) => {
    return description.split('.')[0] + '.';
};

const getKeywords = (contentKr) => {
    // 향의 특성을 나타내는 단어들 추출
    const flavorPatterns = [
        // 기본 맛/향 특성
        /(달콤|상큼|쌉쌀|부드러|시원|따뜻|강렬|은은)한/g,
        // 구체적인 향 계열
        /(우디|플로럴|과일|허브|스파이시|시트러스)/g,
        // ~향이 나는 (단, '조향' 제외)
        /(?<!조)([가-힣a-zA-Z]+)향/g,
        // ~와 비슷한
        /([가-힣a-zA-Z]+)와 비슷/g,
        // ~을 연상시키는
        /([가-힣a-zA-Z]+)[을를] 연상/g
    ];

    const keywords = flavorPatterns
        .flatMap(pattern => contentKr.match(pattern) || [])
        .map(keyword => keyword.replace(/한$/, ''))  // "~한" 제거
        .filter(keyword => 
            !keyword.includes('조향') && 
            !keyword.includes('향료') &&
            !keyword.includes('향수')
        );  // 기술적 용어 제외

    return [...new Set(keywords)].slice(0, 5);
};

const SpicesCard = ({
    spice,
    isAdmin,
    showCheckboxes,
    selected,
    onSelect,
    onEdit
}) => {
    return (
        <div className={styles.cardWrapper}>
            {showCheckboxes && (
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                    className={styles.checkbox}
                />
            )}
            <div className={styles.card}>
                <div className={styles.front}>
                    <img
                        src={spice.imageUrl || '/images/default-spice.png'}
                        alt={spice.nameEn}
                        className={styles.image}
                    />
                    <h3 className={styles.nameEn}>{spice.nameEn}</h3>
                    <h3 className={styles.nameKr}>{spice.nameKr}</h3>
                    <div className={styles.divider}></div>
                    <p className={styles.category}>{spice.lineName} 계열</p>
                    {isAdmin && (
                        <button onClick={onEdit} className={styles.editButton}>
                            <Edit size={16} />
                        </button>
                    )}
                </div>
                <div className={styles.back}>
                    <h3 className={styles.nameKr}>{spice.nameKr}</h3>
                    <div className={styles.divider}></div>
                    <div className={styles.description}>
                        <p className={styles.mainDescription}>
                            {getMainDescription(spice.contentKr)}
                        </p>
                        <div className={styles.keyPoints}>
                            {getKeywords(spice.contentKr).map((keyword, i) => (
                                <span key={i} className={styles.keyword}>
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpicesCard;