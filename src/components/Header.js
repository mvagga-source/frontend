import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo/23.png";

function Header({ onSidebarOpen }) {
  return (

    <>

    <header className="hd-header">

      {/* 로고 영역 */}
      <div className="hd-logo-area">
        <NavLink to="/" className="hd-logo-link">
          {/* 로고 이미지 있을 때: <img src={logo} alt="ACTION101" className="hd-logo-img" /> */}
          <div className="hd-logo-text">
            <span className="hd-logo-pre">ACTION 101</span>
            <span className="hd-logo-number"><img src={logo} alt="logo" className="logo" style={{width:"150px"}} /></span>
            <span className="hd-logo-sub">KOREA</span>
          </div>
          <span className="hd-logo-tagline">FIND YOUR STAR</span>
        </NavLink>
      </div>
    </header>

    {/* 네비게이션 바 */}
    <nav className="hd-nav-bar">
      <div className="hd-nav-links">

        <NavLink to="/" end className={({ isActive }) => "hd-nav-link" + (isActive ? " active" : "")}>
          ACTION101
        </NavLink>

        <div className="hd-nav-divider" />

        {/* 오디션 드롭다운 */}
        {/* <div className="hd-nav-item has-dropdown">
          <span className="hd-nav-link">
            오디션 <span className="hd-arrow">▾</span>
          </span>
          <div className="hd-dropdown-menu">
            <NavLink to="/Process">프로그램 소개</NavLink>
            <NavLink to="/Schedule">일정표</NavLink>
            <NavLink to="/Audition/idols">참가자 명단</NavLink>
          </div>
        </div> */}

        <NavLink to="/Audition/idols" className={({ isActive }) => "hd-nav-link" + (isActive ? " active" : "")}>
          참가자 명단
        </NavLink>        

        <div className="hd-nav-divider" />

        <NavLink to="/Audition/vote" className={({ isActive }) => "hd-nav-link" + (isActive ? " active" : "")}>
          투표하기
        </NavLink>

        <div className="hd-nav-divider" />

        {/* 경연 결과 드롭다운 */}
        <div className="hd-nav-item has-dropdown">
          <span className="hd-nav-link">
            경연 결과 <span className="hd-arrow">▾</span>
          </span>
          <div className="hd-dropdown-menu">
            <NavLink to="/Audition/contest/ranking">개인 순위</NavLink>
            <NavLink to="/Audition/contest/team">팀 경연</NavLink>
          </div>
        </div>

        <div className="hd-nav-divider" />

        <NavLink to="/GoodsList" className={({ isActive }) => "hd-nav-link" + (isActive ? " active" : "")}>
          굿즈샵
        </NavLink>

        <div className="hd-nav-divider" />

        <NavLink to="/MVideo" className={({ isActive }) => "hd-nav-link" + (isActive ? " active" : "")}>
          비디오
        </NavLink>

        <div className="hd-nav-divider" />

        <NavLink to="/Community" className={({ isActive }) => "hd-nav-link" + (isActive ? " active" : "")}>
          커뮤니티
        </NavLink>

        <div className="hd-nav-divider" />
        <button className="hd-nav-sidebar-btn" onClick={onSidebarOpen}>☰</button>
      </div>

      {/* 우측 버튼 영역 */}
      <div className="hd-nav-right">
        {/* <NavLink to="/login" className="hd-btn-login">로그인</NavLink>
        <NavLink to="/Audition/vote" className="hd-btn-vote">투표하기 ▶</NavLink> */}
        {/* <button className="hd-nav-sidebar-btn" onClick={onSidebarOpen}>☰</button> */}
      </div>
    </nav>

  </>

  );
}

export default Header;
