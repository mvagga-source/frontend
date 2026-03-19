import React, { useState } from "react";
import "./Process.css";
import myVideo from "../../assets/101.mp4";
import bg from '../../assets/images/singer_bg.png';

function Process() {
  const [activeTab, setActiveTab] = useState(0);

  const processData = [
    {
      id: 0,
      displayId: "⯌",
      title: "INTRODUCE",
      sections: [
        { label: "01", items: ["1차 등급평가", "101명 연습생 등급 부여", "첫 투표 및 대표곡 과제"] },
        { label: "02", items: ["2차 팀 대결 무대", "60명이 6명씩 팀 구성", "5곡으로 첫 무대 경연"] },
        { label: "03", items: ["3차 아이돌 그룹 곡 경연", "50명이 5명씩 팀 구성", "대표 아이돌 곡으로 무대"] },
        { label: "04", items: ["4차 컨셉평가", "28명이 7명씩 팀 구성", "현업 작곡가 신곡 평가"] },
        { label: "05", items: ["5차 파이널 무대", "14명이 7명씩 두 팀", "자체 작곡곡 생방송 무대"] },
        { label: "06", items: ["최종 데뷔 멤버 선정", "최종 1~7등 데뷔", "실시간 투표로 데뷔 확정"] }
      ],
      videoSrc: myVideo,
      result: "ACTION 101: 오디션 진행 일정 안내"
    },
    { 
      id: 1, 
      displayId: "1", 
      title: "1차 등급평가", 
      sections: [
        { label: "VOCAL", items: ["음정의 정확도", "박자 감각", "발성 및 성량", "가사 전달력", "감정 표현 및 곡 해석력"] },
        { label: "DANCE", items: ["안무 이해도 및 습득 속도", "박자감과 리듬감", "신체 유연성 및 파워", "무대 표현력 및 시선 처리", "동선 이해 및 디테일"] },
        { label: "RAP", items: ["정확한 딕션(발음)", "비트와의 조화(플로우)", "라임 이해도 및 가사 전달력", "고유의 톤과 자신감"] },
        { label: "MIND", items: ["무대 매너 및 관객 소통", "표정 연기 및 몰입도", "연습 태도 및 인성"] },
        { label: "CHARM", items: ["스타성과 독보적인 개성", "비주얼 매력"] }
      ], 
      result: "※ 평가 결과에 따라 A, B, C, D, F 등급 분류" 
    },
    { id: 2, displayId: "2", title: "2차 팀 대결 무대", sections: [], result: "상세 내용 업데이트 예정" },
    { id: 3, displayId: "3", title: "3차 아이돌 그룹 곡 경연", sections: [], result: "상세 내용 업데이트 예정" },
    { id: 4, displayId: "4", title: "4차 컨셉평가", sections: [], result: "상세 내용 업데이트 예정" },
    { id: 5, displayId: "5", title: "5차 파이널 무대", sections: [], result: "상세 내용 업데이트 예정" },
    { id: 6, displayId: "⯌", title: "최종 데뷔 멤버 선정", sections: [], result: "커밍순" }
  ];

  return (
    <div className="content">
      <div className="process-nav">
        {processData.map((data) => (
          <button
            key={data.id}
            className={`nav-btn ${activeTab === data.id ? "active" : ""}`}
            onClick={() => setActiveTab(data.id)}
          >
            {data.displayId}
          </button>
        ))}
      </div>

      <div className="ps-info-notice-box" key={activeTab} style={{backgroundImage: `url(${bg})`, backgroundRepeat: 'no-repeat'}}> {/* 탭 전환 시 애니메이션 재시작을 위해 key 추가 */}
        <div className="process-detail-header">
          <span className="process-num">⯌</span>
          <h2 className="process-title">{processData[activeTab].title}</h2>
        </div>

        <div className="process-scroll-list">
          {processData[activeTab].sections.map((section, idx) => (
            <div 
              key={idx} 
              className="scroll-item"
              style={{ "--item-index": idx }}
            >
              <div className="scroll-label">{section.label}</div>
              <div className="scroll-content">
                {section.items.map((item, i) => (
                  <p key={i} className={i === 0 ? "highlight-text" : "sub-text"}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

          {processData[activeTab].result && (
          <div className="process-result">{processData[activeTab].result}</div>
        )}

          {processData[activeTab].videoSrc && (
            <div className="process-video-wrapper">
                <video 
                key={processData[activeTab].videoSrc} /* 탭 바뀔 때 영상도 새로 불러오기 위해 key 추가 */
                className="process-video"
                controls        /* 재생 바 표시 */
                autoPlay       /* 자동 재생 (브라우저 정책상 소리 끄고 시작될 수 있음) */
                muted          /* 자동 재생을 위해 음소거 필수 */
                loop           /* 무한 반복 */
                playsInline    /* 모바일에서 전체화면 방지 */
                >
                <source src={processData[activeTab].videoSrc} type="video/mp4" />
                사용자의 브라우저가 비디오 태그를 지원하지 않습니다.
                </video>
            </div>
            )}

        
      </div>
    </div>
  );
}

export default Process;