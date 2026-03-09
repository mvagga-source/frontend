
import "./Footer.css"

function Footer() {

  return(

    <footer className="site-footer">
      <div className="info-notice-box">
        <p className="notice-title">
          ※ <strong>'ACTION 101'</strong> 게시판 운영 시간 : <strong>평일 10:00 ~ 18:00 (주말, 공휴일 제외)</strong>
        </p>
        <ul className="notice-list">
          <li>게시물이 접수된 순서에 따라 순차적으로 답변을 남겨 드리지만, 동일/유사한 내용의 접수 건에 대해서는 우선적으로 답변이 남겨질 수 있습니다.</li>
          <li>광고, 도배 등 FAQ에 안내된 '종결 유형' 및 게시판 운영 취지에 맞지 않는 부적절한 게시물은 답변 없이 종결될 수 있습니다.</li>
          <li>폭언, 욕설, 협박 등의 글을 남기실 경우, 산업안전보건법 등 관련 법에 따라 조치될 수 있습니다.</li>
        </ul>
      </div>
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