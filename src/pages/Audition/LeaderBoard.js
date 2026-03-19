import { useState, useEffect } from "react";
import "./LeaderBoard.css";

/* ── 더미 데이터 (추후 API 교체) ── */
const CUT_LINE = 10; // 탈락 컷트라인 (관리자 조정값)

const IDOLS = [
  { id: 1,  name: "김지수", group: "NOVA",   votes: 89214, change: "same"        },
  { id: 2,  name: "박민준", group: "STAR",   votes: 72100, change: "up",   diff: 1 },
  { id: 3,  name: "이서연", group: "LUNA",   votes: 65833, change: "down", diff: 1 },
  { id: 4,  name: "최하늘", group: "AURORA", votes: 51302, change: "up",   diff: 2 },
  { id: 5,  name: "정은비", group: "PRISM",  votes: 44721, change: "same"        },
  { id: 6,  name: "강태양", group: "BLAZE",  votes: 38490, change: "down", diff: 2 },
  { id: 7,  name: "윤하린", group: "HALO",   votes: 33201, change: "up",   diff: 1 },
  { id: 8,  name: "오세진", group: "NOVA",   votes: 29874, change: "down", diff: 1 },
  { id: 9,  name: "백소율", group: "LUNA",   votes: 25430, change: "down", diff: 1 },
  { id: 10, name: "임도현", group: "STAR",   votes: 21009, change: "same"        },
  { id: 11, name: "신아름", group: "PRISM",  votes: 18762, change: "up",   diff: 1 },
  { id: 12, name: "류찬혁", group: "BLAZE",  votes: 15344, change: "down", diff: 1 },
  { id: 13, name: "한소희", group: "LUNA",   votes: 13820, change: "same"        },
  { id: 14, name: "오지환", group: "HALO",   votes: 12940, change: "up",   diff: 2 },
  { id: 15, name: "박서준", group: "NOVA",   votes: 12100, change: "down", diff: 1 },
];

const AVATAR_COLORS = [
  "#1a2c4e","#1e1a2c","#1a2c1e","#2c1a1e","#1a1e2c",
  "#2c2a1a","#1e2c1a","#2a1a2c","#1a2a2c","#2c1a2a",
];

const DEADLINE = new Date("2026-02-18T23:59:59").getTime();

const totalVotes = IDOLS.reduce((s, i) => s + i.votes, 0);
const maxVotes   = Math.max(...IDOLS.map((i) => i.votes));

const rankColor = (rank) => {
  if (rank === 1) return "#ffd700";
  if (rank === 2) return "#c0c0c0";
  if (rank === 3) return "#cd7f32";
  return null;
};

/* ── 카운트다운 훅 ── */
function useCountdown() {
  const calc = () => {
    const diff = Math.max(0, DEADLINE - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000)  / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ── 순위 변동 컴포넌트 ── */
function ChangeTag({ change, diff }) {
  if (change === "up")   return <span className="lb-change lb-up">▲{diff}</span>;
  if (change === "down") return <span className="lb-change lb-down">▼{diff}</span>;
  return <span className="lb-change lb-same">—</span>;
}

/* ── 컴포넌트 ── */
export default function LeaderBoard() {
  const sorted = [...IDOLS].sort((a, b) => b.votes - a.votes);
  const timer  = useCountdown();
  const pad    = (n) => String(n).padStart(2, "0");

  return (
    <div className="lb-wrap">

      {/* 페이지 헤더 */}
      <div className="lb-page-header">
        <h2 className="lb-page-title">랭킹</h2>
        <p className="lb-page-sub">2차 오디션 실시간 순위</p>
      </div>

      {/* 상단 바 */}
      <div className="lb-topbar">
        <div className="lb-live-badge">
          <span className="lb-live-dot" />
          LIVE
        </div>
        <p className="lb-deadline-text">투표 마감: 2026.02.18 23:59</p>
      </div>

      {/* 요약 카드 */}
      <div className="lb-summary-row">
        <div className="lb-sc">
          <p className="lb-sc-label">총 투표수</p>
          <p className="lb-sc-val">{totalVotes.toLocaleString()}</p>
          <p className="lb-sc-sub">전체 누적</p>
        </div>
        <div className="lb-sc">
          <p className="lb-sc-label">참가자 수</p>
          <p className="lb-sc-val">{IDOLS.length}명</p>
          <p className="lb-sc-sub">진출 {CUT_LINE}명 / 탈락 {IDOLS.length - CUT_LINE}명</p>
        </div>
        <div className="lb-sc">
          <p className="lb-sc-label">마감까지</p>
          <p className="lb-sc-val">{pad(timer.h)}:{pad(timer.m)}:{pad(timer.s)}</p>
          <p className="lb-sc-sub">2026.02.18 23:59</p>
        </div>
      </div>

      {/* 컷트라인 안내 */}
      <div className="lb-cutline-notice">
        <span className="lb-cut-dot" />
        상위 {CUT_LINE}명이 다음 라운드로 진출합니다. 컷트라인 아래는 탈락 예정입니다.
      </div>

      {/* 순위 리스트 */}
      <div className="lb-rank-list">
        <div className="lb-rank-header">
          <span className="lb-col-rank">순위</span>
          <span className="lb-col-idol">참가자</span>
          <span className="lb-col-bar">득표현황</span>
          <span className="lb-col-votes">득표수</span>
          <span className="lb-col-pct">비율</span>
        </div>

        {sorted.map((idol, idx) => {
          const rank   = idx + 1;
          const isCut  = rank > CUT_LINE;
          const pct    = (idol.votes / totalVotes * 100).toFixed(1);
          const barW   = Math.round(idol.votes / maxVotes * 100);
          const rc     = rankColor(rank);
          const vColor = rc ? rc : isCut ? "rgba(232,244,248,0.3)" : "var(--neon-blue)";
          const nColor = rc ? rc : isCut ? "rgba(232,244,248,0.2)" : "rgba(232,244,248,0.45)";
          const color  = AVATAR_COLORS[(idol.id - 1) % AVATAR_COLORS.length];

          return (
            <div key={idol.id}>
              {/* 컷트라인 구분선 */}
              {rank === CUT_LINE + 1 && (
                <div className="lb-cutline-div">
                  <div className="lb-cl-line" />
                  <span className="lb-cl-text">— 탈락 컷트라인 —</span>
                  <div className="lb-cl-line" />
                </div>
              )}

              <div className={`lb-rank-row${isCut ? " cut" : ""}`}>
                {/* 순위 번호 */}
                <span className="lb-col-rank lb-rank-num" style={{ color: nColor }}>
                  {pad(rank)}
                </span>

                {/* 참가자 정보 */}
                <div className="lb-col-idol lb-idol-cell">
                  <div className="lb-avatar" style={{ background: color }}>
                    {idol.name.charAt(0)}
                  </div>
                  <div className="lb-idol-info">
                    <span className="lb-idol-name">{idol.name}</span>
                    <span className="lb-idol-group">{idol.group}</span>
                  </div>
                  <ChangeTag change={idol.change} diff={idol.diff} />
                </div>

                {/* 득표 바 */}
                <div className="lb-col-bar">
                  <div className="lb-bar-bg">
                    <div
                      className={`lb-bar-fill${isCut ? " cut" : ""}`}
                      style={{ width: `${barW}%` }}
                    />
                  </div>
                </div>

                {/* 득표수 */}
                <span className="lb-col-votes lb-votes-num" style={{ color: vColor }}>
                  {idol.votes.toLocaleString()}
                </span>

                {/* 비율 */}
                <span className="lb-col-pct lb-pct-num">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}