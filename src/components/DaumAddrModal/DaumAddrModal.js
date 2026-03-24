import React from "react";
import DaumPostcode from "react-daum-postcode";
import styles from "./DaumAddrModal.module.css";

const DaumAddrSearchModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const themeObj = {
    // 이미지의 가장 어두운 배경색 (#101C2D)
    bgColor: "#101C2D", 
    searchBgColor: "#101C2D",
    contentBgColor: "#101C2D",
    pageBgColor: "#101C2D",

    // 텍스트 색상
    textColor: "#E8F4F8",       // 기본 흰색 글자
    queryTextColor: "#FFFFFF",  // 검색창 글자
    
    // 포인트 컬러 (이미지의 1등 노란색 느낌 적용)
    postcodeTextColor: "#FACC15", 
    emphTextColor: "#00F2FF",    // 강조색은 네온 블루
    outlineColor: "#1E324A"      // 리스트 구분선 (이미지보다 살짝 밝은 네이비)
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>주소 검색</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.postcodeWrapper}>
          <DaumPostcode 
            onComplete={onComplete} 
            style={{ height: "100%", width: "100%" }}
            autoResize={true}
            theme={themeObj}
          />
        </div>
      </div>
    </div>
  );
};

export default DaumAddrSearchModal;