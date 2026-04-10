import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIdolsLatestApi } from "../../api/auditionApi";
import "./IdolList.css";

const AVATAR_COLORS = [
  "#1a2c4e","#1e1a2c","#1a2c1e","#2c1a1e","#1a1e2c",
  "#2c2a1a","#1e2c1a","#2a1a2c","#1a2a2c","#2c1a2a",
];

export default function IdolList() {
  const navigate = useNavigate();

  /* ── API 상태 ── */
  const [idols,   setIdols]   = useState([]);   // API 응답 데이터
  const [loading, setLoading] = useState(true);  // 로딩 중
  const [error,   setError]   = useState(null);  // 에러 메시지

  /* ── 검색/필터 상태 ── */
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("votes");      // "votes" | "name"
  const [filterMode,  setFilterMode]  = useState("all");  // "all" | "survived"

  /* ── API 호출 ── */
  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllIdolsLatestApi()
      .then((res) => {
        console.log("✅ 아이돌 목록:", res.data);
        setIdols(res.data);
      })
      .catch((err) => {
        console.error("❌ 아이돌 목록 조회 실패:", err);
        setError("참가자 목록을 불러오지 못했어요.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ── 집계 ── */
  /* ── API 응답에서 생존/탈락자 수 계산 ── */
  const survived   = useMemo(() => idols.filter(i => i.status === "active").length,    [idols]);
  const eliminated = useMemo(() => idols.filter(i => i.status === "eliminated").length, [idols]);

  /* ── 검색 + 정렬 ── */
  const filtered = useMemo(() => {
    let list = idols.filter((i) => {
      const searchOk = !searchQuery || (i.name && i.name.includes(searchQuery));
      const filterOk = filterMode === "all" || i.status === "active";
      return searchOk && filterOk;
    });
    if (sortMode === "votes") {
        list = [...list].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
    } else {
        list = [...list].sort((a, b) => a.name?.localeCompare(b.name, "ko"));
    }
    return list;
  }, [idols, searchQuery, sortMode, filterMode]);

  /* ── 검색 제출 ── */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  /* ── 검색 초기화 ── */
  const resetSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  /* ── 카드 클릭 → 프로필 페이지 이동 ── */
  const goToProfile = (profileId) => {
    navigate(`/Audition/profile/${profileId}`);
  };

  /* ── 로딩 화면 ── */
  if (loading) {
    return (
      <div className="il-wrap">
        <div className="il-loading">참가자 목록을 불러오는 중...</div>
      </div>
    );
  }

  /* ── 에러 화면 ── */
  if (error) {
    return (
      <div className="il-wrap">
        <div className="il-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="il-wrap">

      {/* ── 페이지 헤더 ── */}
      {/* <div className="il-page-header">
        <h2 className="il-page-title">참가자</h2>
        <p className="il-page-sub">총 {filtered.length}명의 참가자</p>
      </div> */}

      {/* 요약 섹션 */}
      <div className="il-summary">
          <div className="il-sc">
              <p className="il-sc-lbl">총 참가자</p>
              <p className="il-sc-val">{idols.length}명</p>
              <p className="il-sc-sub">전체 회차 누적</p>
          </div>
          <div className="il-sc">
              <p className="il-sc-lbl">생존자</p>
              <p className="il-sc-val">{survived}명</p>
              <p className="il-sc-sub">현재 진행 중</p>
          </div>
          <div className="il-sc">
              <p className="il-sc-lbl">탈락자</p>
              <p className="il-sc-val">{eliminated}명</p>
              <p className="il-sc-sub">누적 탈락</p>
          </div>
      </div>

      {/* ── 검색 + 그룹 필터 바 ── */}
      <div className="il-filter-bar">
        <form className="il-search-box" onSubmit={handleSearchSubmit}>
          <span className="il-search-icon">🔍</span>
          <input
            className="il-search-input"
            type="text"
            placeholder="이름 또는 그룹명 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="il-search-clear" onClick={resetSearch}>
              ✕
            </button>
          )}
        </form>

        <div className="il-sort-box">
            <button
                className={`il-sort-btn${sortMode === "votes" ? " on" : ""}`}
                onClick={() => setSortMode("votes")}
            >
                득표순
            </button>
            <button
                className={`il-sort-btn${sortMode === "name" ? " on" : ""}`}
                onClick={() => setSortMode("name")}
            >
                가나다순
            </button>
            <button
                className={`il-sort-btn${filterMode === "survived" ? " on survived-filter" : ""}`}
                onClick={() => setFilterMode(filterMode === "survived" ? "all" : "survived")}
            >
                생존자만
            </button>
        </div>

        <span className="il-count-label">{filtered.length}명</span>
      </div>

      {/* ── 카드 그리드 ── */}
      <div className="il-grid">
        {filtered.map((idol) => {
          const color  = AVATAR_COLORS[(idol.idolId - 1) % AVATAR_COLORS.length];
          const isElim = idol.status === "eliminated";

          return (
            <div
                key={idol.idolId}
                className={`il-card${isElim ? " eliminated" : " survived"}`}
            >
                <span className={`il-badge${isElim ? " elim" : " surv"}`}>
                    {isElim ? "탈락" : "생존"}
                </span>

                <div className="il-avatar" style={{ background: color }}>
                    {idol.mainImgUrl ? (
                        <img
                            src={`${process.env.REACT_APP_API_URL.replace(/\/api$/, "")}/profile/${idol.mainImgUrl}`}
                            alt={idol.name}
                            className="il-avatar-img"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}
                    <span
                        className="il-avatar-initial"
                        style={{ display: idol.mainImgUrl ? "none" : "flex" }}
                    >
                        {idol.name?.charAt(0) ?? "#"}
                    </span>
                </div>

                <p className="il-idol-name">{idol.name ?? `참가자 #${idol.idolId}`}</p>

                <div className="il-card-btns">
                    <button
                        className="il-btn-profile"
                        onClick={() => goToProfile(idol.idolProfileId)}
                    >
                        프로필 보기
                    </button>
                    {!isElim && (
                        <button
                            className="il-btn-vote"
                            onClick={() => navigate("/Audition/vote")}
                        >
                            투표하기
                        </button>
                    )}
                </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="il-empty">검색 결과가 없어요</div>
      )}
      {/* 모달 (필요 시 활성화) */}
      {/* 
      {selectedIdol && (
        <ProfileModal 
          idol={selectedIdol} 
          onClose={() => setSelectedIdol(null)} 
        />
      )} 
      */}
    </div>
  );
}