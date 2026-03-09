import "./Home.css"

const Home = () => {
  // --- 새로 추가된 상태 관리 (사이드바 & 공지) ---

  return (
    <div>
        
          <div className="hero-text">
            
            <h1>디렉터 여러분들, <br/> 당신의 손으로 <br/> <span>아이돌</span>에게 투표하세요</h1>
            <div className="scroll-hint">SCROLL ▽</div>
          </div>
        
    </div>
  );
};

export default Home;