import React, { useState, useEffect } from "react";
import { useImageWorkerService } from "../services/imageWorkerService";
import { useImageStore } from "../stores/imageStore";

const TextToImage: React.FC = () => {
  const [prompt, setPrompt] = useState("");

  // Worker 서비스
  const { generateTextToImage } = useImageWorkerService();
  const {
    isGenerating,
    generatedImage,
    error,
    message,
    clearError,
    clearMessage,
    addToHistory,
  } = useImageStore();

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    generateTextToImage(prompt);
  };

  // 에러나 메시지가 있으면 5초 후 자동으로 클리어
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        clearError();
        clearMessage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message, clearError, clearMessage]);

  // 이미지 생성 성공 시 히스토리에 추가하고 pending request 클리어
  useEffect(() => {
    if (generatedImage && prompt) {
      addToHistory(prompt, generatedImage, "text-to-image");
    }
  }, [generatedImage, prompt, addToHistory]);

  return (
    <div className="text-to-image-page">
      <h1>📝 텍스트 → 이미지</h1>
      <p>텍스트 설명을 입력하면 AI가 이미지를 생성합니다.</p>

      {/* 상태 메시지 표시 */}
      {message && (
        <div className="status-message success">
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="status-message error">
          <p>{error}</p>
          <button onClick={clearError} className="close-btn">
            ×
          </button>
        </div>
      )}

      <div className="generation-form">
        <div className="input-group">
          <label htmlFor="prompt">프롬프트 입력:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 귀여운 고양이가 공원에서 놀고 있는 모습(최대100자)"
            rows={4}
            maxLength={100}
            disabled={isGenerating}
          />
          <div className="char-count">{prompt.length}/100</div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="generate-btn"
        >
          {isGenerating ? "생성 중... (페이지 이동 가능)" : "이미지 생성"}
        </button>

        {isGenerating && (
          <div className="generation-info">
            <p>🎯 이미지 생성이 백그라운드에서 진행 중입니다.</p>
            <p>다른 페이지로 이동해도 생성은 계속됩니다!</p>
            <p>💡 새로고침하지 말아주세요.</p>
          </div>
        )}
      </div>

      {generatedImage && (
        <div className="result-section">
          <h3>생성된 이미지</h3>
          <img
            src={`http://localhost:8000/${generatedImage}`}
            alt="Generated"
            className="generated-image"
          />
          <div className="image-actions">
            <a
              href={`http://localhost:8000/${generatedImage}`}
              download
              className="btn btn-primary"
            >
              이미지 다운로드
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToImage;
