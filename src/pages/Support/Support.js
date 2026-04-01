import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Support.css"; // 새로운 CSS 파일
import axiosInstance from "../../api/axiosInstance";

export default function Support() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [idol, setIdol] = useState(null);
  const [supportData, setSupportData] = useState({
    totalAmount: 0,
    targetAmount: 5000000, // 임시 목표액 (500만원)
    logs: [
      { id: 1, name: "공유", amount: 10000, date: "2026-03-25" },
      { id: 2, name: "팬A", amount: 5000, date: "2026-03-26" },
    ]
  });

  useEffect(() => {
    // 1. 연습생 기본 정보 가져오기 (상세페이지 API 재활용)
    const fetchSupportInfo = async () => {
      try {
        const response = await axiosInstance.get(`/idolProfile/${id}`);
        setIdol(response.data.profile || response.data);
        // 2. 후원 내역 합계 API가 있다면 여기서 추가 호출
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };
    fetchSupportInfo();
  }, [id]);

  if (!idol) return <div className="loading">로딩 중...</div>;

  // 퍼센트 계산
  const percentage = Math.min((supportData.totalAmount / supportData.targetAmount) * 100, 100);

  return (
    <div className="sp-wrap">
      {/* 상단 바 */}
      <div className="id-back-bar">
        <button className="id-back-btn" onClick={() => navigate(-1)}>← 돌아가기</button>
      </div>

      <div className="sp-container">
        {/* --- 왼쪽 사이드바 (프로필) --- */}
        <div className="sp-left">
          <div className="sp-profile-card">
            <img 
              src={idol.mainImgUrl ? `http://localhost:8181/profile/${idol.mainImgUrl}` : "/default_profile.png"} 
              alt="profile" 
            />
            <h3>{idol.name}</h3>
            <p className="sp-one-line">"{idol.name}에게 응원을 보내보세요!"</p>
            <div className="sp-pr-video">
              <img src="/default_profile.png" alt="PR" />
              <span>1 MIN PR 영상 보러가기</span>
            </div>
          </div>
        </div>

        {/* --- 중앙 (모금 현황) --- */}
        <div className="sp-center">
          <div className="sp-info-box">
            <h4>안녕하세요, ACTION 101입니다.</h4>
            <p>{idol.name}의 데뷔 지원을 위한 모금을 진행합니다. 소중한 후원금은 광고 및 MV 제작에 사용됩니다.</p>
            <div className="sp-account-info">
              <div>
                <p><strong>모금계좌:</strong> 카카오 000-000-000-000</p>
                <p><strong>PAYPAL:</strong> action101@naver.com</p>
                <p className="sp-caution">* 입금 시: (연습생이름)+(본인이름)</p>
              </div>
              <div className="sp-qr-code">
                <div className="qr-placeholder">QR</div>
              </div>
            </div>
          </div>

          <div className="sp-progress-section">
            <div className="sp-prog-item">
              <span>개인광고 모금 현황</span>
              <div className="sp-bar-bg">
                <div className="sp-bar-fill" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="sp-percent-text">{percentage}% 달성</span>
            </div>
          </div>

          {/* 실시간 참여 내역 (티커 형태) */}
          <div className="sp-log-grid">
            {supportData.logs.map(log => (
              <div key={log.id} className="sp-log-item">
                <strong>{log.name}</strong>님이 <strong>{log.amount.toLocaleString()}원</strong> 모금에 참여하셨습니다.
              </div>
            ))}
          </div>
        </div>

        {/* --- 오른쪽 (주의사항) --- */}
        <div className="sp-right">
          <div className="sp-notice-card">
            <h5>약관 및 주의사항</h5>
            <div className="sp-notice-content">
              - 입금 후에는 환불이 불가능합니다.<br/>
              - 타인 명의 도용 시 불이익이 발생할 수 있습니다.<br/>
              - 모금액은 투명하게 공개됩니다.
            </div>
          </div>
          <div className="sp-ad-preview">
            <h5>현재 진행 가능한 광고</h5>
            <div className="sp-ad-box">지하철 전광판</div>
            <div className="sp-ad-box">버스 외부 광고</div>
          </div>
        </div>
      </div>
    </div>
  );
}