import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import bg from "../../assets/images/singer_bg.png";

import Content from "../../components/Title/ContentComp";

import './MyMain.css';

const MyMain = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'bookmark', label: '북마크 관리', url:'/MyMain/Mybookmark' },
    { id: 'vote', label: '투표 관리', url:'/MyMain/MyVote' },
    { id: 'purchase', label: '구매내역', url:'/MyMain/MyPurchase' },
    { id: 'sale', label: '상품내역', url:'/MyMain/MySale' },
    { id: 'return', label: '반품/교환내역', url:'/MyMain/MyReturn' },
  ];
  const actived  = location.pathname === "/MyMain" ? "/MyMain/Mybookmark" : location.pathname;

  return (

    // <Content TitleName="마이페이지">
    <>
      
        <div className="my-main-menu">

            <ul>
                {tabs.map((tab) => (
                <li
                    key={tab.id}
                    className={`tab-btn ${actived === tab.url ? 'active' : ''}`}
                    onClick={() => {
                      if(tab.id === 'bookmark') localStorage.removeItem("myBookMarkDate");
                      if(tab.id === 'sale') localStorage.removeItem("mySaleDate");
                      navigate(tab.url)
                    }}
                >
                    {tab.label}
                </li>
                ))}
            </ul>      
            {/* <div className="my-sidebar-divider"></div> */}
        </div>

        {/* 탭 컨텐츠 영역 */}
        <div className="my-main-list">
            <Outlet />
        </div>        

    </>
    // </Content>
  );
};

export default MyMain;