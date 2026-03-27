import React, { useState } from 'react';
import bg from "../../assets/images/singer_bg.png";
import AVideo from './AVideo';
import ABookmark from './ABookmark';
import './AdminMain.css';

const AdminMain = () => {

  const [activeTab, setActiveTab] = useState('bookmark');
  const tabs = [
    { id: 'bookmark', label: '북마크 관리' },
    { id: 'video', label: '비디오 관리' },
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
              <h1>Admin</h1>
            </div>
            <div className="my-sidebar-divider"></div>
            <ul>
                {tabs.map((tab) => (
                <li
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </li>
                ))}
            </ul>      
            <div className="my-sidebar-divider"></div>
        </div>

        {/* 탭 컨텐츠 영역 */}
        <div className="tab-content">
            {activeTab === 'bookmark' && <div><ABookmark/></div>}
            {activeTab === 'video' && <div><AVideo/></div>}
        </div>        

    </div>
  );
};

export default AdminMain;