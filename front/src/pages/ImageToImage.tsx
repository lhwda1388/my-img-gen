import React, { useState, useEffect } from "react";
import { useImageWorkerService } from "../services/imageWorkerService";
import { useImageStore } from "../stores/imageStore";

const ImageToImage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Worker 서비스
  const { generateImageToImage } = useImageWorkerService();
  const {
    isGenerating,
    generatedImage,
    error,
    message,
    clearError,
    clearMessage,
    addToHistory,
  } = useImageStore();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim() || !selectedImage) return;
    generateImageToImage(prompt, selectedImage);
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

  // 이미지 생성 성공 시 히스토리에 추가
  useEffect(() => {
    if (generatedImage && prompt) {
      addToHistory(prompt, generatedImage, "image-to-image");
    }
  }, [generatedImage, prompt, addToHistory]);

  return (
    <div className="image-to-image-page">
      <h1>🖼️ 이미지 → 이미지</h1>
      <p>기존 이미지를 기반으로 새로운 스타일의 이미지를 생성합니다.</p>

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
          <label htmlFor="image">이미지 선택:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={isGenerating}
          />
        </div>

        {previewImage && (
          <div className="preview-section">
            <h3>선택된 이미지</h3>
            <img src={previewImage} alt="Preview" className="preview-image" />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="prompt">프롬프트 입력:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 이 이미지를 만화 스타일로 변환해주세요"
            rows={4}
            maxLength={100}
            disabled={isGenerating}
          />
          <div className="char-count">{prompt.length}/100</div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim() || !selectedImage}
          className="generate-btn"
        >
          {isGenerating ? "변환 중... (페이지 이동 가능)" : "이미지 변환"}
        </button>

        {isGenerating && (
          <div className="generation-info">
            <p>🎯 이미지 변환이 백그라운드에서 진행 중입니다.</p>
            <p>다른 페이지로 이동해도 변환은 계속됩니다!</p>
          </div>
        )}
      </div>

      {generatedImage && (
        <div className="result-section">
          <h3>변환된 이미지</h3>
          <img
            src={`http://localhost:8000/image/${generatedImage}`}
            alt="Generated"
            className="generated-image"
          />
          <div className="image-actions">
            <a
              href={`http://localhost:8000/image/${generatedImage}`}
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

export default ImageToImage;
