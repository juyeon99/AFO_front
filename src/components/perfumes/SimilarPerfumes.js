import React, { useEffect, useState } from 'react';
import styles from '../../css/perfumes/SimilarPerfumes.module.css';
import { getSimilarPerfumes } from '../../api/PerfumeAPICalls';
import { useNavigate } from 'react-router-dom';

const SimilarPerfumes = ({ perfumeId }) => {
    const [noteSimilarPerfumes, setNoteSimilarPerfumes] = useState([]);
    const [designSimilarPerfumes, setDesignSimilarPerfumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSimilarPerfumes = async () => {
            if (!perfumeId) return;

            try {
                setIsLoading(true);
                const data = await getSimilarPerfumes(perfumeId);
                setNoteSimilarPerfumes(data.note_based || []);
                setDesignSimilarPerfumes(data.design_based || []);
            } catch (err) {
                console.error("유사 향수 불러오기 실패", err);
                setNoteSimilarPerfumes([]);
                setDesignSimilarPerfumes([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadSimilarPerfumes();
    }, [perfumeId]);

    const handleCardClick = (id) => {
        navigate(`/perfumes/${id}`);
    };

    const PerfumeCardList = ({ perfumes, title }) => (
        <div className={styles.similarSection}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <div className={styles.similarList}>
                {perfumes.map((perfume) => (
                    <div
                        key={perfume.id}
                        className={styles.similarCard}
                        onClick={() => handleCardClick(perfume.id)}
                    >
                        <img
                            src={perfume.imageUrl}
                            alt={perfume.nameKr}
                        />
                        <h4>{perfume.nameKr}</h4>
                        <p className={styles.mainAccord}>{perfume.mainAccord}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    if (isLoading) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    if (!noteSimilarPerfumes.length && !designSimilarPerfumes.length) {
        return <div className={styles.noSimilar}>유사한 향수가 없습니다.</div>;
    }


    return (
        <div className={styles.similarContainer}>
            {noteSimilarPerfumes.length > 0 && (
                <PerfumeCardList
                    perfumes={noteSimilarPerfumes}
                    title="노트 기반 추천"
                />
            )}
            {designSimilarPerfumes.length > 0 && (
                <PerfumeCardList
                    perfumes={designSimilarPerfumes}
                    title="디자인 기반 추천"
                />
            )}
        </div>
    );
};

export default SimilarPerfumes;
