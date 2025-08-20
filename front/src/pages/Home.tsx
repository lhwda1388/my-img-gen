import React from "react";

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>🎨 AI 이미지 생성기</h1>
        <p>Stable Diffusion을 사용하여 놀라운 이미지를 생성해보세요!</p>
        <div className="hero-buttons">
          <a href="/text-to-image" className="btn btn-primary">
            텍스트로 이미지 생성
          </a>
          <a href="/image-to-image" className="btn btn-secondary">
            이미지 변환하기
          </a>
          <a href="/history" className="btn btn-secondary">
            생성 히스토리
          </a>
        </div>
      </div>

      <div className="features-section">
        <h2>주요 기능</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📝 텍스트 → 이미지</h3>
            <p>텍스트 설명을 입력하면 AI가 이미지를 생성합니다.</p>
          </div>
          <div className="feature-card">
            <h3>🖼️ 이미지 → 이미지</h3>
            <p>기존 이미지를 기반으로 새로운 스타일의 이미지를 생성합니다.</p>
          </div>
          <div className="feature-card">
            <h3>🇰🇷 한국어 지원</h3>
            <p>한국어로 프롬프트를 입력하면 자동으로 영어로 번역됩니다.</p>
          </div>
          <div className="feature-card">
            <h3>📚 생성 히스토리</h3>
            <p>이전에 생성한 이미지들을 확인하고 관리할 수 있습니다.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ 백그라운드 처리</h3>
            <p>
              Web Worker를 사용하여 페이지 이동 중에도 이미지 생성이 계속됩니다.
            </p>
          </div>
          <div className="feature-card">
            <h3>🎯 전역 상태 관리</h3>
            <p>
              Zustand를 사용하여 모든 페이지에서 생성 상태를 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
