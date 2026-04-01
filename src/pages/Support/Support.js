import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Support.css"; 
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
    // 1. 연습생 기본 정보 가져오기
    const fetchSupportInfo = async () => {
      try {
        const response = await axiosInstance.get(`/idolProfile/${id}`);
        setIdol(response.data.profile || response.data);
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
        {/* --- [왼쪽] 프로필 사이드바 --- */}
        <div className="sp-left">
          <div className="sp-profile-card">
            <img 
              src={idol.mainImgUrl ? `http://localhost:8181/profile/${idol.mainImgUrl}` : "/default_profile.png"} 
              alt="profile" 
            />
            <h3>{idol.name}</h3>
            <p className="sp-one-line">"{idol.name} 연습생에게 응원을 보내보세요!"</p>
            <div className="sp-pr-video">
              <img src="/default_profile.png" alt="PR" />
              <span>1 MIN PR 영상 보러가기</span>
            </div>
          </div>
        </div>

        {/* --- [중앙] 모금 현황 --- */}
        <div className="sp-center">
          <div className="sp-info-box">
            <h4>안녕하십니까, ACTION 101입니다.</h4>
            <p>{idol.name} 연습생의 데뷔 지원을 위해 활동 및 개인광고 서포트 모금을 진행합니다.</p>
            <p>모금에 참여해 주시는 분들께 보답하고자, 연습생 {idol.name}의 성공적인 데뷔를 위하여</p>
            <p>ACTION 101 또한 적극적인 지원이 있을 예정이오니 많은 관심과 참여 부탁드립니다.</p>
            <p>모금된 금액은 모두 연습생 {idol.name}의 개인광고 서포트 및 뮤직비디오에 사용됩니다.</p>
            <p>금액은 자유입니다. 적은 금액이라도 소중하게 사용됩니다,</p>
            <p className="sp-notice-small">
              * 중도 방출된 연습생에게 후원된 전체 금액은 모두 <strong>초록우산 어린이재단</strong>에 연습생 {idol.name}의 이름으로 기부됩니다.
            </p>
            {/* 추가된 점선 구분선 */}
            <div className="sp-divider"></div>


            <div className="sp-account-info">
              {/* 왼쪽: 텍스트 정보 */}
              <div className="account-text-side">
                <div className="account-main-details">
                  <p><strong>PAYPAL : </strong> action101@naver.com</p>
                  <p><strong>모금계좌 : </strong> 카카오 000-000-000-000</p>
                  <p className="sp-caution">* 입금자명: (연습생이름)+(본인이름)</p>
                </div>
                
                <div className="account-warning-details">
                  <p className="sp-notice-small warn">
                    입금 후에는 환불 및 취소가 불가능합니다.<br/>
                    본인 실수로 인한 불이익은 책임지지 않습니다. (입금자명 및 금액 오타 등)
                  </p>
                </div>
              </div>

              {/* 오른쪽: PAYPAL 및 QR 버튼 세션 */}
              <div className="account-btn-side">
                <a href="https://www.paypal.me/yourid" target="_blank" rel="noopener noreferrer" className="paypal-btn-styled">
                  <img src="/images/paypal.png" alt="PAYPAL" />
                </a>
                
                <div className="kakaopay-img-btn" onClick={() => window.open('https://www.kakaopay.com/')}>
                <img src="/images/kakao.png" alt="Kakaopay" />
              </div>
              </div>
            </div>
          </div><br></br>

          {/* 게이지 바 섹션 */}
          <div className="sp-progress-section">
            <div className="sp-prog-item">
              <span>개인광고 모금 현황</span>
              <div className="sp-bar-bg">
                <div className="sp-bar-fill" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="sp-percent-text">{percentage}% 달성</span>
            </div>
          </div>

          {/* 실시간 참여 내역 */}
          <div className="sp-log-grid">
            {supportData.logs.map(log => (
              <div key={log.id} className="sp-log-item">
                <strong>{log.name}</strong>님이 <strong>{log.amount.toLocaleString()}원</strong> 모금에 참여하셨습니다.
              </div>
            ))}
          </div>
        </div>

        {/* --- [오른쪽] 주의사항 및 이용약관 --- */}
        <div className="sp-right">
          <div className="sp-notice-card">
            <h5>ACTION 101 이용약관</h5>
            <div className="sp-notice-content scroll-box">
              <strong>제 1 조 (목적)</strong><br/>
              본 약관은 ACTION 101 운영팀이 제공하는 연습생 투표, 후원 및 커뮤니티 서비스 이용에 관한 제반 사항을 규정함을 목적으로 합니다.<br/><br/>
              
              <strong>제 2 조 (정의)</strong><br/>
              1. "이용자"는 서비스를 이용하는 회원 및 비회원을 말합니다.<br/>
              2. "서포터"는 연습생 데뷔 지원 모금에 참여하는 회원을 의미합니다.<br/><br/>
              
              <strong>제 11 조 (회원의 의무)</strong><br/>
              - 회원은 중복 투표 방지 및 부정 행위 금지 규정을 준수해야 합니다.<br/>
              - 연습생에 대한 비방이나 명예를 손상시키는 행위를 금지합니다.<br/><br/>
              
              <strong>제 18 조 (계약 해지 및 후원 중단)</strong><br/>
              - 데뷔 서포트 후원의 경우, 입금 완료 후에는 원칙적으로 환불이 불가능합니다.<br/><br/>
              
              <strong>제 22 조 (후원금의 사용 및 기부)</strong><br/>
              - 모금액은 해당 연습생의 광고 및 활동 지원에 투명하게 사용됩니다.<br/>
              - <strong>중도 방출된 연습생의 후원금은 전액 '초록우산 어린이재단'에 해당 연습생의 이름으로 기부됩니다.</strong><br/><br/>
              
              <strong>부칙</strong><br/>
              본 약관은 2026년 4월 1일부터 적용됩니다.
            </div>
          </div>


          
          <div className="sp-ad-preview">
            <h5>광고 집행 가이드</h5>
            <p className="ad-guide-intro">
              모금된 금액이 목표치에 도달함에 따라<br/> 
              <strong>아래와 같은 단계별 서포트</strong>가 진행됩니다.
            </p>
            
            <div className="sp-ad-scroll-box">
              {/* 1단계: 소액형 */}
              <div className="ad-step-item">
                <div className="ad-step-header">
                  <span className="ad-step-badge s1">STEP 1</span>
                </div>
                <ul>
                  <li>SNS 타겟팅 광고 (X, 인스타그램)</li>
                  <li>지하철 내부 액자형 광고 (다수 부착)</li>
                </ul>
              </div>

              {/* 2단계: 실속형 */}
              <div className="ad-step-item">
                <div className="ad-step-header">
                  <span className="ad-step-badge s2">STEP 2</span>
                </div>
                <ul>
                  <li>생일 카페 대관 및 특전 제작 운영</li>
                  <li>주요 역사 디지털 포스터 영상 광고</li>
                  <li>버스 쉘터(정류장) 대형 광고</li>
                </ul>
              </div>

              {/* 3단계: 집중형 */}
              <div className="ad-step-item">
                <div className="ad-step-header">
                  <span className="ad-step-badge s3">STEP 3</span>
                </div>
                <ul>
                  <li>지하철 역사 내 와이드 컬러 조명판</li>
                  <li>버스 래핑 광고 (도심 순환형)</li>
                  <li>공항철도 미디어 터널 광고</li>
                </ul>
              </div>

              {/* 4단계: 프리미엄형 */}
              <div className="ad-step-item">
                <div className="ad-step-header">
                  <span className="ad-step-badge s4">STEP 4</span>
                </div>
                <ul>
                  <li>2호선 메인역(강남·삼성·홍대) 스크린도어</li>
                  <li>강남대로·명동 빌딩 대형 LED 전광판</li>
                  <li>버스 래핑 광고 (1개월 장기 집행)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}