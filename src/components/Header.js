// import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header({ onSidebarOpen }) {

   const { user, logout } = useAuth();

  return (
    <header>
     {/* 상단 네비게이션 */}
      <nav className="top-nav">

        <Link to="/"><span>AUDITION</span></Link>

        <span>오디션방식</span>

        <Link to="/Calendar"><span>오디션일정</span></Link>

        <span>아이돌 굿즈샵</span>

        <Link to="/MVideo"><span>아이돌 동영상</span></Link>
        
        <div class="nav-item has-dropdown">
          <span>마이페이지</span>
          <div class="dropdown-menu">
            <Link to="/Mypage">북마크관리</Link>
            <Link to="/Vote">투표관리</Link>
            <Link to="/Mypage">구매관리</Link>
            <Link to="/Mypage">판매관리</Link>                        
          </div>
        </div>

        {user? 
          (<>
            <span>{user.name}님</span>
            <button onClick={logout}>로그아웃</button>
          </>):(
            <Link to="/UserLogin"><span>로그인</span></Link>
          )}

          {/* 사이드바 열기 버튼 */}
          <button className="nav-sidebar-btn" onClick={onSidebarOpen} aria-label="메뉴 열기">
            ☰
          </button>       
      </nav>
    </header>
  );
}

export default Header;