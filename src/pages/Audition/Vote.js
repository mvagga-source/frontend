import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Vote.css";

const MAX_SELECT = 7; // 한 번에 선택할 수 있는 최대 아이돌 수(관리자 조정값)

const ROUND_INFO = {// 현재 진행 중인 오디션 회차 정보
  round: 2,
  title: "2차 오디션",
  period: "2026.02.12 ~ 2026.02.18",
};

const IDOLS = [// 투표 대상 아이돌 목록
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
    { id: 16, name: "김태리", group: "PRISM",  votes: 11380 },
    { id: 17, name: "이도현", group: "STAR",   votes: 10750 },
    { id: 18, name: "전소니", group: "BLAZE",  votes: 10020 },
    { id: 19, name: "남주혁", group: "AURORA", votes: 9440  },
    { id: 20, name: "고윤정", group: "LUNA",   votes: 8890  },
    { id: 21, name: "차은우", group: "HALO",   votes: 8310  },
    { id: 22, name: "아이유", group: "NOVA",   votes: 7760  },
    { id: 23, name: "송강",   group: "STAR",   votes: 7200  },
    { id: 24, name: "김유정", group: "PRISM",  votes: 6650  },
    { id: 25, name: "변우석", group: "BLAZE",  votes: 6110  },
    { id: 26, name: "박보영", group: "AURORA", votes: 5580  },
    { id: 27, name: "위하준", group: "LUNA",   votes: 5040  },
    { id: 28, name: "손예진", group: "HALO",   votes: 4510  },
    { id: 29, name: "정해인", group: "NOVA",   votes: 3970  },
    { id: 30, name: "한지민", group: "STAR",   votes: 3440  },
];

const AVATAR_COLORS = [
  "#1a2c4e","#1e1a2c","#1a2c1e","#2c1a1e",
  "#1a1e2c","#2c2a1a","#1e2c1a","#2a1a2c",
  "#1a2a2c","#2c1a2a","#2a2c1a","#1e2a1e",
];

const maxVotes = Math.max(...IDOLS.map((i) => i.votes));

const rankColor = (rank) => {
  if (rank === 1) return "#ffd700";
  if (rank === 2) return "#c0c0c0";
  if (rank === 3) return "#cd7f32";
  return "rgba(232,244,248,0.38)";
};

export default function Vote() {
  const { user } = useAuth();

  const [selected,    setSelected]    = useState([]); // 선택된 id 배열
  const [voted,       setVoted]       = useState([]); // 투표 완료 id 배열
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showSearch,  setShowSearch]  = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  const isFull  = selected.length >= MAX_SELECT;
  const hasVote = selected.length > 0;
  const isDone  = voted.length > 0;

  const filtered = useMemo(() =>
    searchQuery
      ? IDOLS.filter((i) =>
          i.name.includes(searchQuery) || i.group.includes(searchQuery)
        )
      : IDOLS,
    [searchQuery]
  );

  const sortedIdols = [...IDOLS].sort((a, b) => b.votes - a.votes);

  /* 카드 선택/해제 */
  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, id];
    });
  };

  /* 칩에서 개별 해제 */
  const deselect = (id) => setSelected((prev) => prev.filter((i) => i !== id));

  /* 투표 제출 */
  const handleVote = () => {
    if (!user)    { alert("로그인 후 이용해주세요."); return; }
    if (!hasVote) return;
    setVoted([...selected]);
  };

  /* 검색 초기화만 */
  const resetSearch = () => { setSearchQuery(""); setSearchInput(""); };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setShowSearch(false);
  };

  return (
    <div className="av-wrap">

      {/* ── 상단 고정 바 ── */}
      <div className="av-topbar">
        <div className="av-topbar-left">
          <span className="av-round-badge">{ROUND_INFO.round}차</span>
          <div>
            <p className="av-round-title">{ROUND_INFO.title}</p>
            <p className="av-round-period">{ROUND_INFO.period}</p>
          </div>
        </div>

        <div className="av-topbar-right">
          {/* 선택 카운터 */}
          <span className={`av-sel-counter${isFull ? " full" : ""}`}>
            {selected.length} / {MAX_SELECT} 선택
          </span>

          {/* 투표하기 */}
          <button
            className={`av-btn av-btn-vote${isDone ? " done" : hasVote ? " active" : ""}`}
            onClick={handleVote}
            disabled={!hasVote && !isDone}
          >
            {isDone ? "투표완료 ✓" : "투표하기"}
          </button>

          {/* 순위표 */}
          <button
            className="av-btn av-btn-ghost"
            onClick={() => { setShowRanking(true); setShowSearch(false); }}
          >
            순위표
          </button>

          {/* 검색 */}
          <button
            className="av-btn av-btn-ghost"
            onClick={() => { setShowSearch(true); setShowRanking(false); }}
          >
            검색
          </button>

          {/* 검색초기화 */}
          <button className="av-btn av-btn-reset-search" onClick={resetSearch}>
            검색초기화
          </button>
        </div>
      </div>

      {/* ── 로그인 안내 배너 ── */}
      {!user && (
        <div className="av-login-notice">
          <span>로그인 후 투표에 참여할 수 있어요</span>
          <Link to="/UserLogin" className="av-login-link">로그인하기 →</Link>
        </div>
      )}

      {/* ── 선택된 아이돌 칩 바 ── */}
      <div className="av-selected-bar">
        <span className="av-selected-bar-label">선택</span>
        {selected.length === 0 ? (
          <span className="av-sel-bar-empty">선택된 아이돌이 없어요</span>
        ) : (
          selected.map((id, idx) => {
            const idol = IDOLS.find((i) => i.id === id);
            return (
              <span key={id} className="av-sel-chip">
                <span>{idx + 1}. {idol.name}</span>
                <button onClick={() => deselect(id)}>✕</button>
              </span>
            );
          })
        )}
      </div>

      {/* ── 아이돌 카드 그리드 ── */}
      <div className="av-grid">
        {filtered.map((idol) => {
          const isSel   = selected.includes(idol.id);
          const isVoted = voted.includes(idol.id);
          const selIdx  = selected.indexOf(idol.id);
          const isMaxed = isFull && !isSel;
          const pct     = Math.round((idol.votes / maxVotes) * 100);

          return (
            <div
              key={idol.id}
              className={`av-card${isSel ? " selected" : ""}${isVoted ? " voted" : ""}${isMaxed ? " maxed" : ""}`}
              onClick={() => toggle(idol.id)}
            >
              {isVoted && <span className="av-voted-badge">투표완료</span>}
              {isSel   && <span className="av-sel-num">{selIdx + 1}</span>}

              <div
                className="av-avatar"
                style={{ background: AVATAR_COLORS[(idol.id - 1) % AVATAR_COLORS.length] }}
              >
                <span className="av-avatar-initial">{idol.name.charAt(0)}</span>
              </div>

              <p className="av-idol-name">{idol.name}</p>
              <p className="av-idol-group">{idol.group}</p>

              <div className="av-votes-area">
                <span className="av-votes-num">{idol.votes.toLocaleString()}</span>
                <div className="av-votes-bar-bg">
                  <div className="av-votes-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className={`av-checkbox${isSel ? " checked" : ""}`}>
                {isSel && "✓"}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="av-empty">검색 결과가 없어요</div>
      )}

      {/* ── 검색 모달 ── */}
      {showSearch && (
        <div className="av-modal-overlay" onClick={() => setShowSearch(false)}>
          <div className="av-modal" onClick={(e) => e.stopPropagation()}>
            <div className="av-modal-header">
              <span className="av-modal-title">아이돌 검색</span>
              <button className="av-modal-close" onClick={() => setShowSearch(false)}>✕</button>
            </div>
            <form className="av-search-form" onSubmit={handleSearchSubmit}>
              <input
                className="av-search-input"
                type="text"
                placeholder="이름 또는 그룹명 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="av-btn av-btn-vote active">검색</button>
            </form>
            {searchQuery && (
              <p className="av-search-result-info">
                '{searchQuery}' 검색 결과: {filtered.length}명
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── 순위표 모달 ── */}
      {showRanking && (
        <div className="av-modal-overlay" onClick={() => setShowRanking(false)}>
          <div className="av-modal av-modal-ranking" onClick={(e) => e.stopPropagation()}>
            <div className="av-modal-header">
              <span className="av-modal-title">현재 순위표</span>
              <button className="av-modal-close" onClick={() => setShowRanking(false)}>✕</button>
            </div>
            <ul className="av-ranking-list">
              {sortedIdols.map((idol, idx) => {
                const n   = idx + 1;
                const rc  = rankColor(n);
                const pct = Math.round((idol.votes / maxVotes) * 100);
                return (
                  <li key={idol.id} className="av-ranking-row">
                    <span className="av-ranking-num" style={{ color: rc }}>
                      {String(n).padStart(2, "0")}
                    </span>
                    <div className="av-ranking-info">
                      <span className="av-ranking-name">{idol.name}</span>
                      <span className="av-ranking-group">{idol.group}</span>
                    </div>
                    <div className="av-ranking-bar-bg">
                      <div className="av-ranking-bar-fill"
                        style={{ width: `${pct}%`, background: rc }} />
                    </div>
                    <span className="av-ranking-votes" style={{ color: rc }}>
                      {idol.votes.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}