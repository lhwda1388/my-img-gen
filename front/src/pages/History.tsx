import React from "react";
import { useImageStore } from "../stores/imageStore";

const History: React.FC = () => {
  const { generationHistory, removeFromHistory, clearHistory } = useImageStore();

  const formatDate = (date?: Date) => {
    if (!date) return;
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTypeLabel = (type: "text-to-image" | "image-to-image") => {
    return type === "text-to-image" ? "텍스트 → 이미지" : "이미지 → 이미지";
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>📚 생성 히스토리</h1>
        <p>이전에 생성한 이미지들을 확인할 수 있습니다.</p>

        {generationHistory.length > 0 && (
          <button onClick={clearHistory} className="btn btn-secondary">
            전체 삭제
          </button>
        )}
      </div>

      {generationHistory.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">📝</div>
          <h3>아직 생성된 이미지가 없습니다</h3>
          <p>
            텍스트 → 이미지 또는 이미지 → 이미지 페이지에서 이미지를
            생성해보세요!
          </p>
        </div>
      ) : (
        <div className="history-grid">
          {generationHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-header">
                <span className="history-type">{getTypeLabel(item.type)}</span>
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="remove-btn"
                  title="삭제"
                >
                  ×
                </button>
              </div>

              <div className="history-image">
                <img
                  src={`http://localhost:8000/image/${item.imagePath}`}
                  alt={item.prompt}
                  className="generated-image"
                />
              </div>

              <div className="history-content">
                <p className="history-prompt">{item.prompt}</p>
                <p className="history-date">{formatDate(item.timestamp)}</p>
              </div>

              <div className="history-actions">
                <a
                  href={`http://localhost:8000/image/${item.imagePath}`}
                  download
                  className="btn btn-primary"
                >
                  다운로드
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
