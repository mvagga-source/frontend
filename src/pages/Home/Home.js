import React, { useEffect, useState } from "react";
import "./Hero.css";
import logo from "../../assets/logo/23.png";
import singer from "../../assets/images/singer_bg.png";

const Home = () => {
  const targetDate = new Date("2026-04-01T00:00:00");

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, mins: 0, secs: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="hero">

        <div className="overlay" />

        <div className="content">

          <div className="logoWrap">
            <img src={logo} alt="logo" className="logo" />
          </div>

          <div className="watermark">ACTION101</div>

          <h3 className="subTitle">NEXT IDOL, YOUR VOTE</h3>

          <h1 className="title">
            디렉터 여러분, <br/>당신의 선택이 <span>아이돌</span>을 만듭니다
          </h1>

          <p className="desc">
            실시간 투표 · 인기 랭킹 · 오디션 진행 <br />
            지금 바로 스타를 선택하세요
          </p>

          <p className="deadline">투표 마감까지 남은 시간</p>

          <div className="timer">
            {Object.entries(timeLeft).map(([key, value]) => (
              <div key={key} className="timeBox">
                <span className="num">{String(value).padStart(2, "0")}</span>
                <span className="label">{key.toUpperCase()}</span>
              </div>
            ))}
          </div>

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