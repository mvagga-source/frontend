import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";
import SidebarNotice from "./SidebarComponent/SidebarNotice";
import SidebarNotification from "./SidebarComponent/SidebarNotification";
import { getAllAuditionListApi } from "../api/auditionApi";

// LocalDate → "YYYY.MM.DD" 변환
const formatDate = (d) => {
  if (!d) return "-";
  if (Array.isArray(d)) {
    const [y, m, day] = d;
    return `${y}.${String(m).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  }
  return String(d).replace(/-/g, ".").slice(0, 10);
};

const STATUS_MAP = {
  ongoing:  { label: "진행중", cls: "sb-status-ongoing"  },
  ended:    { label: "종료",   cls: "sb-status-ended"    },
  upcoming: { label: "예정",   cls: "sb-status-upcoming" },
};

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [auditionList, setAuditionList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getAllAuditionListApi()
      .then((res) => {
        const list = res.data;
        setAuditionList(list);
        // ongoing 있으면 자동 펼침, 없으면 마지막 회차
        const ongoingItem = list.find((a) => a.status === "ongoing");
        if (ongoingItem) {
          setExpandedId(ongoingItem.auditionId);
        } else if (list.length > 0) {
          setExpandedId(list[list.length - 1].auditionId);
        }
      })
      .catch((err) => {
        console.error("오디션 목록 로드 실패:", err);
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/");
  };

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <>
      <div className={`sb-overlay${isOpen ? " open" : ""}`} onClick={onClose} />

      <aside className={`sb-panel${isOpen ? " open" : ""}`}>

        {/* 헤더 */}
        <div className="sb-header">
          <span className="sb-logo">ACTION</span>
          <button className="sb-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* 로그인 전/후 */}
        {user ? (
          <div className="sb-user">
            <div className="sb-user-row">
              <div className="sb-avatar">{user.nickname ? user.nickname.charAt(0) : "U"}</div>
              <div>
                <p className="sb-user-name">{user.nickname}님</p>
                <p className="sb-user-sub">{user.email || "디렉터"}</p>
              </div>
            </div>
            <div className="sb-user-btns">
              <Link to="/MyMain" className="sb-user-btn" onClick={onClose}>마이페이지</Link>
              {/* <button className="sb-user-btn" onClick={onClose}>🔔 알림</button> */}
              {/* 🔔 기존 버튼 대신 컴포넌트 호출 */}
              <SidebarNotification />
              {user.id === "admin" &&
                <a href="http://localhost:8181/admin/main">
                  <button className="sb-user-btn">관리자</button>
                </a>
              }
              <button className="sb-user-btn sb-user-btn-logout" onClick={handleLogout}>로그아웃</button>
            </div>
          </div>
        ) : (
          <div className="sb-auth">
            <Link to="/UserLogin" className="sb-btn-login"  onClick={onClose}>로그인</Link>
            <Link to="/UserSignUp" className="sb-btn-signup" onClick={onClose}>회원가입</Link>
          </div>
        )}

        <div className="sb-divider" />
        
        {/* 오디션 섹션 */}
        <div className="sb-section">
          <p className="sb-section-title">오디션</p>
          {auditionList.length === 0 ? (
            <p className="sb-empty">오디션 정보를 불러오는 중...</p>
          ) : (
            <ul className="sb-aud-list">
              {auditionList.map((a) => {
                const s = STATUS_MAP[a.status] || { label: a.status, cls: "" };
                const open = expandedId === a.auditionId;
                return (
                  <li key={a.auditionId} className={`sb-aud-item${open ? " open" : ""}`}>
                    <div className="sb-aud-row" onClick={() => toggle(a.auditionId)}>
                      <span className="sb-aud-title">{a.title}</span>
                      <span className={`sb-aud-status ${s.cls}`}>{s.label}</span>
                      <span className="sb-aud-chevron">{open ? "▲" : "▼"}</span>
                    </div>

                    {open && (
                      <div className="sb-aud-detail">
                        <div className="sb-aud-info-row">
                          <span className="sb-info-label">투표 시작</span>
                          <span className="sb-info-val">{formatDate(a.startDate)}</span>
                        </div>
                        <div className="sb-aud-info-row">
                          <span className="sb-info-label">투표 마감</span>
                          <span className="sb-info-val">{formatDate(a.endDate)}</span>
                        </div>

                        {a.status === "ongoing" && (
                          <Link to="/Audition" className="sb-action-btn sb-action-vote" onClick={onClose}>
                            투표참여하기 →
                          </Link>
                        )}
                        {a.status === "ended" && (
                          <Link to="/AuditionResult" className="sb-action-btn sb-action-result" onClick={onClose}>
                            결과보기 →
                          </Link>
                        )}
                        {a.status === "upcoming" && (
                          <span className="sb-action-btn sb-action-upcoming">투표 예정</span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="sb-divider" />

        {/* 공지사항 섹션 */}
        <SidebarNotice/>

      </aside>
    </>
  );
}

export default Sidebar;