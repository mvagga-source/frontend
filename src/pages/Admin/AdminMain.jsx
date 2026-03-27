import React, { useState } from 'react';
import bg from "../../assets/images/singer_bg.png";
import AVideo from './AVideo';
import ASchedule from './ASchedule';
import './AdminMain.css';

const AdminMain = () => {

  const [activeTab, setActiveTab] = useState('schedule');
  const tabs = [
    { id: 'schedule', label: '스케줄 관리' },
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
            {activeTab === 'schedule' && <div><ASchedule/></div>}
            {activeTab === 'video' && <div><AVideo/></div>}
        </div>        

    </div>
  );
};

export default AdminMain;