import React from 'react';
import { Edit } from 'lucide-react';
import styles from '../../css/spices/SpicesCard.module.css';

/**
 * 설명에서 첫 문장만 추출하는 함수
 * @param {string} description - 전체 설명 텍스트
 * @returns {string} - 첫 문장 (마침표 포함)
 */

// 유틸리티 함수들을 컴포넌트 외부에 정의
const getMainDescription = (description) => {
    return description.split('.')[0] + '.';
};

/**
 * 설명에서 주요 키워드를 추출하는 함수
 * @param {string} contentKr - 한글 설명 텍스트
 * @returns {array} - 추출된 키워드 배열 (최대 5개)
 */

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

    // 각 패턴으로 키워드 추출 및 정제
    const keywords = flavorPatterns
        .flatMap(pattern => contentKr.match(pattern) || [])
        .map(keyword => keyword.replace(/한$/, ''))  // "~한" 제거
        .filter(keyword => 
            !keyword.includes('조향') && 
            !keyword.includes('향료') &&
            !keyword.includes('향수')
        );  // 기술적 용어 제외

    // 중복 제거 후 최대 5개까지 반환
    return [...new Set(keywords)].slice(0, 5);
};

/**
 * 향료 카드 컴포넌트
 * @param {object} spice - 향료 데이터
 * @param {boolean} isAdmin - 관리자 여부
 * @param {boolean} showCheckboxes - 체크박스 표시 여부
 * @param {boolean} selected - 선택 여부
 * @param {function} onSelect - 선택 핸들러
 * @param {function} onEdit - 수정 핸들러
 */

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
            {/* 체크박스 (관리자 모드) */}
            {showCheckboxes && (
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onSelect(spice.id);
                    }}
                    className={styles.checkbox}
                />
            )}
            <div className={styles.card}>
                {/* 카드 앞면 */}
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
                    {/* 수정 버튼 (관리자만 표시) */}
                    {isAdmin && (
                        <button onClick={onEdit} className={styles.editButton}>
                            <Edit size={16} />
                        </button>
                    )}
                </div>

                {/* 카드 뒷면 */}
                <div className={styles.back}>
                    <h3 className={styles.nameKr}>{spice.nameKr}</h3>
                    <div className={styles.divider}></div>
                    <div className={styles.description}>
                        {/* 주요 설명 */}
                        <p className={styles.mainDescription}>
                            {getMainDescription(spice.contentKr)}
                        </p>
                        {/* 키워드 태그들 */}
                        <div className={styles.keyPoints}>
                            {getKeywords(spice.contentKr).map((keyword, i) => (
                                <span key={i} className={styles.keyword}>
                                    {keyword}
                                </span>
                            ))}
                            <p className={styles.category}>{spice.lineName} 계열</p>
                    {/* 수정 버튼 (관리자만 표시) */}
                    {isAdmin && (
                        <button onClick={onEdit} className={styles.editButton}>
                            <Edit size={16} />
                        </button>
                    )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpicesCard;