
import { NavLink } from "react-router-dom";
import "./Mypage.css";


function Mypage({Children}){
    return(
            <div className="my-main-container" >

                <div className="my-main-head">
                    <div className="my-main-title">
                        <span>MYPAGE</span>
                    </div>
                    <ul>
                        <NavLink to="/Bookmark"><li>북마크 관리</li></NavLink>
                        <li>투표 관리</li>
                        <li>구매내역</li>
                        <li>판매내역</li>
                    </ul>

                </div>
                <div className="my-sidebar-divider"></div>

                <div className="my-main-list">
                    <main>{Children}</main>
                </div>
            </div>
    );
}

export default Mypage;