import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css"
// sidebar 추가 import
import { useState } from "react";
import Sidebar from "./Sidebar";
import ScrollToTopButton from "./ScrollToTopButton/ScrollToTopButton";

function Layout({ children }) {
  // sidebar 상태 관리 추가
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-container">
      {/* header에서 사이드바 열기 함수 전달 */}
      <Header onSidebarOpen={() => setSidebarOpen(true)} />
      <main>
        <ScrollToTopButton/>
        {children}
      </main>
      {/* 사이드바 컴포넌트 추가 */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}

export default Layout;