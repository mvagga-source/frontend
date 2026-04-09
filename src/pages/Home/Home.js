import React, { useEffect, useState } from "react";
import "./Hero.css";
import logo from "../../assets/logo/23.png";
import singer from "../../assets/images/singer_bg.png";
import { getAllAuditionListApi } from "../../api/auditionApi";

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
    <>
      <div className="hero">

        <div className="overlay" />

        <div className="content">

          {/* <div className="logoWrap">
            <img src={logo} alt="logo" className="logo" />
          </div> */}

          <div className="watermark">ACTION101</div>

          <h3 className="subTitle">NEXT IDOL, YOUR VOTE</h3>

          <h1 className="title">
            디렉터 여러분, <br/>당신의 선택이 <span>아이돌</span>을 만듭니다
          </h1>

          <p className="desc">
            실시간 투표 · 인기 랭킹 · 오디션 진행 <br />
            지금 바로 스타를 선택하세요
          </p>

          <p className="deadline">
            {ongoingTitle ? `${ongoingTitle} 투표 마감까지 남은 시간` : "투표 마감까지 남은 시간"}
          </p>

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

          <div className="buttons">
            <button className="primary">지금 투표하기</button>
            <button className="secondary">일정 보기</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;