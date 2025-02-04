import React from "react";
import styles from "../../css/therapy/TherapyKeywordDescription.module.css";

// 선택된 키워드의 설명을 보여주는 컴포넌트
// 키워드 선택 시 하단에 설명 박스가 나타남

const TherapyKeywordDescription = ({ keyword }) => {
    return (
        // 설명 텍스트를 포함하는 박스 컨테이너
        <div className={styles.descriptionBox}>
            <p className={styles.descriptionText}>{keyword.description}</p>
        </div>
    );
};

export default TherapyKeywordDescription;
