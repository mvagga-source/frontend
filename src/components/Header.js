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

        <div className="hd-nav-item has-dropdown">
          <span>오디션</span>
          <div className="hd-dropdown-menu">
            <NavLink>오디션방식</NavLink>
            <NavLink to="/Calendar">오디션일정</NavLink>            
            <NavLink to="/Audition/idols">참가자</NavLink>
            <NavLink to="/Audition/ranking">실시간랭킹</NavLink>
          </div>          
        </div>

        <NavLink to="/Audition/vote" className="hd-nav-item">
          투표참여
        </NavLink>

        <NavLink to="/Audition/contest" className="hd-nav-item">
          경연결과
        </NavLink>        

        <span className="nav-item">굿즈상점</span>

        <NavLink to="/MVideo" className="hd-nav-item">
          뮤직비디오
        </NavLink>

        <div className="hd-nav-item has-dropdown">
          <span>마이페이지</span>
          <div className="hd-dropdown-menu">
            <NavLink to="/Bookmark">북마크관리</NavLink>
            <NavLink to="/Bookmark">투표관리</NavLink>
            <NavLink to="/Bookmark">구매관리</NavLink>
            <NavLink to="/Bookmark">판매관리</NavLink>                        
          </div>
        </div>

        <div className="hd-nav-item has-dropdown">
          <span>커뮤니티</span>
          <div className="hd-dropdown-menu">
            <Link to="/BoardList">자유게시판</Link>
            <Link to="/QnA">문의/아이디어제안/신고</Link>
          </div>
        </div>   
        
        {/* 사이드바 열기 버튼 */}
        <button className="hd-nav-sidebar-btn" onClick={onSidebarOpen}>
          ☰
        </button>

      </nav>
    </header>
  );
}

export default Header;