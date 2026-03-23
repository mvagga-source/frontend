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
          <span>AUDITION</span>
          <div className="hd-dropdown-menu">
            <NavLink to="/Process">INTRO.</NavLink>
            <NavLink to="/Schedule">SCHEDULE</NavLink>            
            <NavLink to="/Audition/idols">MEMBER</NavLink>
            {/* <NavLink to="/Audition/ranking">LIVE</NavLink> */}
          </div>          
        </div>

        <div className="hd-nav-item has-dropdown">
          <span>VOTE</span>
          <div className="hd-dropdown-menu">
            <Link to="/Audition/vote">PICK ME</Link>            
            <Link to="/Audition/contest">RANKING</Link>
          </div>
        </div>   

        <NavLink to="/GoodsList" className="hd-nav-item">
        <span className="nav-item">SHOP</span>
        </NavLink>

        <div className="hd-nav-item has-dropdown">
          <span>ENJOY</span>
          <div className="hd-dropdown-menu">
            <Link to="/MVideo">VIDEO</Link>            
            <Link to="/BoardList">COMMUNITY</Link>

            {/* <Link to="/BoardList">자유게시판</Link>
            <Link to="/QnA">문의/아이디어제안/신고</Link> */}
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