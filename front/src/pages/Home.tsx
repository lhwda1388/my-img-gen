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
    </div>
  );
};

export default Home;
