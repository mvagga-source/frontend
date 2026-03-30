import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import bg from "../../assets/images/singer_bg.png";


import './MyMain.css';

const MyMain = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookmark');
  const tabs = [
    { id: 'bookmark', label: '북마크 관리', url:'/MyMain/Mybookmark' },
    { id: 'vote', label: '투표 관리', url:'/MyMain/MyVote' },
    { id: 'purchase', label: '구매내역', url:'/MyMain/MyPurchase' },
    { id: 'sale', label: '상품내역', url:'/MyMain/MySale' },
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
                    onClick={() => {
                      setActiveTab(tab.id)
                      navigate(tab.url)
                    }}
                >
                    {tab.label}
                </li>
                ))}
            </ul>      
            <div className="my-sidebar-divider"></div>
        </div>

        {/* 탭 컨텐츠 영역 */}
        <div className="my-main-list">
            <Outlet />
        </div>        

    </div>
  );
};

export default MyMain;