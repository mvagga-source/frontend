import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./IdolList.css";

/* ── 더미 데이터 (추후 API 교체) ── */
const GROUPS = ["전체", "NOVA", "STAR", "LUNA", "AURORA", "PRISM", "BLAZE", "HALO"];

const IDOLS = [
  { id: 1,  name: "김지수", group: "NOVA",   votes: 89214, age: 19, position: "보컬" },
  { id: 2,  name: "박민준", group: "STAR",   votes: 72100, age: 17, position: "댄서" },
  { id: 3,  name: "이서연", group: "LUNA",   votes: 65833, age: 18, position: "래퍼" },
  { id: 4,  name: "최하늘", group: "AURORA", votes: 51302, age: 20, position: "보컬" },
  { id: 5,  name: "정은비", group: "PRISM",  votes: 44721, age: 16, position: "댄서" },
  { id: 6,  name: "강태양", group: "BLAZE",  votes: 38490, age: 21, position: "보컬" },
  { id: 7,  name: "윤하린", group: "HALO",   votes: 33201, age: 18, position: "래퍼" },
  { id: 8,  name: "오세진", group: "NOVA",   votes: 29874, age: 19, position: "댄서" },
  { id: 9,  name: "백소율", group: "LUNA",   votes: 25430, age: 17, position: "보컬" },
  { id: 10, name: "임도현", group: "STAR",   votes: 21009, age: 22, position: "래퍼" },
  { id: 11, name: "신아름", group: "PRISM",  votes: 18762, age: 16, position: "댄서" },
  { id: 12, name: "류찬혁", group: "BLAZE",  votes: 15344, age: 20, position: "보컬" },
  { id: 13, name: "한소희", group: "LUNA",   votes: 13820, age: 19, position: "보컬" },
  { id: 14, name: "오지환", group: "HALO",   votes: 12940, age: 21, position: "댄서" },
  { id: 15, name: "박서준", group: "NOVA",   votes: 12100, age: 18, position: "래퍼" },
  { id: 16, name: "김태리", group: "PRISM",  votes: 11380, age: 17, position: "보컬" },
  { id: 17, name: "이도현", group: "STAR",   votes: 10750, age: 20, position: "댄서" },
  { id: 18, name: "전소니", group: "BLAZE",  votes: 10020, age: 16, position: "래퍼" },
  { id: 19, name: "남주혁", group: "AURORA", votes:  9440, age: 22, position: "보컬" },
  { id: 20, name: "고윤정", group: "LUNA",   votes:  8890, age: 19, position: "댄서" },
  { id: 21, name: "차은우", group: "HALO",   votes:  8310, age: 21, position: "보컬" },
  { id: 22, name: "아이유", group: "NOVA",   votes:  7760, age: 18, position: "래퍼" },
  { id: 23, name: "송강",   group: "STAR",   votes:  7200, age: 20, position: "댄서" },
  { id: 24, name: "김유정", group: "PRISM",  votes:  6650, age: 17, position: "보컬" },
  { id: 25, name: "변우석", group: "BLAZE",  votes:  6110, age: 22, position: "래퍼" },
  { id: 26, name: "박보영", group: "AURORA", votes:  5580, age: 19, position: "댄서" },
  { id: 27, name: "위하준", group: "LUNA",   votes:  5040, age: 21, position: "보컬" },
  { id: 28, name: "손예진", group: "HALO",   votes:  4510, age: 18, position: "래퍼" },
  { id: 29, name: "정해인", group: "NOVA",   votes:  3970, age: 20, position: "댄서" },
  { id: 30, name: "한지민", group: "STAR",   votes:  3440, age: 17, position: "보컬" },
];

const AVATAR_COLORS = [
  "#1a2c4e","#1e1a2c","#1a2c1e","#2c1a1e","#1a1e2c",
  "#2c2a1a","#1e2c1a","#2a1a2c","#1a2a2c","#2c1a2a",
];

const maxVotes = Math.max(...IDOLS.map((i) => i.votes));

// ── 추후 프로필 페이지 연결 시 사용할 모달 관련 코드 (현재 미사용) ──
/*
import { useAuth } from "../../context/AuthContext";

const VIDEOS = [
  { title: "2차 오디션 풀 무대",   views: "12만회"  },
  { title: "연습 직캠 영상",        views: "8.9만회" },
  { title: "인터뷰 & 비하인드",    views: "5.2만회" },
];

const CHATS = [
  { nick: "팬팬팬",     msg: "오늘 무대 너무 좋았어요!", time: "방금"   },
  { nick: "director_k", msg: "꼭 데뷔해줘 응원해!",      time: "1분 전" },
];

// 모달 열기 상태
// const [selectedIdol, setSelectedIdol] = useState(null);
// const [activeTab,    setActiveTab]    = useState("info");

// 모달 렌더링 함수
// function ProfileModal({ idol, onClose }) {
//   return (
//     <div className="il-modal-overlay" onClick={onClose}>
//       <div className="il-modal" onClick={(e) => e.stopPropagation()}>
//         ... 프로필 탭 UI (아이돌정보 / 투표현황 / 관련영상 / 후원하기 / 팬채팅) ...
//       </div>
//     </div>
//   );
// }
*/

export default function IdolList() {
  const navigate = useNavigate();

  const [searchInput,  setSearchInput]  = useState("");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [activeGroup,  setActiveGroup]  = useState("전체");

  /* 필터링 */
  const filtered = useMemo(() => {
    return IDOLS.filter((i) => {
      const groupOk = activeGroup === "전체" || i.group === activeGroup;
      const searchOk = !searchQuery ||
        i.name.includes(searchQuery) ||
        i.group.includes(searchQuery);
      return groupOk && searchOk;
    });
  }, [activeGroup, searchQuery]);

  /* 검색 제출 */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  /* 검색 초기화 */
  const resetSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  /* 카드 클릭 → 프로필 페이지로 이동 (추후 경로 확정 시 수정) */
  const goToProfile = (id) => {
    navigate(`/Audition/profile/${id}`);
  };

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
          {GROUPS.map((g) => (
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
          const pct = Math.round((idol.votes / maxVotes) * 100);
          const color = AVATAR_COLORS[(idol.id - 1) % AVATAR_COLORS.length];

          return (
            <div
              key={idol.id}
              className="il-card"
              onClick={() => goToProfile(idol.id)}
            >
              <div className="il-avatar" style={{ background: color }}>
                <span className="il-avatar-initial">{idol.name.charAt(0)}</span>
              </div>

              <p className="il-idol-name">{idol.name}</p>
              <p className="il-idol-group">{idol.group}</p>
              <p className="il-idol-position">{idol.position}</p>

              <div className="il-votes-area">
                <span className="il-votes-num">{idol.votes.toLocaleString()}</span>
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

    </div>
  );
}