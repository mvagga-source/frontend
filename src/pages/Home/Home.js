import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import bg from "../../assets/logo/101LOGO.png";

// 실제 데이터 대신 사용할 더미 데이터들
const VOTE_DATA = [
  { rank: 1, name: "김지수", group: "NOVA",   votes: 89214, pct: 100 },
  { rank: 2, name: "박민준", group: "STAR",   votes: 72100, pct: 81  },
  { rank: 3, name: "이서연", group: "LUNA",   votes: 65833, pct: 74  },
  { rank: 4, name: "최하늘", group: "AURORA", votes: 51302, pct: 58  },
  { rank: 5, name: "정은비", group: "PRISM",  votes: 44721, pct: 50  },
];

const POSTS = [
  { id: 1, category: "응원", title: "김지수 오늘 무대 진짜 대박...",   author: "팬팬팬",  ago: "5분 전"   },
  { id: 2, category: "정보", title: "이번 주 스케줄 정리했어요",        author: "스케줄러", ago: "12분 전"  },
  { id: 3, category: "응원", title: "박민준 직캠 영상 보고 왔는데...", author: "팬팬팬",  ago: "34분 전"  },
  { id: 4, category: "정보", title: "2차 오디션 투표 방법 총정리",      author: "인포봇",  ago: "52분 전"  },
  { id: 5, category: "후원", title: "광고 펀딩 달성했대요!",            author: "광고팀장", ago: "1시간 전" },
];

const CATEGORY_COLOR = {
  응원: { bg: "rgba(0,242,255,0.12)",   color: "var(--neon-blue)" },
  정보: { bg: "rgba(100,160,255,0.15)", color: "#64a0ff"          },
  후원: { bg: "rgba(255,180,100,0.15)", color: "#ffb464"          },
};

const VIDEOS = [
  { id: 1, title: "김지수 - 2차 오디션 풀 무대",   channel: "조회수 12만회",  color: "#1a2c4e" },
  { id: 2, title: "박민준 - 퍼포먼스 직캠",         channel: "조회수 8.9만회", color: "#1e1a2c" },
  { id: 3, title: "이서연 - 랩 & 보컬 무대",       channel: "조회수 7.2만회", color: "#1a2c1e" },
  { id: 4, title: "최하늘 - 아카펠라 깜짝 무대",   channel: "조회수 5.6만회", color: "#2c1a1e" },
  { id: 5, title: "정은비 - 댄스 배틀 풀영상",     channel: "조회수 4.8만회", color: "#1a1e2c" },
];

const rankColor = (rank) => {
  if (rank === 1) return "#ffd700";
  if (rank === 2) return "#c0c0c0";
  if (rank === 3) return "#cd7f32";
  return "rgba(0,242,255,0.45)";
};

// 투표 마감일 (예시로 2026년 3월 20일로 설정)
const DEADLINE = new Date("2026-03-20T23:59:59").getTime();

// 투표 마감까지 남은 시간 계산하는 커스텀 훅
function useCountdown() {
  const calc = () => {
    const diff = Math.max(0, DEADLINE - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000)  / 60000),
      s: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// 홈 페이지 컴포넌트
const Home = () => {
  const [revealed, setRevealed] = useState(false);
  const countdown = useCountdown();
  const pad = (n) => String(n).padStart(2, "0");

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="home-wrap">
      <section className="home-hero">
        {/* style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "auto 500px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50% 200px"
          }}> */}
        <span className="hero-bg-text" aria-hidden="true">ACTION</span>
        <p className={`hero-eyebrow${revealed ? " reveal" : ""}`}>AUDITION PLATFORM</p> 
        <h1 className={`hero-title${revealed ? " reveal" : ""}`}>
          디렉터 여러분들,<br />
          당신의 손으로<br />
          <span className="hero-accent">아이돌</span>에게 투표하세요
        </h1>
        <p className={`hero-sub${revealed ? " reveal" : ""}`}>
          전국 최대 아이돌 오디션 플랫폼<br />
          지금 바로 나만의 스타를 발굴하세요
        </p>
        <div className={`hero-timer${revealed ? " reveal" : ""}`}>
          <p className="timer-label">2차 오디션 투표 마감까지</p>
          <div className="timer-blocks">
            <div className="timer-unit">
              <span className="timer-num">{pad(countdown.d)}</span>
              <span className="timer-text">DAYS</span>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-unit">
              <span className="timer-num">{pad(countdown.h)}</span>
              <span className="timer-text">HOURS</span>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-unit">
              <span className="timer-num">{pad(countdown.m)}</span>
              <span className="timer-text">MINS</span>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-unit">
              <span className="timer-num">{pad(countdown.s)}</span>
              <span className="timer-text">SECS</span>
            </div>
          </div>
        </div>
        <div className={`hero-cta${revealed ? " reveal" : ""}`}>
          <Link to="/Audition"       className="home-btn-primary">투표 참여하기</Link>
          <Link to="/ActionCalendar" className="home-btn-ghost">오디션 일정</Link>
        </div>
      </section>

      <div className="home-grid">
        <section className="home-rank-section">
          <div className="home-sec-header">
            <span className="home-sec-label">LIVE RANKING</span>
            <span className="home-live-dot">● LIVE</span>
          </div>
          <div className="home-rank-list">
            {VOTE_DATA.map((v) => (
              <div className="home-rank-row" key={v.rank}>
                <span className="home-rank-num" style={{ color: rankColor(v.rank) }}>
                  {pad(v.rank)}
                </span>
                <div className="home-rank-info">
                  <div className="home-rank-names">
                    <span className="home-rank-name">{v.name}</span>
                    <span className="home-rank-group">{v.group}</span>
                  </div>
                  <div className="home-rank-bar-bg">
                    <div className="home-rank-bar-fill"
                      style={{ width: `${v.pct}%`, background: rankColor(v.rank) }} />
                  </div>
                </div>
                <span className="home-rank-votes" style={{ color: rankColor(v.rank) }}>
                  {v.votes.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="home-posts-section">
          <div className="home-sec-header">
            <span className="home-sec-label">최신 게시글</span>
          </div>
          <div className="home-posts-box">
            <ul className="home-post-list">
              {POSTS.map((p) => {
                const cat = CATEGORY_COLOR[p.category] || CATEGORY_COLOR["정보"];
                return (
                  <li key={p.id} className="home-post-item">
                    <span className="home-post-cat" style={{ background: cat.bg, color: cat.color }}>
                      {p.category}
                    </span>
                    <div className="home-post-body">
                      <span className="home-post-title">{p.title}</span>
                      <span className="home-post-meta">{p.author} · {p.ago}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link to="/Community" className="home-box-more">더보기</Link>
          </div>
        </section>
      </div>

      <section className="home-videos-section">
        <div className="home-sec-header">
          <span className="home-sec-label">최신 동영상</span>
        </div>
        <div className="home-videos-box">
          <div className="home-video-grid">
            {VIDEOS.slice(0, 4).map((v) => (
              <Link to="/MVideo" key={v.id} className="home-video-card">
                <div className="home-video-thumb" style={{ background: v.color }}>
                  <span className="home-video-play">▶</span>
                </div>
                <p className="home-video-title">{v.title}</p>
                <p className="home-video-channel">{v.channel}</p>
              </Link>
            ))}
          </div>
          <Link to="/MVideo" className="home-box-more">더보기</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;