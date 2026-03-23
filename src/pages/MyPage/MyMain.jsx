import React, { useState } from 'react';
import bg from "../../assets/images/singer_bg.png";

import MyBookmark from './MyBookmark';
import MyVote from './MyVote';
import MyPurchase from './MyPurchase';
import MySale from './MySale';

import './MyMain.css';

const MyMain = () => {

  const [activeTab, setActiveTab] = useState('bookmark');
  const tabs = [
    { id: 'bookmark', label: '북마크 관리' },
    { id: 'vote', label: '투표 관리' },
    { id: 'purchase', label: '구매내역' },
    { id: 'sale', label: '판매내역' },
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
            {activeTab === 'vote' && <div><MyVote/></div>}
            {activeTab === 'purchase' && <div><MyPurchase/></div>}
            {activeTab === 'sale' && <div><MySale/></div>}
        </div>        

    </div>
  );
};

export default MyMain;