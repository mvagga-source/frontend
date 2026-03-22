import React from "react";
import DaumPostcode from "react-daum-postcode";
import styles from "./DaumAddrModal.module.css";

const DaumAddrSearchModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

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
            style={{ height: "450px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default DaumAddrSearchModal;