
import "./Footer.css"

function Footer() {

  return(

    <footer className="site-footer">
      <div className="footer-bottom">
        <div className="footer-left">
          <div className="service-dropdown">
            서비스 문의 열기 <span className="arrow">∨</span>
          </div>
          <nav className="footer-nav">
            <span>개인정보처리방침</span>
            <span>이용약관</span>
          </nav>
        </div>
        <div className="footer-right">
          <span className="copyright">© ACTION 101 ENTERTAINMENT</span>
        </div>
      </div>

    </footer>
  );
}

export default Footer;