// import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo/23.png"

function Header({ onSidebarOpen }) {

  return (
    <header>
      {/* 상단 네비게이션 */}
      <nav className="hd-top-nav">

        <NavLink to="/" className="hd-nav-item">
          {/* <img src={logo} style={{height:'50px',marginTop:'8px'}} /> */}
          ACTION101
        </NavLink>

        <div className="hd-nav-item has-dropdown">
          <span>오디션</span>
          <div className="hd-dropdown-menu">
            <NavLink to="/Process">프로그램 소개</NavLink>
            <NavLink to="/Schedule">일정표</NavLink>            
            <NavLink to="/Audition/idols">참가자 명단</NavLink>
          </div>          
        </div>

        <NavLink to="/Audition/vote" className="hd-nav-item">
          <span className="nav-item">투표하기</span>
        </NavLink>

        <div className="hd-nav-item has-dropdown">
          <span>경연 결과</span>
          <div className="hd-dropdown-menu">
            <NavLink to="/Audition/contest/ranking">개인순위</NavLink>            
            <NavLink to="/Audition/contest/team">팀 경연</NavLink>
          </div>
        </div>

        <NavLink to="/GoodsList" className="hd-nav-item">
          <span className="nav-item">굿즈샵</span>
        </NavLink>

        <NavLink to="/MVideo" className="hd-nav-item">
          <span className="nav-item">비디오</span>
        </NavLink>

        <NavLink to="/Community" className="hd-nav-item">
          <span className="nav-item">커뮤니티</span>
        </NavLink>
        
        {/* 사이드바 열기 버튼 */}
        <button className="hd-nav-sidebar-btn" onClick={onSidebarOpen}>
          ☰
        </button>

      </nav>
    </header>
  );
}

export default Header;