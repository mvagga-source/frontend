import React, { useState } from "react";
import "./Process.css";
import introVideo from "../../assets/101.mp4";
import VoteVideo from "../../assets/vote.mov";
import singerBg from "../../assets/images/singer_bg.png";

// ID 2용 이미지들 (파일명이 다를 경우 수정해주세요)
import step2img01 from "../../assets/images/step2_01.png";
import step2img02 from "../../assets/images/step2_02.png";
import step2img03 from "../../assets/images/step2_03.png";
import step2img04 from "../../assets/images/step2_04.png";
import step2img05 from "../../assets/images/step2_05.png";
import step2img06 from "../../assets/images/step2_03.png";
import step2img_silhouette from "../../assets/images/step2_07.png";

// ID 3용 이미지들 (파일명이 다를 경우 수정해주세요)
import step3img01_sil from "../../assets/images/step3img01_sil.png"; // 실루엣/스포트라이트 배경
import step3img02_1 from "../../assets/images/step03_01.png"; // 4분할 이미지 1 (무대)
import step3img02_2 from "../../assets/images/step03_0201.png"; // 4분할 이미지 2 (손/나무)
import step3img02_3 from "../../assets/images/step03_03.png"; // 4분할 이미지 3 (핸드폰)
import step3img02_4 from "../../assets/images/step03_04.png"; // 4분할 이미지 3 (핸드폰)
import 그림04 from "../../assets/images/그림04.png"; // 4분할 이미지 2 (손/나무)
import 그림05 from "../../assets/images/그림05.png"; // 4분할 이미지 3 (핸드폰)
import 그림06 from "../../assets/images/그림06.png"; // 4분할 이미지 3 (핸드폰)

// 상단 이미지 import (경로는 파일 위치에 맞게 수정하세요)
import mic from "../../assets/images/step4_1.png"; 
import play from "../../assets/images/step4_2.png";
import vote1 from "../../assets/images/step4_3.png";
import vote2 from "../../assets/images/step4_4.png";
import step4_04_1 from "../../assets/images/step4_01.png";
import step4_04_2 from "../../assets/images/step4_02.png";
import step4_04_3 from "../../assets/images/step4_03.png";


// ID 5용 이미지들 (파일명은 예시입니다)
import mv_icon1 from "../../assets/images/step5_01.png";
import mv_icon2 from "../../assets/images/step5_02.png";
import mv_icon3 from "../../assets/images/step5_03.png";
import mv_icon4 from "../../assets/images/step5_04.png";

import final_img1 from "../../assets/images/step5_05.png";
import final_img2 from "../../assets/images/step5_06.png";
import final_img3 from "../../assets/images/step5_07.png";
import final_img4 from "../../assets/images/step5_08.png";


function Process() {
  const [activeTab, setActiveTab] = useState(1); 

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
      videoSrc: introVideo,
    },
    { 
      id: 1, 
      displayId: "1", 
      title: "1차 등급평가", 
      gridCards: [
        { title: "등급평가", items: ["101명 연습생 개별 평가", "심사위원의 A~F 등급 부여", "평가 과정 방송 송출"] },
        { title: "프로그램 방영", items: ["101명 연습생 개별 평가", "프로그램 기숙사 리얼리티", "연습생 연습 및 중간평가"] },
        { title: "첫 과제", items: ["대표곡 2주간 연습", "등급 재평가 및 상향 조정", "연습 과정 녹화 방송"] },
        { title: "투표 시작", items: ["경연 사이트 매일 투표", "1명당 7명 투표 가능", "방송 시청 후 투표 진행"] }
      ],
      listSteps: [
        { label: "투표방식", text: "경연 사이트 매일 투표(7명) + 금요일 방송 중 문자투표(1명)" },
        { label: "첫 순위발표식", text: "첫 과제 결과 송출 후 시청자 투표로 결정된 순위 발표" },
        { label: "순위 발표", text: "1~10등 순위 공개 및 하위권 61~101등 연습생 방출" },
        { label: "생존 인원", text: "상위 60명만 생존하여 2차 과제 진행" }
      ],
      videoSrc: VoteVideo,
      result: "1차 결과 보러가기",
      result2: "투표 하러가기"
    },
    { 
      id: 2, 
      displayId: "2", 
      title: "2차 팀 경연", 
      timelineBlocks: [
        {
          type: "info_grid",
          title: "과제 팀 구성",
          items: [
            { num: "01", img: step2img01, title: "곡 선택 및 팀 구성", desc: ["정해진 5곡 (총 10개 팀)", "랩 4곡, 보컬 6곡, 댄스 4곡", "60명이 6명씩 팀 구성", "2팀씩 1곡 경쟁"] },
            { num: "02", img: step2img02, title: "팀 배정 방식", desc: ["미션 및 게임으로 팀원과 곡 선택"] },
            { num: "03", img: step2img03, title: "리더와 센터 선정", desc: ["팀원들에게 어필하여 선정", "리더 또는 센터 뱃지 부여", "2주 연습 중 변경 가능", "심사위원 의견 반영"] },
            { num: "04", img: step2img04, title: "연습 과정", desc: ["2주간 연습 과정 녹화", "중간평가 진행", "팀워크 및 실력 향상", "방송 송출"] }
          ]
        },
        {
          type: "vote_battle",
          title: "무대 및 방청객 투표",
          backgroundImage: step2img_silhouette, // 실루엣이 있는 배경 이미지
          columns: [
            { icon: "user", title: "방청객 추첨", desc: ["응모로 500명 추첨", "현장 관람 기회 제공"] },
            { icon: "stage", title: "무대 진행 방식", desc: ["2팀씩 1조로 무대 공연", "각 연습생 개별 투표"] },
            { icon: "check", title: "방청객 투표", desc: ["두 팀 무대 비교 후 투표", "승리팀 결정"] },
            { icon: "plus", title: "가산점 부여", desc: ["승리팀 가산점 부여", "순위발표식 반영"] }
          ]
        },
        {
          type: "rank_reveal",
          title: "문자투표 및 순위발표",
          cards: [
            { num: "01", title: "투표 방식", desc: ["경연 사이트: 매일 투표 (1명당 7명)", "문자투표: 금요일 방송 중 (1명당 1명)", "방청객 투표와 시청자 투표 합산", "최종 순위 결정"] },
            { num: "02", title: "순위발표식 진행", desc: ["두번째 과제 무대 결과 반영", "합산된 투표로 순위 발표", "52~61등 연습생 방출 결정"] },
            { num: "03", title: "생존 인원", desc: ["총 50명의 연습생 생존", "하위 10명 탈락", "3차 과제 진출 확정", "경쟁 심화 단계 돌입"] }
          ]
        }
      ],
      sections: [], 
      result: "2차 결과 보러가기",
       result2: "투표 하러가기"
    },
    { 

      id: 3, 
      displayId: "3", 
      title: "3차 팀 경연", 
      step3Blocks: [
        {
          type: "step3_info_pills", // 첫번째 이미지 (가로 알약형)
          title: "과제 팀 구성",
          silImg: step3img01_sil, // 실루엣 배경
          items: [
            { label: "과제 구성", desc: "5개 대표 아이돌 그룹 및 소속사 곡, 총 10개 팀, 50명이 5명씩 구성, 2팀이 1곡 경쟁" },
            { label: "팀 선발 방식", desc: "상위 조회 10명이 게임 진행, 각자 팀원 1명 지정" },
            { label: "곡 선택", desc: "랜덤 미션 및 게임으로 곡 선택" },
            { label: "리더 및 센터", desc: "팀원 어필로 리더·센터 선정, 2주 연습 중 변경 가능" }
          ]
        },
        {
          type: "step3_vote_grid", // 두번째 이미지 (4분할)
          title: "무대 및 투표",
          cards: [
            { num: "01", img: step3img02_1, title: "무대 진행 방식", desc: ["응모로 방청객 500명 추첨", "2팀 1조로 무대 구성", "각 조별 순차 공연", "아이돌 곡 커버 무대"] },
            { num: "02", img: step3img02_2, title: "방청객 투표", desc: ["무대 종료 후 투표 진행", "각 연습생에게 개별 투표", "승리팀에 가산점 부여", "다득표 멤버 추가 가산점"] },
            { num: "03", img: step3img02_3, title: "투표 시스템", desc: ["경연 사이트 매일 투표 지속", "금요일 방송 중 문자투표", "1명당 1명 투표 가능", "시청자 참여 극대화"] },
            { num: "04", img: step3img02_4, title: "최종 합산", desc: ["방청객 투표 결과 집계", "시청자 온라인 투표 합산", "세번째 순위발표식 준비", "가산점 반영된 최종 순위"] }
          ]
        },
        {
          type: "step3_rank_path", // 세번째 이미지 (3단계 프로세스)
          title: "순위발표",
          items: [
            { icon: "rank", img: 그림04, title: "순위발표식", desc: ["세번째 과제 결과 발표", "방청객 투표 반영", "시청자 투표 합산", "최종 순위 1~50위 공개"] },
            { icon: "drop", img: 그림05, title: "방출 인원", desc: ["29~50등 연습생 방출", "총 22명 탈락"] },
            { icon: "mic", img: 그림06, title: "생존 현황", desc: ["28명 연습생 생존", "4차 컨셉평가 진출", "최종 경쟁 시작"] }
          ]
        }
      ],
      sections: [], // 기본 레이아웃용 sections는 비워둠
      result: "3차 결과 보러가기",
       result2: "투표 하러가기"
    },
    { 
      id: 4, displayId: "4", title: "4차 컨셉평가", 
      step4Blocks: [
        {
          type: "step4_grid",
          title: "과제 구성",
          items: [
            { icon: mic, title: "아티스트 공개", desc: ["프로듀서 아티스트 경력 및 프로필 소개", "4팀의 프로듀서 팀 공개"] },
            { icon: play, title: "과제 곡 공개", desc: ["현업 아티스트 및 작곡가의 4곡", "곡 데모 및 컨셉 공개"] },
            { icon: vote1, title: "첫번째 투표", desc: ["시청자 투표로 4팀 결정", "곡별 팀 구성 완료", "참가자 선호도 반영"] },
            { icon: vote2, title: "두번째 투표", desc: ["각 곡의 센터 결정", "포지션 배정 투표", "시청자 참여로 팀 완성"] }
          ]
        },
        {
          type: "step4_list",
          title: "무대 및 투표방식",
          pills: [
            { label: "방청객 투표", desc: "가장 좋았던 무대 1표, 가장 좋았던 멤버 1표, 총 2표 행사" },
            { label: "팀 순위 가산점", desc: "1~3위 팀 멤버들에게 순위별 가산점 부여, 협력 중요성 강조" },
            { label: "개인 가산점", desc: "1위 멤버에게 큰 가산점 부여, 최종 순위 상승 가능성" },
            { label: "4위 팀", desc: "4위 팀은 가산점 없음, 시청자 투표에만 의존" }
          ]
        },
        {
          type: "step4_rank",
          title: "순위발표",
          items: [
            { num: "01", img: step4_04_1, title: "투표 합산 방식", desc: ["방청객 투표와 시청자 투표를 합산하여 최종 순위 결정", "네번째 과제 무대의 가산점 포함"] },
            { num: "02", img: step4_04_2, title: "순위발표식 진행", desc: ["네번째 순위발표식 방송 송출", "1위부터 28위까지 순차적 발표", "17~28등 연습생 방출"] },
            { num: "03", img: step4_04_3, title: "생존 인원 확정", desc: ["최종 생존 인원 16명으로 확정", "상위 16명만 마지막 5차 과제 진행"] }
          ]
        }
      ],
      result: "4차 결과 보러가기",
      result2: "투표 하러가기"

    },
    { 
      id: 5, displayId: "5", title: "5차 파이널 무대", 
      step5Blocks: [
        {
          type: "step5_mv_grid",
          title: "5차 뮤직비디오 촬영",
          items: [
            { icon: mv_icon1, title: "모금", desc: ["4차 순위발표에서 생존 연습생", "개인마다 모금 진행"] },
            { icon: mv_icon2, title: "뮤직비디오 제작", desc: ["진행된 모금으로 MV 자체 제작", "금액별 소품 및 장소 제공"] },
            { icon: mv_icon3, title: "5차 경연곡 제작", desc: ["자체 작사/작곡 과정 및", "연습 과정 녹화 방송"] },
            { icon: mv_icon4, title: "제작 뮤직비디오 공개", desc: ["YouTube 및 프로그램 사이트 공개", "조회수 결과로 가산점 부여"] }
          ]
        },
        {
          type: "step5_final_stage",
          title: "5차 파이널 무대",
          items: [
            { num: "01", img: final_img1, title: "최종 팀 구성", desc: ["생존 14명은 7명씩 두 팀 구성", "팀별 자체 작곡 곡으로 무대"] },
            { num: "02", img: final_img2, title: "팀원 선택 방식", desc: ["4차 1·2등이 팀 센터", "두 센터가 번갈아 팀원 선택"] },
            { num: "03", img: final_img3, title: "자체 작곡 곡 무대", desc: ["팀 개성 담은 무대 연출", "마지막 퍼포먼스 무대"] },
            { num: "04", img: final_img4, title: "생방송 최종 투표", desc: ["최종 발표식은 생방송 송출", "온라인/문자투표 실시간 집계"] }
          ]
        }
      ],
      result: "최종 순위 확인",
      result2: "투표 결과 보기"
     },
    { id: 6, displayId: "⯌", title: "최종 데뷔 멤버 선정", sections: [], result: "커밍순" 

    }
  ];

  const currentTab = processData.find(d => d.id === activeTab) || processData[0];

  return (
    <div className="content">
      <div className="ps-background-image" style={{ '--bg-url': `url(${singerBg})` }}></div>

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

      <div className="ps-info-notice-box" key={activeTab}>
        <div className="process-detail-header">
          <span className="process-num">⯌</span>
          <h2 className="process-title">{currentTab.title}</h2>
        </div>

        {/* --- 조건부 레이아웃 렌더링 --- */}
        {activeTab === 1 ? (
          /* ID 1 전용 레이아웃 */
          <div className="ps-step1-special">
            <div className="ps-main-layout">
              <div className="ps-grid-area">
                {currentTab.gridCards?.map((card, i) => (
                  <div key={i} className="ps-grid-card">
                    <h3 className="ps-card-title">{card.title}</h3>
                    <ul className="ps-card-items">
                      {card.items.map((item, idx) => <li key={idx}>- {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="ps-list-area">
                {currentTab.listSteps?.map((step, i) => (
                  <div key={i} className="ps-pill-row">
                    <div className="ps-pill">{step.label}</div>
                    <p className="ps-pill-text">{step.text}</p>
                  </div>
                ))}
                <div className="ps-mini-video">
                  <video controls autoPlay muted loop playsInline src={currentTab.videoSrc} key={currentTab.videoSrc} />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 2 ? (



// -------------------------------------------------------------------------------------------------------------------


          /* ID 2 전용 롱폼 레이아웃 */
          <div className="ps-step2-longform">
            {currentTab.timelineBlocks?.map((block, index) => (
              <div key={index} className={`ps-block ps-block-${block.type}`}>
                <h3 className="ps-block-title">{block.title}</h3>

                {block.type === "info_grid" && (
                  <div className="ps-info-grid">
                    {block.items.map((item, i) => (
                      <div key={i} className="ps-grid-item">
                        <div className="ps-item-header">
                          <span className="ps-item-num">{item.num}</span>
                          {item.img && <img src={item.img} alt={item.title} className="ps-item-img" />}
                        </div>
                        <h4 className="ps-item-title">{item.title}</h4>
                        <ul className="ps-item-desc">
                          {item.desc.map((d, j) => <li key={j}>- {d}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === "vote_battle" && (
                  <div className="ps-vote-battle-container">
                    <div className="ps-vote-battle-bg" style={{ backgroundImage: `url(${block.backgroundImage})` }}>
                      <div className="ps-battle-columns">
                        {block.columns.map((col, i) => (
                          <div key={i} className="ps-battle-col">
                            <h4 className="ps-battle-title">{col.title}</h4>
                            <ul className="ps-battle-desc">
                              {col.desc.map((d, j) => <li key={j}>{d}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {block.type === "rank_reveal" && (
                  <div className="ps-rank-reveal">
                    {block.cards.map((card, i) => (
                      <div key={i} className="ps-rank-card">
                        <div className="ps-card-num-circle">{card.num}</div>
                        <h4 className="ps-rank-card-title">{card.title}</h4>
                        <ul className="ps-rank-card-desc">
                          {card.desc.map((d, j) => <li key={j}>- {d}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ): activeTab === 3 ? (


// -------------------------------------------------------------------------------------------------------------------


          /* ID 3 전용 전용 롱폼 레이아웃 (새로 추가) */
          <div className="ps-step3-longform">
            {currentTab.step3Blocks?.map((block, index) => (
              <div key={index} className={`ps3-block ps3-block-${block.type}`}>
                <h3 className="ps3-block-title">{block.title}</h3>

                {block.type === "step3_info_pills" && (
                  <div className="ps3-info-pills-wrapper">
                    <img src={block.silImg} alt="배경실루엣" className="ps3-sil-img" />
                    <div className="ps3-pill-list">
                      {block.items.map((item, i) => (
                        <div key={i} className="ps3-pill-item">
                          <span className="ps3-pill-label">{item.label}</span>
                          <p className="ps3-pill-desc">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === "step3_vote_grid" && (
                  <div className="ps3-vote-grid">
                    {block.cards.map((card, i) => (
                      <div key={i} className="ps3-grid-card">
                        <span className="ps3-card-num">{card.num}</span>
                        {card.img && <img src={card.img} alt={card.title} className="ps3-card-img" />}
                        <h4 className="ps3-card-title">{card.title}</h4>
                        <ul className="ps3-card-desc">
                          {card.desc.map((d, j) => <li key={j}>- {d}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === "step3_rank_path" && (
                  <div className="ps3-rank-path-wrapper">
                    {block.items.map((item, i) => (
                      <div key={i} className={`ps3-path-item item-${item.icon}`}>
                        
                        {/* 네온 박스 안에 이미지를 넣음 */}
                        <div className={`ps3-path-icon icon-${item.icon}`}>
                          {item.img && <img src={item.img} alt={item.title} className="ps3-path-inner-img" />}
                        </div>

                        <div className="ps3-path-content">
                          <h4 className="ps3-path-title">{item.title}</h4>
                          <ul className="ps3-path-desc">
                            {item.desc.map((d, j) => <li key={j}>- {d}</li>)}
                          </ul>
                        </div>
                        {i < block.items.length - 1 && <div className="ps3-path-arrow"></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) 

// -------------------------------------------------------------------------------------------------------------------
     // ... 렌더링 부분 (activeTab === 4 추가)
      : activeTab === 4 ? (
        <div className="ps-step4-longform">
          {currentTab.step4Blocks?.map((block, index) => (
            <div key={index} className={`ps4-block ps4-block-${block.type}`}>
              <h3 className="ps4-block-title">{block.title}</h3>

              {/* 1. 과제 구성 (그리드형: 아이콘이 제목 옆에 배치) */}
              {block.type === "step4_grid" && (
                <div className="ps4-grid-container">
                  {block.items.map((item, i) => (
                    <div key={i} className="ps4-grid-item">
                      
                      {/* 왼쪽: 텍스트 영역 (제목 + 설명) */}
                      <div className="ps4-text-section">
                        <h4 className="ps4-item-title">{item.title}</h4>
                        <ul className="ps4-item-desc">
                          {item.desc.map((d, j) => (
                            <li key={j}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      {/* 오른쪽: 아이콘 영역 (우측 끝 고정) */}
                      {item.icon && (
                        <div className="ps4-icon-section">
                          <img src={item.icon} alt={item.title} className="ps4-icon-img" />
                        </div>
                      )}
                      
                    </div>
                  ))}
                </div>
              )}


              {/* 2. 무대 및 투표방식 (알약형) */}
              {block.type === "step4_list" && (
                <div className="ps4-pill-container">
                  {block.pills.map((pill, i) => (
                    <div key={i} className="ps4-pill-row">
                      <div className="ps4-pill-label">{pill.label}</div>
                      <p className="ps4-pill-desc">{pill.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. 순위발표 (카드형) */}
              {block.type === "step4_rank" && (
                <div className="ps4-rank-wrapper">
                  {block.items.map((item, i) => (
                    <div key={i} className="ps4-rank-card">
                      <div className="ps4-card-top">
                        <span className="ps4-card-num">{item.num}</span>
                        <div className="ps4-img-box">
                          <img src={item.img} alt={item.title} />
                        </div>
                      </div>
                      <h4 className="ps4-rank-title">{item.title}</h4>
                      <ul className="ps4-rank-desc">
                        {item.desc.map((d, j) => <li key={j}>- {d}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) 
// -------------------------------------------------------------------------------------------------------------------
: activeTab === 5 ? (
  <div className="ps-step5-longform">
    {currentTab.step5Blocks?.map((block, index) => (
      <div key={index} className="ps5-block">
        {/* 소제목: 4차 스타일 적용 (밑줄 없음, 중앙 정렬) */}
        <h2 className="ps4-step-title">{block.title}</h2>

        {/* 5차 뮤직비디오 과제 구성 (그리드형: 4차와 동일한 구조) */}
        {block.type === "step5_mv_grid" && (
          /* 4차 스타일의 그리드 컨테이너 클래스 사용 */
          <div className="ps5-grid-wrapper">
            {block.items.map((item, i) => (
              /* 4차 스타일의 카드 클래스 사용 */
              <div key={i} className="ps5-grid-card">
                
                {/* 아이콘 위치: 우측 상단 끝 고정 (4차 구조) */}
                {item.icon && (
                  <div className="ps5-card-icon">
                    <img src={item.icon} alt={item.title} />
                  </div>
                )}

                {/* 왼쪽 텍스트 섹션 */}
                <div className="ps5-text-section">
                  <h4 className="ps5-item-title">{item.title}</h4>
                  <ul className="ps5item-list">
                    {item.desc.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                </div>
                
              </div>
            ))}
          </div>
        )}

        {/* 5차 파이널 무대 섹션 (제공된 구조 유지하되 스타일만 4차 톤으로) */}
        {block.type === "step5_final_stage" && (
          <div className="ps5-final-stage">
            {block.items.map((item, i) => (
              <div key={i} className="ps5-final-card">
                <span className="ps5-final-num">{item.num}</span>
                <div className="ps5-final-img-box">
                  <img src={item.img} alt={item.title} />
                </div>
                <h4 className="ps5-final-card-title">{item.title}</h4>
                <ul className="ps5-final-card-desc">
                  {item.desc.map((d, j) => <li key={j}>{d}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
) : (
// -------------------------------------------------------------------------------------------------------------------
          /* 기본 레이아웃 (ID 0, 3, 4, 5, 6) */
          <div className="ps-default-layout">
            {currentTab.videoSrc && (
              <div className="process-video-wrapper">
                <video controls autoPlay muted loop playsInline src={currentTab.videoSrc} key={currentTab.videoSrc} />
              </div>
            )}
            <div className="process-scroll-list">
              {currentTab.sections?.map((section, idx) => (
                <div key={idx} className="scroll-item">
                  <div className="scroll-label">{section.label}</div>
                  <div className="scroll-content">
                    {section.items?.map((item, i) => (
                      <p key={i} className={i === 0 ? "highlight-text" : "sub-text"}>{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 기존 하단 버튼 출력부 수정 */}
          {(currentTab.result || currentTab.result2) && (
            <div className="ps-result-container">
              {currentTab.result && (
                <div className="process-result">
                  <h4 className="result-text">{currentTab.result}</h4>
                </div>
              )}
              {currentTab.result2 && (
                <div className="process-result">
                  <h4 className="result-text">{currentTab.result2}</h4>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default Process;