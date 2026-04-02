import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";
import SidebarNotice from "./SidebarComponent/SidebarNotice";

const AUDITION_LIST = [
  { id: 1, title: "1차 오디션", status: "ended",    competitionDate: "2026.01.15", voteStart: "2026.01.15", voteEnd: "2026.01.20", resultDate: "2026.01.21" },
  { id: 2, title: "2차 오디션", status: "ongoing",  competitionDate: "2026.02.12", voteStart: "2026.02.12", voteEnd: "2026.02.18", resultDate: "2026.02.19" },
  { id: 3, title: "3차 오디션", status: "upcoming", competitionDate: "2026.03.20", voteStart: "2026.03.20", voteEnd: "2026.03.26", resultDate: "2026.03.27" },
  { id: 4, title: "4차 오디션", status: "upcoming", competitionDate: "2026.04.17", voteStart: "2026.04.17", voteEnd: "2026.04.23", resultDate: "2026.04.24" },
  { id: 5, title: "5차 오디션", status: "upcoming", competitionDate: "2026.05.14", voteStart: "2026.05.14", voteEnd: "2026.05.20", resultDate: "2026.05.21" },
];

const NOTICES = [
  { id: 1, text: "2차 오디션 투표가 시작되었습니다!", date: "2026.02.12" },
  { id: 2, text: "1차 오디션 최종 결과가 발표되었습니다.", date: "2026.01.21" },
  { id: 3, text: "오디션 참가 신청이 마감되었습니다.", date: "2026.01.10" },
  { id: 4, text: "공식 굿즈 1차 판매가 시작되었습니다.", date: "2026.01.05" },
  { id: 5, text: "ACTION 오디션 플랫폼이 오픈했습니다.", date: "2025.12.01" },
];

const STATUS_MAP = {
  ongoing:  { label: "진행중", cls: "sb-status-ongoing"  },
  ended:    { label: "종료",   cls: "sb-status-ended"    },
  upcoming: { label: "예정",   cls: "sb-status-upcoming" },
};

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // 진행중인 오디션(id:2) 기본 오픈
  const [expandedId, setExpandedId] = useState(2);

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
              <button className="sb-user-btn" onClick={onClose}>🔔 알림</button>
              {user.id === "admin" &&
                <Link to="/AdminMain"><button className="sb-user-btn">관리자</button></Link>
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

        {/* 커뮤니티 활동기록 — 로그인 후만 */}
        {user && (
          <>
            <div className="sb-section">
              <p className="sb-section-title">커뮤니티 활동기록</p>
              <div className="sb-activity-list">
                <Link to={`/Community/BoardList?category=nickname&search=${user?.nickname}`} className="sb-activity-item" onClick={onClose}>
                  <span>📝</span><span className="sb-activity-label">내가 쓴 글</span>
                  <span className="sb-activity-count">3</span>
                </Link>
                <Link to="/Community" className="sb-activity-item" onClick={onClose}>
                  <span>💬</span><span className="sb-activity-label">내 댓글</span>
                  <span className="sb-activity-count">12</span>
                </Link>
                <Link to="/Mypage" className="sb-activity-item" onClick={onClose}>
                  <span>🔖</span><span className="sb-activity-label">북마크</span>
                  <span className="sb-activity-count">5</span>
                </Link>
              </div>
            </div>
            <div className="sb-divider" />
          </>
        )}
        
        {/* 오디션 섹션 */}
        <div className="sb-section">
          <p className="sb-section-title">오디션</p>
          <ul className="sb-aud-list">
            {AUDITION_LIST.map((a) => {
              const s = STATUS_MAP[a.status];
              const open = expandedId === a.id;
              return (
                <li key={a.id} className={`sb-aud-item${open ? " open" : ""}`}>
                  <div className="sb-aud-row" onClick={() => toggle(a.id)}>
                    <span className="sb-aud-title">{a.title}</span>
                    <span className={`sb-aud-status ${s.cls}`}>{s.label}</span>
                    <span className="sb-aud-chevron">{open ? "▲" : "▼"}</span>
                  </div>

                  {open && (
                    <div className="sb-aud-detail">
                      <div className="sb-aud-info-row">
                        <span className="sb-info-label">경연일</span>
                        <span className="sb-info-val">{a.competitionDate}</span>
                      </div>
                      <div className="sb-aud-info-row">
                        <span className="sb-info-label">투표일정</span>
                        <span className="sb-info-val">{a.voteStart} ~ {a.voteEnd}</span>
                      </div>
                      <div className="sb-aud-info-row">
                        <span className="sb-info-label">결과발표</span>
                        <span className="sb-info-val">{a.resultDate}</span>
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
        </div>

        <div className="sb-divider" />


        {/* 공지사항 최신 5개 */}
        {/* <div className="sb-section">
          <p className="sb-section-title">공지사항</p>
          <ul className="sb-notice-list">
            {NOTICES.map((n) => (
              <li key={n.id} className="sb-notice-item">
                <span className="sb-notice-text">{n.text}</span>
                <span className="sb-notice-date">{n.date}</span>
              </li>
            ))}
          </ul>
        </div> */}
        <SidebarNotice/>

      </aside>
    </>
  );
}

export default Sidebar;