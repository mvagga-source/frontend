import React from "react";
import ReactDOM from "react-dom"; // 1. 포털 사용을 위해 임포트 필수
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import styles from "./NoticePopup.module.css";

const NoticePopup = ({ startIndex, notices, onClose }) => {
  // 데이터가 없으면 아무것도 렌더링하지 않음
  if (!notices || notices.length === 0) return null;

  // 2. 렌더링할 JSX를 변수에 담습니다.
  const popupContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          initialSlide={startIndex} 
          className={styles.mySwiper}
        >
          {notices.map((n) => (
            <SwiperSlide key={n.nno}>
              <div className={styles.slideContent}>
                <div className={styles.imagePlaceholder}>
                  <div className={styles.textLogo}>ACTION101 공지사항</div>
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
          <button onClick={onClose} className={`${styles.footerBtn} ${styles.close}`}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );

  // 3. createPortal을 사용하여 DOM의 가장 바깥쪽(body)에 렌더링합니다.
  return ReactDOM.createPortal(popupContent, document.body);
};

export default NoticePopup;