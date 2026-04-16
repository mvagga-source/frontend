import React from "react";
import styles from "./SupportModal.module.css";

export default function SupportPaymentModal({ isOpen, onClose, data, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>후원 정보 입력</h3>
        
        <div className={styles.infoRow}>
          <span>대상 연습생:</span> <strong>{data.idolName}</strong>
        </div>
        
        <div className={styles.infoRow}>
          <span>후원자 닉네임:</span> <strong>{data.nickname}</strong>
        </div>

        {/* 금액 입력 칸을 여기로 이동 */}
        <div className={styles.infoRow}>
          <span>후원 금액:</span>
          <input 
            type="number" 
            value={data.amount} 
            onChange={(e) => data.setAmount(e.target.value)} 
            placeholder="금액(원) 입력"
          />
        </div>

        <div className={styles.infoRow}>
          <span>입금자 성함:</span>
          <input 
            type="text" 
            value={data.realName} 
            onChange={(e) => data.setRealName(e.target.value)} 
            placeholder="실명을 입력하세요"
          />
        </div>
        
        <p className={styles.notice}>
          * 최소 후원 금액은 100원입니다.<br/>
          * 입력하신 정보로 입금 확인이 진행됩니다.
        </p>
        
        <div className={styles.btnGroup}>
          <button onClick={onClose} className={styles.cancelBtn}>취소</button>
          <button onClick={onConfirm} className={styles.confirmBtn}>카카오페이 결제</button>
        </div>
      </div>
    </div>
  );
}