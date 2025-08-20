import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// 페이지 컴포넌트들
import Home from "./pages/Home";
import TextToImage from "./pages/TextToImage";
import ImageToImage from "./pages/ImageToImage";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <div className="App">
        {/* 네비게이션 */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🎨 AI Image Generator
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  홈
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/text-to-image" className="nav-link">
                  텍스트 → 이미지
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/image-to-image" className="nav-link">
                  이미지 → 이미지
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/history" className="nav-link">
                  히스토리
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* 메인 컨텐츠 */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/text-to-image" element={<TextToImage />} />
            <Route path="/image-to-image" element={<ImageToImage />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
