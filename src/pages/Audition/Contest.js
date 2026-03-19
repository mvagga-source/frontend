import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Contest.css";

/* ── 상수 ── */
const CUT_LINE = 10;

const AVATAR_COLORS = [
  "#1a2c4e","#1e1a2c","#1a2c1e","#2c1a1e","#1a1e2c",
  "#2c2a1a","#1e2c1a","#2a1a2c","#1a2a2c","#2c1a2a",
];

const TEAM_COLORS = {
  NOVA:   { base: "#00f2ff", win: "rgba(0,242,255,0.2)",    border: "rgba(0,242,255,0.45)"   },
  STAR:   { base: "#a78bfa", win: "rgba(167,139,250,0.2)",  border: "rgba(167,139,250,0.45)" },
  LUNA:   { base: "#34d399", win: "rgba(52,211,153,0.2)",   border: "rgba(52,211,153,0.45)"  },
  AURORA: { base: "#fbbf24", win: "rgba(251,191,36,0.2)",   border: "rgba(251,191,36,0.45)"  },
  PRISM:  { base: "#f472b6", win: "rgba(244,114,182,0.2)",  border: "rgba(244,114,182,0.45)" },
  BLAZE:  { base: "#ff7a8a", win: "rgba(255,122,138,0.2)",  border: "rgba(255,122,138,0.45)" },
  HALO:   { base: "#60a5fa", win: "rgba(96,165,250,0.2)",   border: "rgba(96,165,250,0.45)"  },
};
const DEFAULT_TC = { base: "rgba(232,244,248,0.4)", win: "rgba(232,244,248,0.1)", border: "rgba(232,244,248,0.3)" };

/* ── 더미 데이터 (추후 API 교체) ── */
const ROUNDS_DATA = {
  "1차": {
    period: "2026.01.15 ~ 2026.01.20",
    idols: [
      { id: 1,  name: "김지수", group: "NOVA",   votes: 72100 },
      { id: 2,  name: "박민준", group: "STAR",   votes: 60300 },
      { id: 3,  name: "이서연", group: "LUNA",   votes: 55800 },
      { id: 4,  name: "최하늘", group: "AURORA", votes: 44200 },
      { id: 5,  name: "정은비", group: "PRISM",  votes: 38900 },
      { id: 6,  name: "강태양", group: "BLAZE",  votes: 31200 },
      { id: 7,  name: "윤하린", group: "HALO",   votes: 27400 },
      { id: 8,  name: "오세진", group: "NOVA",   votes: 23100 },
      { id: 9,  name: "백소율", group: "LUNA",   votes: 19800 },
      { id: 10, name: "임도현", group: "STAR",   votes: 17300 },
      { id: 11, name: "신아름", group: "PRISM",  votes: 14100 },
      { id: 12, name: "류찬혁", group: "BLAZE",  votes: 11200 },
      { id: 13, name: "한소희", group: "LUNA",   votes:  9800 },
      { id: 14, name: "오지환", group: "HALO",   votes:  7600 },
      { id: 15, name: "박서준", group: "NOVA",   votes:  5400 },
    ],
    groups: [
      { name: "A조", teamA: "NOVA",  teamB: "STAR",   aPct: 40, bPct: 60 },
      { name: "B조", teamA: "LUNA",  teamB: "AURORA", aPct: 60, bPct: 40 },
      { name: "C조", teamA: "PRISM", teamB: "BLAZE",  aPct: 40, bPct: 60 },
      { name: "D조", teamA: "HALO",  teamB: "NOVA",   aPct: 60, bPct: 40 },
    ],
  },
  "2차": {
    period: "2026.02.12 ~ 2026.02.18",
    idols: [
      { id: 1,  name: "김지수", group: "NOVA",   votes: 89214 },
      { id: 2,  name: "박민준", group: "STAR",   votes: 72100 },
      { id: 3,  name: "이서연", group: "LUNA",   votes: 65833 },
      { id: 4,  name: "최하늘", group: "AURORA", votes: 51302 },
      { id: 5,  name: "정은비", group: "PRISM",  votes: 44721 },
      { id: 6,  name: "강태양", group: "BLAZE",  votes: 38490 },
      { id: 7,  name: "윤하린", group: "HALO",   votes: 33201 },
      { id: 8,  name: "오세진", group: "NOVA",   votes: 29874 },
      { id: 9,  name: "백소율", group: "LUNA",   votes: 25430 },
      { id: 10, name: "임도현", group: "STAR",   votes: 21009 },
      { id: 11, name: "신아름", group: "PRISM",  votes: 18762 },
      { id: 12, name: "류찬혁", group: "BLAZE",  votes: 15344 },
      { id: 13, name: "한소희", group: "LUNA",   votes: 13820 },
      { id: 14, name: "오지환", group: "HALO",   votes: 12940 },
      { id: 15, name: "박서준", group: "NOVA",   votes: 12100 },
    ],
    groups: [
      { name: "A조", teamA: "NOVA",  teamB: "STAR",   aPct: 55, bPct: 45 },
      { name: "B조", teamA: "LUNA",  teamB: "AURORA", aPct: 48, bPct: 52 },
      { name: "C조", teamA: "PRISM", teamB: "BLAZE",  aPct: 62, bPct: 38 },
      { name: "D조", teamA: "HALO",  teamB: "NOVA",   aPct: 44, bPct: 56 },
    ],
  },
};

const getTC = (team) => TEAM_COLORS[team] || DEFAULT_TC;

/* ── 조별 경연 카드 ── */
function GroupCard({ g }) {
  const aWin = g.aPct >= g.bPct;
  const tcA  = getTC(g.teamA);
  const tcB  = getTC(g.teamB);
  const winTC = aWin ? tcA : tcB;
  const winName = aWin ? g.teamA : g.teamB;

  return (
    <div className="ct-group-row">
      <div className="ct-group-header">
        <span className="ct-group-name">{g.name}</span>
        <span
          className="ct-winner-tag"
          style={{ background: winTC.win, border: `1px solid ${winTC.border}`, color: winTC.base }}
        >
          {winName} 승리
        </span>
      </div>

      <div className="ct-gbar-wrap">
        {/* A팀 */}
        <div
          className="ct-ga-side"
          style={{
            width: `${g.aPct}%`,
            background: aWin
              ? `linear-gradient(90deg, ${tcA.base}55 0%, ${tcA.base}22 100%)`
              : "rgba(255,255,255,0.03)",
          }}
        >
          <span className="ct-gteam-pct" style={{ color: aWin ? tcA.base : "rgba(232,244,248,0.3)" }}>
            {g.aPct}%
          </span>
        </div>
        {/* B팀 */}
        <div
          className="ct-gb-side"
          style={{
            width: `${g.bPct}%`,
            background: !aWin
              ? `linear-gradient(90deg, ${tcB.base}22 0%, ${tcB.base}55 100%)`
              : "rgba(255,255,255,0.03)",
          }}
        >
          <span className="ct-gteam-pct" style={{ color: !aWin ? tcB.base : "rgba(232,244,248,0.3)" }}>
            {g.bPct}%
          </span>
        </div>
      </div>

      <div className="ct-glabels">
        <div className="ct-glabel-item">
          <span className="ct-glabel-dot" style={{ background: aWin ? tcA.base : "rgba(232,244,248,0.18)" }} />
          <span className="ct-glabel-name" style={{ color: aWin ? tcA.base : "rgba(232,244,248,0.38)" }}>
            {g.teamA}
          </span>
          {aWin && (
            <span className="ct-win-badge" style={{ background: tcA.win, color: tcA.base, border: `1px solid ${tcA.border}` }}>
              WIN
            </span>
          )}
        </div>
        <div className="ct-glabel-item">
          {!aWin && (
            <span className="ct-win-badge" style={{ background: tcB.win, color: tcB.base, border: `1px solid ${tcB.border}` }}>
              WIN
            </span>
          )}
          <span className="ct-glabel-name" style={{ color: !aWin ? tcB.base : "rgba(232,244,248,0.38)" }}>
            {g.teamB}
          </span>
          <span className="ct-glabel-dot" style={{ background: !aWin ? tcB.base : "rgba(232,244,248,0.18)" }} />
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function Contest() {
  const navigate = useNavigate();
  const [activeRound, setActiveRound] = useState("2차");

  const data   = ROUNDS_DATA[activeRound];
  const sorted = [...data.idols].sort((a, b) => b.votes - a.votes);
  const total  = sorted.reduce((s, i) => s + i.votes, 0);
  const maxV   = sorted[0].votes;
  const top3   = sorted.slice(0, 3);
  const rest   = sorted.slice(3);

  const goToProfile = (id) => navigate(`/Audition/profile/${id}`);

  return (
    <div className="ct-wrap">

      {/* 페이지 헤더 */}
      <div className="ct-page-header">
        <h2 className="ct-page-title">경연 결과</h2>
        <p className="ct-page-sub">회차별 마감 결과</p>
      </div>

      {/* 회차 탭 + 기간 */}
      <div className="ct-topbar">
        <div className="ct-round-tabs">
          {Object.keys(ROUNDS_DATA).map((r) => (
            <button
              key={r}
              className={`ct-rtab${activeRound === r ? " on" : ""}`}
              onClick={() => setActiveRound(r)}
            >
              {r} 결과
            </button>
          ))}
        </div>
        <span className="ct-round-period">{data.period} 마감</span>
      </div>

      {/* 요약 카드 */}
      <div className="ct-summary-row">
        <div className="ct-sc">
          <p className="ct-sc-label">총 투표수</p>
          <p className="ct-sc-val">{total.toLocaleString()}</p>
          <p className="ct-sc-sub">해당 회차 누적</p>
        </div>
        <div className="ct-sc">
          <p className="ct-sc-label">참가자 수</p>
          <p className="ct-sc-val">{sorted.length}명</p>
          <p className="ct-sc-sub">진출 {CUT_LINE}명 / 탈락 {sorted.length - CUT_LINE}명</p>
        </div>
        <div className="ct-sc">
          <p className="ct-sc-label">1위 득표율</p>
          <p className="ct-sc-val">{(top3[0].votes / total * 100).toFixed(1)}%</p>
          <p className="ct-sc-sub">{top3[0].name} ({top3[0].group})</p>
        </div>
      </div>

      <div className="ct-body">

        {/* TOP 3 피라미드 */}
        <p className="ct-sec-title">TOP 3</p>
        <div className="ct-podium">
          {/* 2위 */}
          <div className="ct-pslot ct-r2" onClick={() => goToProfile(top3[1].id)}>
            <div className="ct-pav ct-r2" style={{ background: AVATAR_COLORS[(top3[1].id - 1) % AVATAR_COLORS.length] }}>
              {top3[1].name.charAt(0)}
            </div>
            <p className="ct-pname">{top3[1].name}</p>
            <p className="ct-pgroup">{top3[1].group}</p>
            <p className="ct-pvotes" style={{ color: "#c0c0c0" }}>{top3[1].votes.toLocaleString()}</p>
            <p className="ct-ppct">{(top3[1].votes / total * 100).toFixed(1)}%</p>
            <div className="ct-pbase ct-r2">2</div>
          </div>
          {/* 1위 */}
          <div className="ct-pslot ct-r1" onClick={() => goToProfile(top3[0].id)}>
            <span className="ct-crown">👑</span>
            <div className="ct-pav ct-r1" style={{ background: AVATAR_COLORS[(top3[0].id - 1) % AVATAR_COLORS.length] }}>
              {top3[0].name.charAt(0)}
            </div>
            <p className="ct-pname">{top3[0].name}</p>
            <p className="ct-pgroup">{top3[0].group}</p>
            <p className="ct-pvotes" style={{ color: "#ffd700" }}>{top3[0].votes.toLocaleString()}</p>
            <p className="ct-ppct">{(top3[0].votes / total * 100).toFixed(1)}%</p>
            <div className="ct-pbase ct-r1">1</div>
          </div>
          {/* 3위 */}
          <div className="ct-pslot ct-r3" onClick={() => goToProfile(top3[2].id)}>
            <div className="ct-pav ct-r3" style={{ background: AVATAR_COLORS[(top3[2].id - 1) % AVATAR_COLORS.length] }}>
              {top3[2].name.charAt(0)}
            </div>
            <p className="ct-pname">{top3[2].name}</p>
            <p className="ct-pgroup">{top3[2].group}</p>
            <p className="ct-pvotes" style={{ color: "#cd7f32" }}>{top3[2].votes.toLocaleString()}</p>
            <p className="ct-ppct">{(top3[2].votes / total * 100).toFixed(1)}%</p>
            <div className="ct-pbase ct-r3">3</div>
          </div>
        </div>

        {/* 4위~ 전체 결과 리스트 */}
        <p className="ct-sec-title">전체 결과</p>
        <div className="ct-result-list">
          {rest.map((idol, idx) => {
            const rank  = idx + 4;
            const isCut = rank > CUT_LINE;
            const pct   = (idol.votes / total * 100).toFixed(1);
            const barW  = Math.round(idol.votes / maxV * 100);
            const bc    = isCut ? "rgba(255,122,138,0.45)" : "var(--neon-blue)";
            const vc    = isCut ? "rgba(232,244,248,0.3)" : "var(--neon-blue)";

            return (
              <div
                key={idol.id}
                className={`ct-result-row${isCut ? " elim" : ""}`}
                onClick={() => goToProfile(idol.id)}
              >
                <span className="ct-res-rank">{String(rank).padStart(2, "0")}</span>
                <div className="ct-res-av" style={{ background: AVATAR_COLORS[(idol.id - 1) % AVATAR_COLORS.length] }}>
                  {idol.name.charAt(0)}
                </div>
                <div className="ct-res-info">
                  <p className="ct-res-name">{idol.name}</p>
                  <p className="ct-res-group">{idol.group}</p>
                </div>
                <div className="ct-res-bar-bg">
                  <div className="ct-res-bar-fill" style={{ width: `${barW}%`, background: bc }} />
                </div>
                <span className="ct-res-votes" style={{ color: vc }}>{idol.votes.toLocaleString()}</span>
                <span className="ct-res-pct">{pct}%</span>
                {isCut
                  ? <span className="ct-elim-b">탈락</span>
                  : <span className="ct-survive-b">진출</span>
                }
              </div>
            );
          })}
        </div>

        {/* 조별 경연 결과 */}
        <p className="ct-sec-title">조별 경연 결과</p>
        <div className="ct-group-list">
          {data.groups.map((g) => (
            <GroupCard key={g.name} g={g} />
          ))}
        </div>

      </div>
    </div>
  );
}