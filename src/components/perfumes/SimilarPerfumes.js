import React, { useEffect, useState } from 'react';
import styles from '../../css/perfumes/SimilarPerfumes.module.css';
import { getSimilarPerfumes } from '../../api/PerfumeAPICalls';

const SimilarPerfumes = ({ perfumeId }) => {
    const [similarPerfumes, setSimilarPerfumes] = useState([]);

    useEffect(() => {
        if (perfumeId) {
            getSimilarPerfumes(perfumeId)
                .then(data => {
                    // 데이터가 배열인지 확인
                    setSimilarPerfumes(Array.isArray(data) ? data : []);
                })
                .catch(err => {
                    console.error("유사 향수 불러오기 실패", err);
                    setSimilarPerfumes([]); // 에러 시 빈 배열로 설정
                });
        }
    }, [perfumeId]);

    // 데이터가 없을 때의 처리
    if (!similarPerfumes.length) {
        return <div className={styles.noSimilar}>유사한 향수가 없습니다.</div>;
    }

    return (
        <div className={styles.similarContainer}>
            <h3 className={styles.title}>이 향수와 비슷한 추천 향수</h3>
            <div className={styles.similarList}>
                {similarPerfumes.map((perfume) => (
                    <div key={perfume.id} className={styles.similarCard}>
                        <img src={`/images/perfumes/${perfume.id}.jpg`} alt={perfume.name_en} />
                        <h4>{perfume.name_kr}</h4>
                        <p>{perfume.main_accord}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimilarPerfumes;
