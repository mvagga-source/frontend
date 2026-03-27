import { useState } from "react";
import "./TeamCompetition.css";

/* ── 아바타 색상 ── */
const AVATAR_COLORS = [
  "#2d4a7a","#3a2d6b","#2d6b3a","#6b2d3a","#2d3a6b",
  "#6b5a2d","#3a6b2d","#5a2d6b","#2d5a6b","#6b2d5a",
];

/* ── 더미 데이터 (추후 API 교체) ── */
const ROUNDS_DATA = {
  "2차": {
    period: "2026.02.02 ~ 2026.02.08",
    matches: [
      {
        round: "A조",
        teamA: "NOVA팀", teamB: "STAR팀", aPct: 55, bPct: 45,
        membersA: ["김지수","오세진","박서준","최유나","이준혁","한채원","정민서","윤소아","강태민","임나영"],
        membersB: ["박민준","임도현","송지아","윤태양","강민하","류찬혁","김하율","오지혜","신동욱","배소이"],
      },
      {
        round: "B조",
        teamA: "LUNA팀", teamB: "AURORA팀", aPct: 48, bPct: 52,
        membersA: ["이서연","백소율","한소희","고윤정","차은서","문준영","박지유","전하은","남기현","조예린"],
        membersB: ["최하늘","남주혁","박보영","위하준","손예림","정해인","이나은","황민찬","서지현","고은채"],
      },
      {
        round: "C조",
        teamA: "PRISM팀", teamB: "BLAZE팀", aPct: 62, bPct: 38,
        membersA: ["정은비","신아름","변우석","김유정","오지훈","이지은","장도윤","류혜원","최성민","안지수"],
        membersB: ["강태양","류찬하","전소연","박찬열","김민재","이수현","최준서","문하린","서준혁","김나연"],
      },
      {
        round: "D조",
        teamA: "HALO팀", teamB: "ECHO팀", aPct: 44, bPct: 56,
        membersA: ["윤하린","오지환","송강민","김태리","이도현","박하늘","한지민","장원영","민서진","채준호"],
        membersB: ["김도윤","이하나","박재현","송유리","한승우","정소영","오현택","배지현","최민기","윤아영"],
      },
    ],
  },
  "3차": {
    period: "2026.03.02 ~ 2026.03.08",
    matches: [
      {
        round: "가조",
        teamA: "가팀", teamB: "나팀", aPct: 58, bPct: 42,
        membersA: ["김지수","박민준","이서연","최하늘","정은비","강태양","윤하린","오세진","백소율","임도현"],
        membersB: ["신아름","류찬혁","한소희","오지환","박서준","최유나","이준혁","한채원","정민서","윤소아"],
      },
      {
        round: "나조",
        teamA: "다팀", teamB: "라팀", aPct: 45, bPct: 55,
        membersA: ["강태민","임나영","박민준","임도현","송지아","윤태양","강민하","류찬혁","김하율","오지혜"],
        membersB: ["이서연","백소율","한소희","고윤정","차은서","최하늘","남주혁","박보영","위하준","손예림"],
      },
      {
        round: "다조",
        teamA: "마팀", teamB: "바팀", aPct: 51, bPct: 49,
        membersA: ["정은비","신아름","변우석","김유정","오지훈","이지은","장도윤","류혜원","최성민","안지수"],
        membersB: ["강태양","류찬하","전소연","박찬열","김민재","이수현","최준서","문하린","서준혁","김나연"],
      },
    ],
  },
};

const avColor = (idx) => AVATAR_COLORS[idx % AVATAR_COLORS.length];

/* ── 팀원 칩 ── */
function MemberChip({ name, colorIdx, isWin }) {
  return (
    <div className={`tc-chip${isWin ? " win" : ""}`}>
      <div className="tc-mav" style={{ background: avColor(colorIdx) }}>
        {name.charAt(0)}
      </div>
      <span className="tc-mname">{name}</span>
    </div>
  );
}

/* ── 대결 카드 ── */
function MatchCard({ match, idx }) {
  const aWin   = match.aPct >= match.bPct;
  const aBg    = AVATAR_COLORS[idx * 2 % AVATAR_COLORS.length];
  const bBg    = AVATAR_COLORS[(idx * 2 + 1) % AVATAR_COLORS.length];
  const aColor = aWin ? "tc-color-win" : "tc-color-lose";
  const bColor = !aWin ? "tc-color-win" : "tc-color-lose";

  return (
    <div className="tc-mcard">
      {/* 조 이름 */}
      <div className="tc-mtop">
        <span className="tc-mround">{match.round}</span>
      </div>

      {/* VS 대결 */}
      <div className="tc-mrow">
        <div className={`tc-team${aWin ? " win" : " lose"}`} style={{ alignItems: "flex-end" }}>
          <div className="tc-team-av" style={{ background: aBg }}>
            {match.teamA.charAt(0)}
          </div>
          <p className="tc-team-name">{match.teamA}</p>
          {aWin && <span className="tc-win-b">🏆 승리</span>}
        </div>

        <div className="tc-vsbox">
          <span className="tc-vstxt">VS</span>
          <div className="tc-score-row">
            <span className={`tc-score${aWin ? " sw" : " sl"}`}>{match.aPct}</span>
            <span className="tc-sep">:</span>
            <span className={`tc-score${!aWin ? " sw" : " sl"}`}>{match.bPct}</span>
          </div>
          <span className="tc-vstxt tc-pct-label">득표율(%)</span>
        </div>

        <div className={`tc-team${!aWin ? " win" : " lose"}`} style={{ alignItems: "flex-start" }}>
          <div className="tc-team-av" style={{ background: bBg }}>
            {match.teamB.charAt(0)}
          </div>
          <p className="tc-team-name">{match.teamB}</p>
          {!aWin && <span className="tc-win-b">🏆 승리</span>}
        </div>
      </div>

      {/* 팀 구성 */}
      <div className="tc-member-area">
        <p className="tc-member-label">팀 구성</p>
        <div className="tc-member-grid">
          {/* A팀 */}
          <div>
            <p className={`tc-col-title ${aColor}`}>{match.teamA}</p>
            <div className="tc-chips">
              {match.membersA.map((name, j) => (
                <MemberChip key={j} name={name} colorIdx={j} isWin={aWin} />
              ))}
            </div>
          </div>
          {/* B팀 */}
          <div>
            <p className={`tc-col-title ${bColor}`}>{match.teamB}</p>
            <div className="tc-chips">
              {match.membersB.map((name, j) => (
                <MemberChip key={j} name={name} colorIdx={j + 5} isWin={!aWin} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function TeamCompetition() {
  const [activeRound, setActiveRound] = useState("3차");

  const data = ROUNDS_DATA[activeRound];

  return (
    <div className="tc-wrap">

      {/* 페이지 헤더 */}
      <div className="tc-page-header">
        <h2 className="tc-page-title">팀 경연</h2>
        <p className="tc-page-sub">회차별 팀 대결 결과</p>
      </div>

      {/* 회차 탭 — 2차부터 */}
      <div className="tc-topbar">
        <div className="tc-tabs">
          {Object.keys(ROUNDS_DATA).map((r) => (
            <button
              key={r}
              className={`tc-tab${activeRound === r ? " on" : ""}`}
              onClick={() => setActiveRound(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="tc-period">{data.period} 마감</span>
      </div>

      <div className="tc-body">
        <p className="tc-sec">조별 대결 결과</p>
        <div className="tc-match-list">
          {data.matches.map((m, i) => (
            <MatchCard key={m.round} match={m} idx={i} />
          ))}
        </div>
      </div>

    </div>
  );
}
