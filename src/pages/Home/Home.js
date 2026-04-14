import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { faHeadset, faUserCheck, faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllAuditionListApi } from "../../api/auditionApi";

import "./Home.css";
import "../../assets/images/bg_02.jpg";

const Home = () => {

  const [ongoingTitle, setOngoingTitle] = useState(null); // ongoing 회차 제목
  const [targetDate, setTargetDate] = useState(null);     // 투표 마감일 (Date 객체)
  const [timeLeft, setTimeLeft] = useState(null);
 
  // endDate 배열 [y, m, d] or 문자열 → Date 객체 변환 (endDate 당일 자정 기준)
  const parseEndDate = (endDate) => {
    if (!endDate) return null;
    if (Array.isArray(endDate)) {
      const [y, m, d] = endDate;
      return new Date(y, m - 1, d, 23, 59, 59); // 마감일 23:59:59
    }
    const str = String(endDate); // "2026-02-18"
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d, 23, 59, 59);
  };
 
  const getTimeLeft = (target) => {
    const diff = target - new Date();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days:  Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins:  Math.floor((diff / (1000 * 60)) % 60),
      secs:  Math.floor((diff / 1000) % 60),
    };
  };
 
  // ongoing 회차 endDate 가져오기
  useEffect(() => {

    getAllAuditionListApi()
      .then((res) => {
        const ongoing = res.data.find((a) => a.status === "ongoing");
        if (ongoing) {
          const target = parseEndDate(ongoing.endDate);
          setOngoingTitle(ongoing.title);
          setTargetDate(target);
          setTimeLeft(getTimeLeft(target));
        }
      })
      .catch((err) => console.error("타이머 데이터 로드 실패:", err));
  }, []);
 
  // 1초마다 타이머 갱신
  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="hm-content">

      <div className="hm-section-wrap">

        {/* 제목 */}
        <div className="hm-content--title">
          <strong>"디렉터 여러분"</strong> 당신의 선택이 아이돌을 만듭니다.
        </div>

        {/* <div className="hm-sidebar-divider"></div> */}

        <div className="hm-section-outline">        
          <div className="hm-section">

            {/* left */}
            <div className="hm-section--left">
              {/* 투표 */}
              <div className="hm-section--header">
                <FontAwesomeIcon icon={faUserCheck} /> 오디션 투표
              </div>
              <div className="hm-insidebar-divider"></div>
              <div className="hm-section--body">
                실시간 투표와 인기 랭킹으로<br></br>
                당신의 스타를 직접 선택하세요
              </div>

            </div>

            {/* right */}
            <div className="hm-section--right">

              <div className="hm-section--nav">
                <div className="deadline-wrap">
                  <span className="deadline">
                    {ongoingTitle}
                  </span>
                  <span className="deadline-etc">투표 종료까지 남은 시간</span>
                </div>

                {timeLeft ? (
                  <div className="timer">
                    {Object.entries(timeLeft).map(([key, value]) => (
                      <div key={key} className="timeBox">
                        <span className="num">{String(value).padStart(2, "0")}</span>
                        <span className="label">{key.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="timer">
                    <p className="timerEmpty">현재 진행 중인 투표가 없습니다</p>
                  </div>
                )}

                <NavLink to="/Audition/vote" className="hm-btn__highlight">
                  지금 투표하기
                </NavLink>
              </div>

            </div>
          </div>
        </div>

        {/* <div className="hm-sidebar-divider"></div> */}

        <div className="hm-section">

            {/* left */}
            <div className="hm-section--left">
              {/* 진행 */}
              <div className="hm-section--header">
                <FontAwesomeIcon icon={faHeadset} /> 오디션 진행
              </div>
              <div className="hm-insidebar-divider"></div>
              <div className="hm-section--body">
                평가부터 최종 데뷔까지 이어지는<br></br>
                성장 서바이벌<br></br>
              </div>
            </div>

            {/* right */}
            <div className="hm-section--right">
              <div className="hm-section--nav">
                <span>단계별 평가 ❯ 팀 미션  ❯<br></br> 콘셉트 평가 ❯ 파이널 ❯ 최종 데뷔</span>
                <div className="hm-btn-wrap">
                  <NavLink to="/Process" className="hm-btn">
                    프로그램 소개
                  </NavLink>
                  <NavLink to="/Event" className="hm-btn">
                    일정 보기
                  </NavLink>
                </div>
              </div>
            </div>

        </div>        

      </div>

    </div>
  );
};

export default Home;