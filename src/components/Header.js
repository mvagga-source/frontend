// import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header({ onSidebarOpen }) {

  return (
    <header>
      {/* 상단 네비게이션 */}
      <nav className="hd-top-nav">

        <NavLink to="/" className="hd-nav-item">
          ACTION101
        </NavLink>

        <span className="hd-nav-item">오디션방식</span>

        <NavLink to="/Calendar" className="hd-nav-item">
          오디션일정
        </NavLink>

        <span className="nav-item">아이돌 굿즈샵</span>

        <NavLink to="/MVideo" className="hd-nav-item">
          아이돌 동영상
        </NavLink>

        <div className="hd-nav-item has-dropdown">
          <span>마이페이지</span>
          <div className="hd-dropdown-menu">
            <NavLink to="/Bookmark">북마크관리</NavLink>
            <NavLink to="/Vote">투표관리</NavLink>
            <NavLink to="/Bookmark">구매관리</NavLink>
            <NavLink to="/Bookmark">판매관리</NavLink>                        
          </div>
        </div>

        <button className="hd-nav-sidebar-btn" onClick={onSidebarOpen}>
          ☰
        </button>

      </nav>
    </header>
  );
}

export default Header;