export const useRecommendation = () => {
    const filters = [
        { id: 1, name: 'Spicy', color: '#FF5757' },
        // ... 나머지 필터 데이터
    ];

    const handleCreateScentCard = async (chatId) => {
        try {
            const cardData = await dispatch(createScentCard(chatId));
            navigate('/history', {
                state: { recommendations: cardData.recommendations }
            });
        } catch (error) {
            console.error("향기 카드 생성 실패:", error);
        }
    };

    const RecommendationCard = ({ perfume, filters }) => {
        // ... 기존 RecommendationCard 컴포넌트 로직
    };

    return {
        filters,
        handleCreateScentCard,
        RecommendationCard
    };
};
