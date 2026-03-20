import React, { useState } from 'react';
import './MyMain.css';
const MyMain = () => {
  const [activeTab, setActiveTab] = useState('bookmark');
  const navItems = ['ACTION101', 'AUDITION', 'VOTE', 'SHOP', 'ENJOY'];
  
  const tabs = [
    { id: 'bookmark', label: '북마크 관리' },
    { id: 'vote', label: '투표 관리' },
    { id: 'purchase', label: '구매내역' },
    { id: 'sales', label: '판매내역' },
  ];
  return (
    <div className="mypage-container">
      {/* 배경 이미지 */}
      <div className="background-image" />
      
      {/* 상단 네비게이션 */}
      <nav className="top-nav">
        <div className="nav-inner">
          {navItems.map((item) => (
            <a key={item} href="#" className="nav-link">
              {item}
            </a>
          ))}
          <button className="menu-btn">
            <span className="hamburger-icon">☰</span>
          </button>
        </div>
      </nav>
      {/* 페이지 타이틀 */}
      <h1 className="page-title">MYPAGE</h1>
      {/* 탭 메뉴 */}
      <div className="tab-menu">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {activeTab === tab.id && <span className="tab-indicator">●</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {/* 탭 컨텐츠 영역 */}
      <div className="tab-content">
        {activeTab === 'bookmark' && <div>북마크 관리 컨텐츠</div>}
        {activeTab === 'vote' && <div>투표 관리 컨텐츠</div>}
        {activeTab === 'purchase' && <div>구매내역 컨텐츠</div>}
        {activeTab === 'sales' && <div>판매내역 컨텐츠</div>}
      </div>
    </div>
  );
};
export default MyMain;