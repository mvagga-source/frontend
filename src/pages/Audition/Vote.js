import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getIdolsApi,
  getRankingApi,
  getVoteStatusApi,
  submitVoteApi,
} from "../../api/auditionApi";
import "./Vote.css";

// 현재 진행 중인 오디션 ID (추후 API로 동적 처리)
const CURRENT_AUDITION_ID = 1;

const AVATAR_COLORS = [
  "#1a2c4e","#1e1a2c","#1a2c1e","#2c1a1e",
  "#1a1e2c","#2c2a1a","#1e2c1a","#2a1a2c",
  "#1a2a2c","#2c1a2a","#2a2c1a","#1e2a1e",
];

const rankColor = (rank) => {
  if (rank === 1) return "#ffd700";
  if (rank === 2) return "#c0c0c0";
  if (rank === 3) return "#cd7f32";
  return "rgba(232,244,248,0.38)";
};

export default function Vote() {
  const { user } = useAuth();

  /* ── API 상태 ── */
  const [idols,        setIdols]        = useState([]);   // 투표 대상 아이돌 목록
  const [rankingIdols, setRankingIdols] = useState([]);   // 순위표 모달용 랭킹 데이터
  const [loading,      setLoading]      = useState(true); // 아이돌 목록 로딩
  const [isDone,       setIsDone]       = useState(false);// 오늘 이미 투표했는지

  /* ── 투표 선택 상태 ── */
  const [selected,    setSelected]    = useState([]); // 선택된 idolId 배열
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showSearch,  setShowSearch]  = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  // maxVoteCount는 API로 받아올 수 있지만 임시로 7 고정
  const MAX_SELECT = 7;

  const isFull  = selected.length >= MAX_SELECT;
  const hasVote = selected.length > 0;

  /* ── 아이돌 목록 + 오늘 투표 여부 로드 ── */
  useEffect(() => {
    setLoading(true);

    // 아이돌 목록 조회
    getIdolsApi(CURRENT_AUDITION_ID)
      .then((res) => {
        console.log("✅ 아이돌 목록:", res.data);
        setIdols(res.data);
      })
      .catch((err) => {
        console.error("❌ 아이돌 목록 실패:", err);
      })
      .finally(() => setLoading(false));

    // 로그인 상태일 때만 오늘 투표 여부 확인
    if (user) {
      getVoteStatusApi(CURRENT_AUDITION_ID)
        .then((res) => {
          console.log("✅ 투표 여부:", res.data);
          setIsDone(res.data); // true면 오늘 이미 투표함
        })
        .catch((err) => {
          console.error("❌ 투표 여부 확인 실패:", err);
        });
    }
  }, [user]);

  /* ── 순위표 모달 열 때 랭킹 조회 ── */
  useEffect(() => {
    if (!showRanking) return;
    getRankingApi(CURRENT_AUDITION_ID)
      .then((res) => {
        console.log("✅ 랭킹:", res.data);
        // API 응답: [[IdolDto, rawVotes, totalBonus, finalVotes], ...]
        setRankingIdols(res.data);
      })
      .catch((err) => {
        console.error("❌ 랭킹 조회 실패:", err);
      });
  }, [showRanking]);

  /* ── 최대 득표수 계산 (득표 바 기준) ── */
  const maxVotes = useMemo(() => {
    if (idols.length === 0) return 1;
    return Math.max(...idols.map((i) => i.votes ?? 0));
  }, [idols]);

  /* ── 검색 필터링 ── */
  const filtered = useMemo(() =>
    searchQuery
      ? idols.filter((i) =>
          i.name.includes(searchQuery) ||
          (i.groupName && i.groupName.includes(searchQuery))
        )
      : idols,
    [idols, searchQuery]
  );

  /* ── 카드 선택/해제 ── */
  const toggle = (idolId) => {
    setSelected((prev) => {
      if (prev.includes(idolId)) return prev.filter((i) => i !== idolId);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, idolId];
    });
  };

  /* ── 칩에서 개별 해제 ── */
  const deselect = (idolId) =>
    setSelected((prev) => prev.filter((i) => i !== idolId));

  /* ── 투표 제출 ── */
  const handleVote = () => {
    if (!user)    { alert("로그인 후 이용해주세요."); return; }
    if (!hasVote) return;
    if (isDone)   return;

    submitVoteApi(CURRENT_AUDITION_ID, selected)
      .then(() => {
        console.log("✅ 투표 완료");
        setIsDone(true);
        setSelected([]);
      })
      .catch((err) => {
        console.error("❌ 투표 실패:", err);
        const msg = err.response?.data || "투표 중 오류가 발생했어요.";
        alert(msg);
      });
  };

  /* ── 검색 초기화 ── */
  const resetSearch = () => { setSearchQuery(""); setSearchInput(""); };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setShowSearch(false);
  };

  /* ── 로딩 화면 ── */
  if (loading) {
    return (
      <div className="av-wrap">
        <div className="av-loading">참가자 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="av-wrap">

      {/* ── 상단 고정 바 ── */}
      <div className="av-topbar">
        <div className="av-topbar-left">
          <span className="av-round-badge">{CURRENT_AUDITION_ID}차</span>
          <div>
            <p className="av-round-title">오디션 투표</p>
            <p className="av-round-period">진행 중</p>
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
            disabled={isDone || !hasVote}
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

      {/* ── 오늘 이미 투표한 경우 안내 배너 ── */}
      {isDone && user && (
        <div className="av-done-notice">
          오늘 투표가 완료됐어요. 내일 다시 투표할 수 있어요 🎉
        </div>
      )}

      {/* ── 선택된 아이돌 칩 바 ── */}
      <div className="av-selected-bar">
        <span className="av-selected-bar-label">선택</span>
        {selected.length === 0 ? (
          <span className="av-sel-bar-empty">선택된 아이돌이 없어요</span>
        ) : (
          selected.map((idolId, idx) => {
            const idol = idols.find((i) => i.idolId === idolId);
            return (
              <span key={idolId} className="av-sel-chip">
                <span>{idx + 1}. {idol?.name}</span>
                <button onClick={() => deselect(idolId)}>✕</button>
              </span>
            );
          })
        )}
      </div>

      {/* ── 아이돌 카드 그리드 ── */}
      <div className="av-grid">
        {filtered.map((idol) => {
          const isSel   = selected.includes(idol.idolId);
          const selIdx  = selected.indexOf(idol.idolId);
          const isMaxed = isFull && !isSel;
          const votes   = idol.votes ?? 0;
          const pct     = maxVotes > 0 ? Math.round((votes / maxVotes) * 100) : 0;

          return (
            <div
              key={idol.idolId}
              className={`av-card${isSel ? " selected" : ""}${isDone ? " voted" : ""}${isMaxed ? " maxed" : ""}`}
              onClick={() => !isDone && toggle(idol.idolId)}
            >
              {isDone   && <span className="av-voted-badge">투표완료</span>}
              {isSel    && <span className="av-sel-num">{selIdx + 1}</span>}

              <div
                className="av-avatar"
                style={{ background: AVATAR_COLORS[(idol.idolId - 1) % AVATAR_COLORS.length] }}
              >
                <span className="av-avatar-initial">{idol.name.charAt(0)}</span>
              </div>

              <p className="av-idol-name">{idol.name}</p>
              <p className="av-idol-group">{idol.groupName}</p>

              <div className="av-votes-area">
                <span className="av-votes-num">{votes.toLocaleString()}</span>
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

      {/* ── 순위표 모달 (LeaderBoard 기능 흡수) ── */}
      {showRanking && (
        <div className="av-modal-overlay" onClick={() => setShowRanking(false)}>
          <div className="av-modal av-modal-ranking" onClick={(e) => e.stopPropagation()}>
            <div className="av-modal-header">
              <span className="av-modal-title">현재 순위표</span>
              <button className="av-modal-close" onClick={() => setShowRanking(false)}>✕</button>
            </div>
            <ul className="av-ranking-list">
              {rankingIdols.length === 0 ? (
                <li className="av-ranking-empty">순위 데이터를 불러오는 중...</li>
              ) : (
                rankingIdols.map((row, idx) => {
                  // API 응답: [IdolDto, rawVotes, totalBonus, finalVotes]
                  const idol       = row[0];
                  const finalVotes = row[3] ?? 0;
                  const n          = idx + 1;
                  const rc         = rankColor(n);
                  const maxFinal   = rankingIdols[0]?.[3] ?? 1;
                  const pct        = Math.round((finalVotes / maxFinal) * 100);

                  return (
                    <li key={idol.idolId} className="av-ranking-row">
                      <span className="av-ranking-num" style={{ color: rc }}>
                        {String(n).padStart(2, "0")}
                      </span>
                      <div className="av-ranking-info">
                        <span className="av-ranking-name">{idol.name}</span>
                        <span className="av-ranking-group">{idol.groupName}</span>
                      </div>
                      <div className="av-ranking-bar-bg">
                        <div
                          className="av-ranking-bar-fill"
                          style={{ width: `${pct}%`, background: rc }}
                        />
                      </div>
                      <span className="av-ranking-votes" style={{ color: rc }}>
                        {Number(finalVotes).toLocaleString()}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}