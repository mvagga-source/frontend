import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIdolsApi } from "../../api/auditionApi";
import "./IdolList.css";

const CURRENT_AUDITION_ID = 1; // 임시 고정값

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
  const [activeGroup, setActiveGroup] = useState("전체");

  /* ── API 호출 ── */
  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllIdolsApi(CURRENT_AUDITION_ID)
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

  /* ── API 응답에서 그룹 목록 동적 추출 ── */
const groups = useMemo(() => {
  if (idols.length === 0) return ["전체"];
  // 중복 제거 후 "전체"와 합치기
  const uniqueGroups = [...new Set(idols.map(i => i.groupName).filter(Boolean))];
  return ["전체", ...uniqueGroups];
}, [idols]);

  /* ── API 응답에서 최대 득표수 계산 ── */
  const maxVotes = useMemo(() => {
    if (idols.length === 0) return 1;
    return Math.max(...idols.map((i) => i.votes ?? 0));
  }, [idols]);

  /* ── 필터링 ── */
  const filtered = useMemo(() => {
    return idols.filter((i) => {
      const groupOk = activeGroup === "전체" || i.groupName === activeGroup;
      // 이름뿐만 아니라 그룹명으로도 검색 가능하게 확장 가능
      const searchOk = !searchQuery || 
        (i.name && i.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return groupOk && searchOk;
    });
  }, [idols, activeGroup, searchQuery]);

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
  const goToProfile = (id) => {
    console.log("👉 클릭한 아이돌 ID:", id);
    navigate(`/Audition/profile/${id}`);
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
      <div className="il-page-header">
        <h2 className="il-page-title">참가자</h2>
        <p className="il-page-sub">총 {filtered.length}명의 참가자</p>
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

        <div className="il-group-tabs">
          {groups.map((g) => (
            <button
              key={g}
              className={`il-gtab${activeGroup === g ? " on" : ""}`}
              onClick={() => setActiveGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <span className="il-count-label">{filtered.length}명</span>
      </div>

      {/* ── 카드 그리드 ── */}
      <div className="il-grid">
        {filtered.map((idol) => {
          // API 응답 필드명: idolId, name, groupName, position, age, votes
          const votes = idol.votes ?? 0;
          const pct   = maxVotes > 0 ? Math.round((votes / maxVotes) * 100) : 0;
          const color = AVATAR_COLORS[(idol.idolId - 1) % AVATAR_COLORS.length];

          return (
            <div
              key={idol.idolId}
              className="il-card"
              onClick={() => goToProfile(idol.idolId)}
            >
              <div className="il-avatar" style={{ background: color, overflow: 'hidden' }}>
                {/* ✅ 사진이 있으면 보여주고, 없으면 이니셜 표시 */}
                {idol.mainImgUrl ? (
                  <img 
                    src={`http://localhost:8181/images/${idol.mainImgUrl}`} 
                    alt={idol.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      // 이미지 로드 실패 시 이니셜만 보이도록 처리
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : (
                  <span className="il-avatar-initial">{idol.name?.charAt(0) ?? "#"}</span>
                )}
              </div>

              <p className="il-idol-name">{idol.name ?? `참가자 #${idol.idolId}`}</p>
              <p className="il-idol-group">{idol.groupName || "개인 연습생"}</p>
                <p className="il-idol-position">{idol.position}</p>

              <div className="il-votes-area">
                <div className="il-votes-info">
                  <span className="il-votes-label">득표수</span>
                  <span className="il-votes-num">{votes.toLocaleString()}</span>
                </div>
                <div className="il-votes-bar-bg">
                  <div className="il-votes-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <span className="il-profile-hint">프로필 보기 →</span>
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