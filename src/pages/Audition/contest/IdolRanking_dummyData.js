import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IdolRanking.css";

/* ── 아바타 색상 ── */
const AVATAR_COLORS = [
  "#2d4a7a","#3a2d6b","#2d6b3a","#6b2d3a","#2d3a6b",
  "#6b5a2d","#3a6b2d","#5a2d6b","#2d5a6b","#6b2d5a",
];

/* ── 더미 데이터 (추후 API 교체) ── */
const ROUNDS_DATA = {
  "1차": {
    period: "2026.01.06 ~ 2026.01.12",
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
  },
  "2차": {
    period: "2026.02.02 ~ 2026.02.08",
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
  },
  "3차": {
    period: "2026.03.02 ~ 2026.03.08",
    idols: [
      { id:1,  name:"김지수", group:"NOVA",   votes:41200, survived:true },
      { id:2,  name:"이서연", group:"LUNA",   votes:38100, survived:true },
      { id:3,  name:"박민준", group:"STAR",   votes:35800, survived:true },
      { id:4,  name:"정은비", group:"PRISM",  votes:29400, survived:true },
      { id:5,  name:"최하늘", group:"AURORA", votes:25100, survived:true },
      { id:6,  name:"윤하린", group:"HALO",   votes:21900, survived:true },
      { id:7,  name:"강태양", group:"BLAZE",  votes:18700, survived:true },
      { id:8,  name:"백소율", group:"LUNA",   votes:15300, survived:true },
      { id:9,  name:"오세진", group:"NOVA",   votes:12800, survived:true },
      { id:10, name:"임도현", group:"STAR",   votes:10200, survived:true },
      { id:11, name:"신아름", group:"PRISM",  votes:8900,  survived:true },
      { id:12, name:"한소희", group:"LUNA",   votes:7400,  survived:true },
    ],
  },
};

const avColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];

const rankBadgeClass = (rank) => {
  if (rank === 1) return "ir-rb1";
  if (rank === 2) return "ir-rb2";
  if (rank === 3) return "ir-rb3";
  return "ir-rbn";
};

const rankColor = (rank) => {
  if (rank === 1) return "#B8860B";
  if (rank === 2) return "#888";
  if (rank === 3) return "#8B6914";
  return "var(--color-text-tertiary, rgba(232,244,248,0.35))";
};

/* ── 피라미드 카드 ── */
function PyramidCard({ idol, rank, total }) {
  const navigate = useNavigate();
  if (!idol) return <div className="ir-pcard" />;

  const pct = (idol.votes / total * 100).toFixed(1);

  return (
    <div className="ir-pcard" onClick={() => navigate(`/Audition/profile/${idol.id}`)}>
      <div className="ir-av-wrap">
        <div className="ir-av" style={{ background: avColor(idol.id) }}>
          {idol.name?.charAt(0) ?? "#"}
        </div>
        <div className={`ir-rbadge ${rankBadgeClass(rank)}`}>{rank}</div>
      </div>
      <p className="ir-pname">{idol.name}</p>
      <span className="ir-pvotes">{idol.votes.toLocaleString()} ({pct}%)</span>
    </div>
  );
}

/* ── 랭킹 행 카드 ── */
function RankCard({ idol, rank, total }) {
  const navigate = useNavigate();
  const pct    = (idol.votes / total * 100).toFixed(1);
  const isElim = !idol.survived;

  return (
    <div
      className={`ir-rescard${isElim ? " elim" : ""}`}
      onClick={() => navigate(`/Audition/profile/${idol.id}`)}
    >
      <span className="ir-rc-rank" style={{ color: rankColor(rank) }}>
        {String(rank).padStart(2, "0")}
      </span>
      <div className="ir-rc-av" style={{ background: avColor(idol.id) }}>
        {idol.name?.charAt(0) ?? "#"}
      </div>
      <div className="ir-rc-info">
        <div className="ir-rc-name">{idol.name}</div>
        <div className="ir-rc-group">{idol.group}</div>
      </div>
      <div className="ir-rc-right">
        <div className="ir-rc-votes">{idol.votes.toLocaleString()}</div>
        <div className="ir-rc-pct">{pct}%</div>
      </div>
      <span className={`ir-rc-badge ${isElim ? "be" : "bs"}`}>
        {isElim ? "탈락" : "생존"}
      </span>
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function IdolRanking() {
  const [activeRound, setActiveRound] = useState("2차");

  const data   = ROUNDS_DATA[activeRound];
  const sorted = [...data.idols].sort((a, b) => b.votes - a.votes);
  const total  = sorted.reduce((s, i) => s + i.votes, 0);
  const survived = sorted.filter(i => i.survived).length;

  // TOP 10 (10명 미만이면 null 채우기)
  const top10 = [...sorted.slice(0, 10)];
  while (top10.length < 10) top10.push(null);

  return (
    <div className="ir-wrap">

      {/* 페이지 헤더 */}
      <div className="ir-page-header">
        <h2 className="ir-page-title">개인 순위</h2>
        <p className="ir-page-sub">회차별 투표 결과</p>
      </div>

      {/* 회차 탭 */}
      <div className="ir-topbar">
        <div className="ir-tabs">
          {Object.keys(ROUNDS_DATA).map((r) => (
            <button
              key={r}
              className={`ir-tab${activeRound === r ? " on" : ""}`}
              onClick={() => setActiveRound(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="ir-period">{data.period} 마감</span>
      </div>

      {/* 요약 카드 */}
      <div className="ir-summary">
        <div className="ir-sc">
          <p className="ir-sc-lbl">총 투표수</p>
          <p className="ir-sc-val">{total.toLocaleString()}</p>
          <p className="ir-sc-sub">해당 회차 누적</p>
        </div>
        <div className="ir-sc">
          <p className="ir-sc-lbl">참가자 수</p>
          <p className="ir-sc-val">{sorted.length}명</p>
          <p className="ir-sc-sub">생존 {survived}명 / 탈락 {sorted.length - survived}명</p>
        </div>
        <div className="ir-sc">
          <p className="ir-sc-lbl">1위 득표율</p>
          <p className="ir-sc-val">{(sorted[0].votes / total * 100).toFixed(1)}%</p>
          <p className="ir-sc-sub">{sorted[0].name} ({sorted[0].group})</p>
        </div>
      </div>

      <div className="ir-body">
        <div className="ir-two-col">

          {/* 왼쪽: TOP 10 피라미드 */}
          <div className="ir-left-col">
            <p className="ir-sec">TOP 10</p>
            <div className="ir-pyramid">
              {/* 1위 */}
              <div className="ir-prow ir-r1">
                <PyramidCard idol={top10[0]} rank={1} total={total} />
              </div>
              {/* 2~3위 */}
              <div className="ir-prow ir-r2">
                <PyramidCard idol={top10[1]} rank={2} total={total} />
                <PyramidCard idol={top10[2]} rank={3} total={total} />
              </div>
              {/* 4~6위 */}
              <div className="ir-prow ir-r3">
                <PyramidCard idol={top10[3]} rank={4} total={total} />
                <PyramidCard idol={top10[4]} rank={5} total={total} />
                <PyramidCard idol={top10[5]} rank={6} total={total} />
              </div>
              {/* 7~10위 */}
              <div className="ir-prow ir-r4">
                <PyramidCard idol={top10[6]}  rank={7}  total={total} />
                <PyramidCard idol={top10[7]}  rank={8}  total={total} />
                <PyramidCard idol={top10[8]}  rank={9}  total={total} />
                <PyramidCard idol={top10[9]}  rank={10} total={total} />
              </div>
            </div>
          </div>

          {/* 오른쪽: 전체 랭킹 스크롤 */}
          <div className="ir-right-col">
            <p className="ir-sec">전체 랭킹</p>
            <p className="ir-leg">
              <span className="ir-dot survived" />생존 &nbsp;
              <span className="ir-dot eliminated" />탈락
            </p>
            <div className="ir-rank-scroll">
              {sorted.map((idol, i) => (
                <RankCard key={idol.id} idol={idol} rank={i + 1} total={total} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
