import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Support.css"; 
import axiosInstance from "../../api/axiosInstance";
import SupportPaymentModal from "./SupportPaymentModal";
import axios from "axios";

export default function Support() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 상태 관리
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [isMvOpen, setIsMvOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idol, setIdol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [amount, setAmount] = useState(""); // 입력할 후원 금액
  const [realName, setRealName] = useState(""); // 본인 이름 상태 추가
  
  // 서포트 관련 통합 상태
  const [supportInfo, setSupportInfo] = useState({
    title: "",
    //개인광고
    currPrice: 0,
    goalPrice: 5000000,
    totalAmount: 0,
    targetAmount: 5000000,
    //mv용
    mvCurrPrice: 0,  // 초기값 0
    mvGoalPrice: 100000000,   // 초기값 1 (0으로 나누기 방지)
    logs: []
  });


  // 카카오페이 결제 시작 함수
const handleKakaoPay = async () => {
  if (!amount || amount < 100) {
    alert("최소 후원 금액은 100원입니다.");
    return;
  }

  try {
    // 1. 서버에 결제 준비(Ready) 요청
    const res = await axiosInstance.post("/support/pay/ready", {
      supportProject: { supportId: id },
      nickname: user?.nickname || "익명의 서포터",
      realName: realName, // [추가] 모달에서 입력받은 실명 전송
      amount: parseInt(amount),
      status: "READY"
    });
    console.log("백엔드 응답 데이터:", res.data);
    // 2. 서버에서 받은 tid와 관련 정보 저장
    localStorage.setItem("tid", res.data.tid);
    localStorage.setItem("supportId", id);

    // 3. 결제 페이지 이동
    if (res.data && res.data.next_redirect_pc_url) {
      window.location.href = res.data.next_redirect_pc_url; 
    } else {
      alert("결제 페이지 주소를 받아오지 못했습니다.");
    }
  } catch (err) {
    console.error("결제 에러:", err);
    alert("결제 준비 중 오류가 발생했습니다.");
  }
};

  // 1. 카카오페이 이미지 클릭 시 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true); // 조건 없이 일단 창을 띄움
  };

  // 2. 모달 안에서 '결제하기' 눌렀을 때 실제 실행될 함수
  const handleFinalPayment = () => {
  if (!amount || amount < 100) {
    alert("최소 후원 금액은 100원입니다.");
    return;
  }
  if (!realName) {
    alert("입금자 성함을 입력해주세요.");
    return;
  }
  handleKakaoPay(); 
};


  useEffect(() => {
    const fetchSupportInfo = async () => {
      try {
        setLoading(true);
        // API 병렬 호출
        const [projectRes, logsRes, idolRes] = await Promise.all([
          axiosInstance.get(`/support/project/${id}`), // /api 제거
          axiosInstance.get(`/support/logs/${id}`),    // /api 제거
          axiosInstance.get(`/idolProfile/${id}`)
        ]);

        const idolData = idolRes.data.profile || idolRes.data;
        setIdol(idolData);

        // API 응답 구조에 맞게 상태 업데이트
        setSupportInfo({
          title: projectRes.data.title || "서포트 프로젝트",
          currPrice: projectRes.data.currPrice || 0,
          goalPrice: projectRes.data.goalPrice || 5000000,
          totalAmount: projectRes.data.currPrice || 0,
          targetAmount: projectRes.data.goalPrice || 5000000,

          // [수정] 백엔드에 값이 없을 경우를 대비해 테스트용 수치 입력
          mvCurrPrice: projectRes.data.mvCurrPrice || 3521000, // 0 대신 테스트 값
          mvGoalPrice: projectRes.data.mvGoalPrice || 10000000, // 0 대신 목표치 1,000만 원
          
          logs: logsRes.data || []
        });
        console.log("프로젝트 데이터:", projectRes.data);
        console.log("개인광고 금액:", projectRes.data.currPrice);

      } catch (err) {
        console.error("데이터 로딩 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupportInfo();
  }, [id]);

  // 퍼센트 계산 함수
  const calculatePercent = (current, target) => {
    if (!target || target === 0) return "0.000";
    const percent = (current / target) * 100;
    return percent.toFixed(3);
  };

  if (loading) return <div className="loading">데이터를 불러오는 중...</div>;
  if (!idol) return <div className="loading">데이터를 찾을 수 없습니다.</div>;

  const adPercentage = calculatePercent(supportInfo.currPrice, supportInfo.goalPrice);
 const mvPercentage = calculatePercent(supportInfo.mvCurrPrice, supportInfo.mvGoalPrice);

  return (
    <div className="sp-wrap">
      {/* 상단 바 */}
      <div className="id-back-bar">
        <button className="id-back-btn" onClick={() => navigate(-1)}>← 돌아가기</button>
      </div>

      <div className="sp-container">
        {/* --- [왼쪽] 프로필 사이드바 + 실시간 로그 --- */}
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

          <div className="sp-live-logs">
            <h5>실시간 참여 내역</h5>
            <div className="sp-log-rolling-wrap">
              <div className="sp-log-rolling-list">
                {supportInfo.logs.length > 0 ? (
                  [...supportInfo.logs, ...supportInfo.logs].map((log, index) => (
                    <div key={`${log.logId || index}-${index}`} className="sp-log-item-mini">
                      <span className="log-user">{log.nickname}</span>님이 
                      <span className="log-amt"> {Number(log.amount).toLocaleString()}원</span> 참여!
                    </div>
                  ))
                ) : (
                  <div className="sp-log-item-mini">첫 후원자가 되어주세요!</div>
                )}
              </div>
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
            <p className="sp-notice-small">
              * 중도 방출된 연습생에게 후원된 전체 금액은 모두 <strong>초록우산 어린이재단</strong>에 연습생 {idol.name}의 이름으로 기부됩니다.
            </p>
            <div className="sp-divider"></div>

            <div className="sp-account-info">
              <div className="account-text-side">
                <div className="account-main-details">
                  <p><strong>PAYPAL : </strong> action101@naver.com</p>
                  <p><strong>모금계좌 : </strong> 카카오 000-000-000-000</p>
                  <p className="sp-caution">* 입금자명: (연습생이름)+(본인이름 또는 닉네임)</p>
                </div>
              </div>
              <div className="account-btn-side">
                <div className="paypal-btn-styled"><img src="/images/paypal.png" alt="PAYPAL" /></div>
                 {/* 카카오페이 버튼 클릭 시 함수 호출 */}
                <div className="kakaopay-img-btn" onClick={handleOpenModal} style={{cursor: 'pointer'}}>
                  <img src="/images/kakao.png" alt="Kakaopay" />
                </div>

                {/* 서포트 전용 확인 모달 */}
                <SupportPaymentModal 
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onConfirm={handleFinalPayment}
                  data={{
                    idolName: idol.name,
                    nickname: user?.nickname || "익명",
                    amount: amount,
                    setAmount: setAmount, // 금액 수정을 위해 추가
                    realName: realName,
                    setRealName: setRealName
                  }}
                />

              </div>
            </div>
          </div>

          <br />

         {/* 1. 개인광고 모금 섹션 */}
          <div className="sp-progress-section">
            <div className="sp-prog-item">
              <div className="sp-collapse-header" onClick={() => setIsAdOpen(!isAdOpen)}>
                <span className="sp-header-title">개인광고 모금 현황</span>
                <span className="sp-arrow">{isAdOpen ? "▲" : "▼"}</span>
              </div>

              {isAdOpen && (
                <div className="sp-ad-content-card">
                  <div className="sp-ad-header">
                    <div className="sp-live-indicator"><span className="dot"></span> NOW</div>
                    <h3 className="sp-ad-title">공항철도 미디어 터널 광고</h3>
                    <p className="sp-ad-subtitle">인증샷은 공식 SNS에서 확인 가능합니다.</p>
                  </div>
                  <div className="sp-ad-footer-box">
                    <p className="sp-main-text">팬 여러분의 마음이 모여 <strong>{adPercentage}%</strong> 도달!</p>
                    <p className="sp-sub-text">목표 달성 시 다음 단계 투표가 오픈됩니다.</p>
                  </div>
                </div>
              )}

              <div className="sp-bar-bg">
                <div className="sp-bar-fill" style={{ width: `${adPercentage}%` }}>
                  <span className="sp-bar-percent-inside">{adPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. MV 섹션 (개인광고와 동일한 포맷 적용) */}
          <div className="sp-progress-section mv-special-section">
            <div className="sp-prog-item">
              <div className="sp-collapse-header" onClick={() => setIsMvOpen(!isMvOpen)}>
                <span className="sp-header-title">
                  MV 제작 서포트 (4차 이후 활성화)
                </span>
                <span className="sp-arrow">{isMvOpen ? "▲" : "▼"}</span>
              </div>

              {isMvOpen && (
                <div className="sp-ad-content-card mv-card-bg">
                  <div className="sp-ad-header">
                    <div className="sp-live-indicator"><span className="dot"></span> NOW</div>
                    <h3 className="sp-ad-title"> DEBUT BUILD-UP PROJECT</h3>
                    <p className="sp-ad-subtitle">{idol.name}의 성공적인 데뷔를 위한 마지막 조각</p>
                  </div>
                  <div className="sp-ad-footer-box">
                    <p className="sp-main-msg">첫 번째 오리지널 뮤직비디오를 함께 완성해 주세요.</p>
                    <ul className="sp-support-list">
                      <li>범위: 영상 프로덕션, 아트 디렉팅, 로케이션 대관 등</li>
                      <li>리워드: 달성 시 현장 비하인드 & 메이킹 필름 공개</li>
                    </ul>
                    <p className="sp-footer-quote">"팬들의 참여가 전 세계로 연결되는 통로가 됩니다."</p>
                  </div>
                </div>
              )}


              <div className="sp-bar-bg">
                <div className="sp-bar-fill" style={{ width: `${mvPercentage}%` }}>
                  <span className="sp-bar-percent-inside">{mvPercentage}%</span>
                </div>
              </div>
            </div>
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
              <div className="ad-step-item">
                <div className="ad-step-header">
                  <span className="ad-step-badge s1">STEP 1</span>
                </div>
                <ul>
                  <li>SNS 타겟팅 광고 (X, 인스타그램)</li>
                  <li>지하철 내부 액자형 광고 (다수 부착)</li>
                </ul>
              </div>

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