import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo/action101.png";
import { Link } from "react-router-dom";
import "./Header.css"

function Header() {

  const { user, logout } = useAuth();

  return (
    <header>
     {/* 상단 네비게이션 */}
      <nav className="top-nav">
        <div className="nav-item has-dropdown">
          <Link to="/"><span>AUDITION</span></Link>
        </div>
        <span>오디션방식</span>
        <span>오디션일정</span>        
        <span>아이돌 굿즈샵</span>
        <span>VIDEO</span>
        <div className="nav-item has-dropdown">
          <span>마이페이지</span>
          <div className="dropdown-menu">
            <Link to="/Mypage">북마크관리</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;