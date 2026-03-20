import React, { useState } from 'react';
import bg from "../../assets/images/singer_bg.png";

import MyBookmark from './MyBookmark';
import './MyMain.css';

const MyMain = () => {

  const [activeTab, setActiveTab] = useState('bookmark');
  const tabs = [
    { id: 'bookmark', label: '북마크 관리' },
    { id: 'vote', label: '투표 관리' },
    { id: 'purchase', label: '구매내역' },
    { id: 'sales', label: '판매내역' },
  ];

  return (

    <div className="my-main-container" >

        <div className="my-main-head" style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "auto 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "75% 0"
          }}>
            <div className="my-main-title">
              <h1>MYPAGE</h1>
            </div>
            <div className="my-sidebar-divider"></div>
            <ul>
                {tabs.map((tab) => (
                <li
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {/* {activeTab === tab.id && <span className="tab-indicator">●</span>} */}
                    {tab.label}
                </li>
                ))}
            </ul>      
            <div className="my-sidebar-divider"></div>
        </div>

        {/* 탭 컨텐츠 영역 */}
        <div className="tab-content">
            {activeTab === 'bookmark' && <MyBookmark/>}
            {activeTab === 'vote' && <div>투표 관리 컨텐츠</div>}
            {activeTab === 'purchase' && <div>구매내역 컨텐츠</div>}
            {activeTab === 'sales' && <div>판매내역 컨텐츠</div>}
        </div>        

    </div>
  );
};

export default MyMain;