import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContestResult.css";

/* ── 아바타 색상 ── */
const AVATAR_COLORS = [
  "#2d4a7a","#3a2d6b","#2d6b3a","#6b2d3a","#2d3a6b",
  "#6b5a2d","#3a6b2d","#5a2d6b","#2d5a6b","#6b2d5a",
];

/* ── 더미 데이터 (추후 API 교체) ── */
const ROUNDS_DATA = {
  "1차": {
    period: "2026.01.06 ~ 2026.01.12",
    cutLine: 60,
    idols: [
      { id:1,  name:"김지수", group:"NOVA",   votes:72100, survived:true  },
      { id:2,  name:"박민준", group:"STAR",   votes:60300, survived:true  },
      { id:3,  name:"이서연", group:"LUNA",   votes:55800, survived:true  },
      { id:4,  name:"최하늘", group:"AURORA", votes:44200, survived:true  },
      { id:5,  name:"정은비", group:"PRISM",  votes:38900, survived:true  },
      { id:6,  name:"강태양", group:"BLAZE",  votes:31200, survived:true  },
      { id:7,  name:"윤하린", group:"HALO",   votes:27400, survived:true  },
      { id:8,  name:"오세진", group:"NOVA",   votes:23100, survived:true  },
      { id:9,  name:"백소율", group:"LUNA",   votes:19800, survived:true  },
      { id:10, name:"임도현", group:"STAR",   votes:17300, survived:true  },
      { id:11, name:"신아름", group:"PRISM",  votes:14100, survived:false },
      { id:12, name:"류찬혁", group:"BLAZE",  votes:11200, survived:false },
      { id:13, name:"한소희", group:"LUNA",   votes:9800,  survived:false },
      { id:14, name:"오지환", group:"HALO",   votes:7600,  survived:false },
      { id:15, name:"박서준", group:"NOVA",   votes:5400,  survived:false },
    ],
    groups: null,
  },
  "2차": {
    period: "2026.02.02 ~ 2026.02.08",
    cutLine: 50,
    idols: [
      { id:1,  name:"김지수", group:"NOVA",   votes:89214, survived:true  },
      { id:2,  name:"박민준", group:"STAR",   votes:72100, survived:true  },
      { id:3,  name:"이서연", group:"LUNA",   votes:65833, survived:true  },
      { id:4,  name:"최하늘", group:"AURORA", votes:51302, survived:true  },
      { id:5,  name:"정은비", group:"PRISM",  votes:44721, survived:true  },
      { id:6,  name:"강태양", group:"BLAZE",  votes:38490, survived:true  },
      { id:7,  name:"윤하린", group:"HALO",   votes:33201, survived:true  },
      { id:8,  name:"오세진", group:"NOVA",   votes:29874, survived:true  },
      { id:9,  name:"백소율", group:"LUNA",   votes:25430, survived:true  },
      { id:10, name:"임도현", group:"STAR",   votes:21009, survived:true  },
      { id:11, name:"신아름", group:"PRISM",  votes:18762, survived:false },
      { id:12, name:"류찬혁", group:"BLAZE",  votes:15344, survived:false },
      { id:13, name:"한소희", group:"LUNA",   votes:13820, survived:false },
      { id:14, name:"오지환", group:"HALO",   votes:12940, survived:false },
      { id:15, name:"박서준", group:"NOVA",   votes:12100, survived:false },
    ],
    groups: [
      { round:"A조", teamA:"NOVA팀",  teamB:"STAR팀",   aPct:55, bPct:45 },
      { round:"B조", teamA:"LUNA팀",  teamB:"AURORA팀", aPct:48, bPct:52 },
      { round:"C조", teamA:"PRISM팀", teamB:"BLAZE팀",  aPct:62, bPct:38 },
      { round:"D조", teamA:"HALO팀",  teamB:"ECHO팀",   aPct:44, bPct:56 },
    ],
  },
};

const avColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];

/* ── 피라미드 카드 ── */
function PyramidCard({ idol, rank, total }) {
  const navigate = useNavigate();
  const pct = (idol.votes / total * 100).toFixed(1);
  const rcClass = rank === 1 ? "cr-rb1" : rank === 2 ? "cr-rb2" : rank === 3 ? "cr-rb3" : "cr-rbn";
  const avClass = rank === 1 ? "cr-avxl" : rank === 2 || rank === 3 ? "cr-avlg" : rank <= 6 ? "cr-avmd" : "cr-avsm";
  const nmClass = rank === 1 ? "cr-pnxl" : rank <= 3 ? "cr-pnlg" : "cr-pnsm";

  return (
    <div className="cr-pcard" onClick={() => navigate(`/Audition/profile/${idol.id}`)}>
      {rank === 1 && <span className="cr-staricon">⭐</span>}
      <div className={`cr-rbadge ${rcClass}`}>{rank}</div>
      <div className={`cr-av ${avClass}`} style={{ background: avColor(idol.id) }}>
        {idol.name?.charAt(0) ?? "#"}
      </div>
      <p className={`cr-pname ${nmClass}`}>{idol.name}</p>
      <span className="cr-pvotes">{idol.votes.toLocaleString()} ({pct}%)</span>
    </div>
  );
}

/* ── 팀경연 카드 ── */
function MatchCard({ match, idx }) {
  const aWin = match.aPct >= match.bPct;
  const aBg  = AVATAR_COLORS[idx * 2 % AVATAR_COLORS.length];
  const bBg  = AVATAR_COLORS[(idx * 2 + 1) % AVATAR_COLORS.length];

  return (
    <div className="cr-mcard">
      <div className="cr-mtop">
        <span className="cr-mround">{match.round}</span>
      </div>
      <div className="cr-mrow">
        {/* A팀 */}
        <div className={`cr-team ${aWin ? "win" : "lose"}`} style={{ alignItems:"flex-end" }}>
          <div className="cr-team-av" style={{ background: aBg }}>
            {match.teamA.charAt(0)}
          </div>
          <p className="cr-team-name">{match.teamA}</p>
          {aWin && <span className="cr-win-b">🏆 승리</span>}
        </div>

        {/* VS 스코어 */}
        <div className="cr-vsbox">
          <span className="cr-vstxt">VS</span>
          <div className="cr-score-row">
            <span className={`cr-score ${aWin ? "sw" : "sl"}`}>{match.aPct}</span>
            <span className="cr-sep">:</span>
            <span className={`cr-score ${!aWin ? "sw" : "sl"}`}>{match.bPct}</span>
          </div>
          <span className="cr-vstxt" style={{ fontSize: 9 }}>득표율(%)</span>
        </div>

        {/* B팀 */}
        <div className={`cr-team ${!aWin ? "win" : "lose"}`} style={{ alignItems:"flex-start" }}>
          <div className="cr-team-av" style={{ background: bBg }}>
            {match.teamB.charAt(0)}
          </div>
          <p className="cr-team-name">{match.teamB}</p>
          {!aWin && <span className="cr-win-b">🏆 승리</span>}
        </div>
      </div>
    </div>
  );
}

/* ── 전체결과 카드 ── */
function ResultCard({ idol, rank, total }) {
  const navigate = useNavigate();
  const pct    = (idol.votes / total * 100).toFixed(1);
  const isElim = !idol.survived;

  return (
    <div
      className={`cr-rescard${isElim ? " elim" : ""}`}
      onClick={() => navigate(`/Audition/profile/${idol.id}`)}
    >
      <span className="cr-rcrank">{String(rank).padStart(2, "0")}</span>
      <div className="cr-rcav" style={{ background: avColor(idol.id) }}>
        {idol.name?.charAt(0) ?? "#"}
      </div>
      <div className="cr-rcinfo">
        <div className="cr-rcname">{idol.name}</div>
        <div className="cr-rcgroup">{idol.group}</div>
      </div>
      <div className="cr-rcright">
        <div className="cr-rcvotes">{idol.votes.toLocaleString()}</div>
        <div className="cr-rcpct">{pct}%</div>
      </div>
      <span className={`cr-rcbadge ${isElim ? "be" : "bs"}`}>
        {isElim ? "탈락" : "생존"}
      </span>
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function ContestResult() {
  const [activeRound, setActiveRound] = useState("2차");

  const data   = ROUNDS_DATA[activeRound];
  const sorted = [...data.idols].sort((a, b) => b.votes - a.votes);
  const total  = sorted.reduce((s, i) => s + i.votes, 0);
  const survived = sorted.filter(i => i.survived).length;

  const top10 = sorted.slice(0, 10);
  const rest  = sorted.slice(10);

  return (
    <div className="cr-wrap">

      {/* 페이지 헤더 */}
      <div className="cr-page-header">
        <h2 className="cr-page-title">경연 결과</h2>
        <p className="cr-page-sub">회차별 마감 결과</p>
      </div>

      {/* 회차 탭 + 기간 */}
      <div className="cr-topbar">
        <div className="cr-tabs">
          {Object.keys(ROUNDS_DATA).map((r) => (
            <button
              key={r}
              className={`cr-tab${activeRound === r ? " on" : ""}`}
              onClick={() => setActiveRound(r)}
            >
              {r} 오디션
            </button>
          ))}
        </div>
        <span className="cr-period">{data.period} 마감</span>
      </div>

      {/* 요약 카드 */}
      <div className="cr-summary">
        <div className="cr-sc">
          <p className="cr-sc-lbl">총 투표수</p>
          <p className="cr-sc-val">{total.toLocaleString()}</p>
          <p className="cr-sc-sub">해당 회차 누적</p>
        </div>
        <div className="cr-sc">
          <p className="cr-sc-lbl">참가자 수</p>
          <p className="cr-sc-val">{sorted.length}명</p>
          <p className="cr-sc-sub">생존 {survived}명 / 탈락 {sorted.length - survived}명</p>
        </div>
        <div className="cr-sc">
          <p className="cr-sc-lbl">1위 득표율</p>
          <p className="cr-sc-val">{(sorted[0].votes / total * 100).toFixed(1)}%</p>
          <p className="cr-sc-sub">{sorted[0].name} ({sorted[0].group})</p>
        </div>
      </div>

      <div className="cr-body">

        {/* ── 상단 2:1 레이아웃 ── */}
        <div className="cr-two-col">

          {/* 왼쪽: TOP 10 피라미드 */}
          <div className="cr-left-col">
            <p className="cr-sec">TOP 10</p>
            <div className="cr-pyramid">
              {/* 1위 */}
              <div className="cr-prow cr-r1">
                <PyramidCard idol={top10[0]} rank={1} total={total} />
              </div>
              {/* 2~3위 */}
              <div className="cr-prow cr-r2">
                <PyramidCard idol={top10[1]} rank={2} total={total} />
                <PyramidCard idol={top10[2]} rank={3} total={total} />
              </div>
              {/* 4~6위 */}
              <div className="cr-prow cr-r3">
                <PyramidCard idol={top10[3]} rank={4} total={total} />
                <PyramidCard idol={top10[4]} rank={5} total={total} />
                <PyramidCard idol={top10[5]} rank={6} total={total} />
              </div>
              {/* 7~10위 */}
              <div className="cr-prow cr-r4">
                <PyramidCard idol={top10[6]} rank={7}  total={total} />
                <PyramidCard idol={top10[7]} rank={8}  total={total} />
                <PyramidCard idol={top10[8]} rank={9}  total={total} />
                <PyramidCard idol={top10[9]} rank={10} total={total} />
              </div>
            </div>
          </div>

          {/* 오른쪽: 팀별 경연 결과 */}
          <div className="cr-right-col">
            <p className="cr-sec">팀별 경연 결과</p>
            {data.groups ? (
              <div className="cr-mlist">
                {data.groups.map((g, i) => (
                  <MatchCard key={g.round} match={g} idx={i} />
                ))}
              </div>
            ) : (
              <div className="cr-no-team">
                <p>이 회차는 팀경연이 없어요.</p>
              </div>
            )}
          </div>

        </div>

        {/* ── 하단: 전체 결과 ── */}
        {rest.length > 0 && (
          <div className="cr-full-sec">
            <p className="cr-sec">전체 결과</p>
            <p className="cr-leg">
              <span className="cr-dot survived" />생존 &nbsp;
              <span className="cr-dot eliminated" />탈락
            </p>
            <div className="cr-resgrid">
              {rest.map((idol, i) => (
                <ResultCard key={idol.id} idol={idol} rank={i + 11} total={total} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
