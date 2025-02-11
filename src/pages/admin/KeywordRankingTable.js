import React, { useState, useEffect } from 'react';

const KeywordRankingTable = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKeywordData = async () => {
    try {
      setLoading(true);
      const dummyData = generateDummyData();
      await new Promise(resolve => setTimeout(resolve, 1000));
      setKeywordData(dummyData);
      setError(null);
    } catch (err) {
      setError('데이터 로딩 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywordData();
  }, []);

  const generateDummyData = () => {
    const keywords = [
      "시그니처", "블라인드", "지속력", "게임감", "레이어링",
      "비누향", "로맨틱한", "바다향", "디퓨저", "잔향"
    ];
    
    const sections = {};
    [1, 11, 21].forEach(startRank => {
      const sectionKey = `section${Math.floor((startRank - 1) / 10) + 1}`;
      sections[sectionKey] = keywords.map((keyword, index) => ({
        rank: startRank + index,
        keyword,
        trend: Math.random() > 0.5 ? "up" : "down",
        score: Math.floor(Math.random() * 1000),
        previousRank: startRank + index + (Math.random() > 0.5 ? 1 : -1)
      }));
    });
    return sections;
  };

  const renderTable = (data) => (
    <div className="keyword-table-container">
      <table className="keyword-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>키워드</th>
            <th>순위증감</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.rank}>
              <td>{item.rank}</td>
              <td>{item.keyword}</td>
              <td>
                {item.trend === "up" ? (
                  <span className="trend-up">▲</span>
                ) : (
                  <span className="trend-down">▼</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderLoadingState = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>데이터를 불러오는 중...</p>
    </div>
  );

  if (loading) return renderLoadingState();
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="keyword-ranking-container">
      <div className="keyword-ranking-header">
        <h2>키워드 순위(TOP 30)</h2>
        <button onClick={fetchKeywordData} className="refresh-button">
          새로고침
        </button>
      </div>
      <div className="keyword-tables-container">
        {keywordData && Object.values(keywordData).map((sectionData, index) => (
          <div key={index} className="keyword-table-wrapper">
            {renderTable(sectionData)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordRankingTable;