import React, { useState } from "react";
import styles from "./DeliveryModal.module.css";
import { SaveInput } from "../../../components/input/Input";
import { SearchBtn } from "../../../components/button/Button";
import DaumAddrSearchModal from "../../../components/DaumAddrModal/DaumAddrModal";

const DeliveryModal = ({ isOpen, onClose, totalPrice }) => {
    //다음 주소찾기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState(""); // 주소 상태 관리

    if (!isOpen) return null;

    // 주소 검색 버튼을 눌렀을 때 DaumAddrSearchModal을 여는 함수
    const handleAddressSearch = () => {
        setIsModalOpen(true);
    };

    // 주소 선택이 완료되었을 때 실행되는 함수
    const handleAddressComplete = (data) => {
        // data 구조는 DaumAddrSearchModal에서 어떻게 넘겨주느냐에 따라 다를 수 있습니다.
        // 보통 data.address 또는 data 가 주소 문자열일 것입니다.
        setAddress(data.address || data); 
        setIsModalOpen(false); // 주소 선택 후 모달 닫기
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("결제 페이지로 이동합니다.");
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={styles.modalContent}>
            <h2 className={styles.title}>배송 정보 입력</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label>받는 사람</label>
                <SaveInput placeholder="이름을 입력하세요" required />
            </div>
            <div className={styles.inputGroup}>
                <label>연락처</label>
                <SaveInput placeholder="010-0000-0000" required />
            </div>
            <div className={styles.inputGroup}>
                <label>배송 주소</label>
                <div className={styles.addressRow}>
                <SaveInput 
                    placeholder="주소를 검색하세요" 
                    value={address} 
                    readOnly 
                    className={styles.flex1} 
                />
                <SearchBtn type="button" onClick={handleAddressSearch}>주소 검색</SearchBtn>
                </div>
                <SaveInput placeholder="상세 주소를 입력하세요" required />
            </div>
            <div className={styles.inputGroup}>
                <label>배송 요청사항</label>
                <SaveInput placeholder="예: 문 앞에 놓아주세요" />
            </div>
            <div className={styles.paymentBox}>
                <p>최종 결제 금액 : <span>{totalPrice.toLocaleString()}원</span></p>
            </div>
            <div className={styles.actionButtons}>
                <button type="submit" className={styles.completeBtn}>주문완료</button>
                <button type="button" className={styles.closeBtn} onClick={onClose}>취소</button>
            </div>
            </form>
            <DaumAddrSearchModal
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onComplete={handleAddressComplete} 
            />
        </div>
        </div>
    );
};

export default DeliveryModal;