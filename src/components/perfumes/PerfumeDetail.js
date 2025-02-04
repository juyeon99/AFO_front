import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../css/perfumes/PerfumeDetail.module.css';
import PerfumeReviews from './PerfumeReviews';
import perfumeData from '../../data/PerfumeData';
import { noteData, spiceData } from '../../data/NoteData';

const PerfumeDetail = () => {
    const { id } = useParams();
    const perfume = perfumeData.find(p => p.id === parseInt(id));
    const navigate = useNavigate();

    // ingredients 문자열을 파싱하는 함수
    const parseIngredients = (ingredients) => {
        if (!ingredients) return [];
        return ingredients.split(',').map(item => item.trim());
    };

    // 향수의 노트 정보를 가져오는 함수
    const getNotesByType = (perfumeId, noteType) => {
        return noteData
            .filter(note => note.perfume_id === perfumeId && note.note_type === noteType)
            .map(note => spiceData[note.spice_id].korean_name);
    };

    if (!perfume) {
        return <div>향수를 찾을 수 없습니다.</div>;
    }

    const topNotes = getNotesByType(perfume.id, "top");
    const middleNotes = getNotesByType(perfume.id, "middle");
    const baseNotes = getNotesByType(perfume.id, "base");

    return (
        <div className={styles.container}>
            {/* 로고 */}
            <img
                src="/images/logo.png"
                alt="방향"
                className={styles.logo}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />

            {/* 상단 향수 이름 */}
            <h1 className={styles.topNameEn}>{perfume.name}</h1>

            <div className={styles.contentWrapper}>
                <div className={styles.imageSection}>
                    <img src={perfume.imageUrls[0]} alt={perfume.name} className={styles.mainImage} />
                </div>

                <div className={styles.infoSection}>
                    {/* 노트 정보 */}
                    <div className={styles.notes}>
                        <div className={styles.noteDivider}></div>
                        <div className={styles.noteItem}>
                            <span className={styles.noteType}>Top</span>
                            <p className={styles.noteNames}>{topNotes.join(', ')}</p>
                        </div>
                        <div className={styles.noteDivider}></div>
                        <div className={styles.noteItem}>
                            <span className={styles.noteType}>Middle</span>
                            <p className={styles.noteNames}>{middleNotes.join(', ')}</p>
                        </div>
                        <div className={styles.noteDivider}></div>
                        <div className={styles.noteItem}>
                            <span className={styles.noteType}>Base</span>
                            <p className={styles.noteNames}>{baseNotes.join(', ')}</p>
                        </div>
                        <div className={styles.noteDivider}></div>
                    </div>

                    {/* 성분 정보 */}
                    <div className={styles.ingredients}>
                        <div className={styles.ingredientsList}>
                            {parseIngredients(perfume.ingredients).map((ingredient, index) => (
                                <span key={index} className={styles.ingredientItem}>
                                    {ingredient}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 브랜드 정보 */}
                    <div className={styles.brandInfo}>
                        <h3>{perfume.brand}</h3>
                        <p>{perfume.koreanBrand}</p>
                    </div>

                    {/* 하단 향수 이름 */}
                    <div className={styles.bottomName}>
                        <h2 className={styles.bottomNameEn}>{perfume.name}</h2>
                        <p className={styles.bottomNameKr}>{perfume.koreanName}</p>
                    </div>
                    <div className={styles.bottomDivider}></div>

                    {/* 향수 설명 */}
                    <p className={styles.description}>
                        {perfume.description}
                    </p>
                </div>
            </div>

            {/* 구분선 */}
            <div className={styles.divider}></div>

            {/* 리뷰 섹션 */}
            <PerfumeReviews perfumeId={perfume.id} />
        </div>
    );
};

export default PerfumeDetail;