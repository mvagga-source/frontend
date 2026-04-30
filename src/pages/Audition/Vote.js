import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getIdolsApi,
  getRankingApi,
  getVoteStatusApi,
  submitVoteApi,
  getAuditionListApi,
  getVotedIdolsApi,
} from "../../api/auditionApi";
import "./Vote.css";

const AVATAR_COLORS = [
  "#1a2c4e","#1e1a2c","#1a2c1e","#2c1a1e",
  "#1a1e2c","#2c2a1a","#1e2c1a","#2a1a2c",
  "#1a2a2c","#2c1a2a","#2a2c1a","#1e2a1e",
];

const rankColor = (rank, survivorCount) => {
  if (rank === 1) return "#ffd700";
  if (rank === 2) return "#c0c0c0";
  if (rank === 3) return "#cd7f32";
  if (survivorCount && rank <= survivorCount) return "#7dd3fc"; // 커트라인 이내: 연파랑
  return "rgba(232,244,248,0.38)";    // 커트라인 밖: 회색
};

export default function Vote() {
  const { user } = useAuth();
  const location = useLocation();

  /* ── API 상태 ── */
  const [idols,        setIdols]        = useState([]);   // 투표 대상 아이돌 목록
  const [rankingIdols, setRankingIdols] = useState([]);   // 순위표 모달용 랭킹 데이터
  const [loading,      setLoading]      = useState(false); // 아이돌 목록 로딩
  const [isDone,       setIsDone]       = useState(false);// 오늘 이미 투표했는지
  const [auditionId,   setAuditionId]   = useState(null); // 동적 회차 ID
  const [auditionInfo, setAuditionInfo] = useState(null); // 회차 정보 (제목, 기간 등)

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

  /* ── 진행중인 오디션 회차 조회 ── */
  useEffect(() => {
    getAuditionListApi()
      .then((res) => {
        const ongoing = res.data.find((a) => a.status === "ongoing");
        if (ongoing) {
          setAuditionId(ongoing.auditionId);
          setAuditionInfo(ongoing);
        }
      })
      .catch((err) => {
        console.error("❌ 회차 조회 실패:", err);
      });
  }, []);

  /* ── 아이돌 목록 + 오늘 투표 여부 로드 ── */
  useEffect(() => {
    if (!auditionId) return;
    setLoading(true);

    // 아이돌 목록 조회
    getIdolsApi(auditionId)
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
      getVoteStatusApi(auditionId)
        .then((res) => {
          console.log("✅ 투표 여부:", res.data);
          setIsDone(res.data); // true면 오늘 이미 투표함
        })
        .catch((err) => {
          console.error("❌ 투표 여부 확인 실패:", err);
        });
    }
  }, [auditionId, user]);

  /* ── 순위표 모달 열 때 랭킹 조회 ── */
  useEffect(() => {
    if (!showRanking || !auditionId) return;
    getRankingApi(auditionId)
      .then((res) => {
        console.log("✅ 랭킹:", res.data);
        // API 응답: [[IdolDto, rawVotes, totalBonus, finalVotes], ...]
        setRankingIdols(res.data);
      })
      .catch((err) => {
        console.error("❌ 랭킹 조회 실패:", err);
      });
  }, [auditionId, showRanking]);

  /* ── isDone=true일 때 오늘 투표한 아이돌 목록 복원 ── */
  useEffect(() => {
    if (!isDone || !auditionId || !user) return;
    getVotedIdolsApi(auditionId)
      .then((res) => {
        console.log("✅ 투표한 아이돌:", res.data);
        setSelected(res.data);
      })
      .catch((err) => {
        console.error("❌ 투표 아이돌 조회 실패:", err);
      });
  }, [isDone, auditionId, user]);
  
  /* ── 최대 득표수 계산 (득표 바 기준) ── */
  const maxVotes = useMemo(() => {
    if (idols.length === 0) return 1;
    return Math.max(...idols.map((i) => i.votes ?? 0));
  }, [idols]);

  /* ── 검색 필터링 ── */
  const filtered = useMemo(() =>
    searchQuery
      ? idols.filter((i) =>
          (i.name && i.name.includes(searchQuery))  // ← null 체크 추가
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

    submitVoteApi(auditionId, selected)
      .then(() => {
        console.log("✅ 투표 완료");
        setIsDone(true);
        // setSelected([]);
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

  if (!auditionId && !loading) {
    return (
      <div className="av-wrap">
        <div className="action101-logo-section">
          <div className="binary-pattern">
            101001001011011101101010111101110101011011101101011010101
            101110101011011101101010111101110101011011101101011010101
          </div>
          
          <div className="logo-glass-card">
            <div className="logo-header-text">
              <span className="left-tag">PICK YOUR IDOL</span>
              <span className="right-tag">2026 SURVIVAL</span>
            </div>

            <h1 className="main-logo-text">ACTION 101</h1>
            
            <p className="sub-logo-text">
              현재 진행 중인 투표가 없어요.
            </p>

            <div className="logo-footer-link">WWW.ACTION101.COM</div>

            <div className="corner-dot top-left"></div>
            <div className="corner-dot top-right"></div>
            <div className="corner-dot bottom-left"></div>
            <div className="corner-dot bottom-right"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="av-wrap">

      {/* ── 상단 고정 바 ── */}
      <div className="av-topbar">
        <div className="av-topbar-left">
          <span className="av-round-badge">{auditionInfo?.round ?? "-"}차</span>
          <div>
            <p className="av-round-title">{auditionInfo?.title ?? "오디션 투표"}</p>
            <p className="av-round-period">
              {auditionInfo ? `${auditionInfo.startDate} ~ ${auditionInfo.endDate}` : "진행 중"}
            </p>
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
          <Link to="/UserLogin" state={{ from: location.pathname }} className="av-login-link">로그인하기 →</Link>
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
                <span>{idx + 1}. {idol?.name ?? `참가자 #${idolId}`}</span>
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
              className={`av-card${isSel ? " selected" : ""}${isDone ? (isSel ? " voted-selected" : " voted-dim") : ""}${isMaxed ? " maxed" : ""}`}
              onClick={() => !isDone && toggle(idol.idolId)}
            >
              {isDone && isSel && <span className="av-voted-badge">투표완료 ✓</span>}
              {!isDone && isSel && <span className="av-sel-num">{selIdx + 1}</span>}

              <div
                className="av-avatar"
                style={{ background: AVATAR_COLORS[(idol.idolId - 1) % AVATAR_COLORS.length] }}
              >
                {idol.mainImgUrl ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL.replace(/\/api$/, "")}/profile/${idol.mainImgUrl}`}
                    alt={idol.name}
                    className="av-avatar-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span
                  className="av-avatar-initial"
                  style={{ display: idol.mainImgUrl ? "none" : "flex" }}
                >
                  {idol.name?.charAt(0) ?? idol.idolId}
                </span>
              </div>

              <p className="av-idol-name">{idol.name ?? `참가자 #${idol.idolId}`}</p>

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
      {showSearch && createPortal (
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
        </div>,
        document.body
      )}

      {/* ── 순위표 모달 (LeaderBoard 기능 흡수) ── */}
      {showRanking && createPortal (
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
                  const idolId     = row[0];
                  const name       = row[1];
                  const finalVotes = row[4] ?? 0;
                  const n          = idx + 1;
                  const survivorCount = auditionInfo?.survivorCount ?? null;
                  const rc         = rankColor(n, survivorCount);
                  const maxFinal   = rankingIdols[0]?.[4] ?? 1;
                  const pct        = Math.round((finalVotes / maxFinal) * 100);

                  // 커트라인 바로 아래(survivorCount+1위)에 구분선 삽입
                  const showCutline = survivorCount && n === survivorCount + 1;

                  return (
                    <>
                      {showCutline && (
                        <li key={`cutline-${n}`} className="av-ranking-cutline">
                          <span>— 커트라인 —</span>
                        </li>
                      )}
                      <li key={idolId} className="av-ranking-row">
                        <span className="av-ranking-num" style={{ color: rc }}>
                          {String(n).padStart(2, "0")}
                        </span>
                        <div className="av-ranking-info">
                          <span className="av-ranking-name">{name ?? `참가자 #${idolId}`}</span>
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
                    </>
                  );
                })
              )}
            </ul>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}