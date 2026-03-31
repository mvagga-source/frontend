import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { getMainListApi } from "../SidebarNoticeApi";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./NoticePopup.module.css";

const NoticePopup = ({ startIndex = null, onClose }) => {
  const [notices, setNotices] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    // 공지 데이터 가져오기
    const loadNotices = async () => {
      try {
        const response = await getMainListApi();
        const list = response.data.list || response.data.data?.list;
        
        if (list && list.length > 0) {
          setNotices(list);

          // startIndex가 넘어오면 사용자가 클릭해서 연 것임
          if (startIndex !== null) {
            setIsVisible(true);
          } else {
            // startIndex가 없으면 자동 팝업 로직 (오늘 하루 보지 않기 체크)
            const hideUntil = localStorage.getItem("hideNoticePopup");
            if (!hideUntil || new Date().getTime() > hideUntil) {
              setIsVisible(true);
            }
          }
        }
      } catch (error) {
        console.error("공지 로딩 실패:", error);
      }
    };

    loadNotices();
  }, [startIndex]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const closeForDay = () => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("hideNoticePopup", expiry);
    handleClose();
  };

  if (!isVisible || notices.length === 0) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          // 클릭한 번호(startIndex)부터 시작하게 설정
          initialSlide={startIndex || 0} 
          autoplay={startIndex !== null ? false : { delay: 5000 }} // 직접 열었을 땐 자동재생 끄기
          className={styles.mySwiper}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {notices.map((n) => (
            <SwiperSlide key={n.nno}>
              <div className={styles.slideContent}>
                <div className={styles.imagePlaceholder}>
                  {n.nfile ? (
                    <img src={`/upload/${n.nfile}`} alt="공지" />
                  ) : (
                    <div className={styles.textLogo}>ACTION NOTICE</div>
                  )}
                </div>
                <div className={styles.textSection}>
                  <h3 className={styles.title}>{n.ntitle}</h3>
                  <div className={styles.scrollContent}>
                    <p className={styles.content}>{n.ncontent}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.footer}>
          {startIndex === null && (
            <button onClick={closeForDay} className={styles.footerBtn}>오늘 하루 보지 않기</button>
          )}
          <button onClick={handleClose} className={`${styles.footerBtn} ${styles.close}`}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;