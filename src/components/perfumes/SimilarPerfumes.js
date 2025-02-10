import React, { useEffect, useState } from 'react';
import styles from '../../css/perfumes/SimilarPerfumes.module.css';

const SimilarPerfumes = ({ perfumeId }) => {
    const [similarPerfumes, setSimilarPerfumes] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/recommend/${perfumeId}`)
            .then(res => res.json())
            .then(data => setSimilarPerfumes(data))
            .catch(err => console.error("유사 향수 불러오기 실패", err));
    }, [perfumeId]);

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
