import React, { useState, useRef } from "react";
import styles from "./DeliveryModal.module.css";
import { SaveInput } from "../../../components/input/Input";
import { SearchBtn } from "../../../components/button/Button";
import DaumAddrSearchModal from "../../../components/DaumAddrModal/DaumAddrModal";
import { GoodsOrderApi } from "../GoodsApi";

const DeliveryModal = ({ isOpen, onClose, totalPrice, goods, count }) => {
    //다음 주소찾기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState(""); // 주소 상태 관리
    const formRef = useRef();

    if (!isOpen) return null;

    // 주소 검색 버튼을 눌렀을 때 DaumAddrSearchModal을 여는 함수
    const handleAddressSearch = () => {
        setIsModalOpen(true);
    };

    // 주소 선택이 완료되었을 때 실행되는 함수
    const handleAddressComplete = (data) => {
        setAddress(data.address || data); 
        setIsModalOpen(false); // 주소 선택 후 모달 닫기
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        // 서버의 GoodsOrdersDto 구조와 맞춤
        const orderRequest = {
            goods: goods, // 예시
            totalPrice: totalPrice,
            cnt: count,
            receiverName: formData.get("receiverName"),
            receiverPhone: formData.get("receiverPhone"),
            address: address, // Daum 주소 검색 결과
            detailAddress: formData.get("detailAddress"),
            orderRequest: formData.get("orderRequest"),
            paymentMethod: "KAKAO_PAY" // 결제 수단 추가
        };
        if(window.confirm("상품을 구매하시겠습니까?")) {
            alert("결제 페이지로 이동합니다.");
            GoodsOrderApi(orderRequest).then((res) => {
                if (res.data.success) {
                    if (res.data.next_redirect_pc_url) {
                        // 카카오 결제 시 세션 관리가 필요할 수 있으므로 tid를 세션스토리지에 잠시 저장
                        sessionStorage.setItem("tid", res.data.tid);
                        
                        // 결제창으로 이동
                        window.location.href = res.data.next_redirect_pc_url;
                        onClose();
                    }
                }
            });
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modalContent}>
                <h2 className={styles.title}>배송 정보 입력</h2>
                <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>받는 사람</label>
                    <SaveInput name="receiverName" placeholder="이름을 입력하세요" required />
                </div>
                <div className={styles.inputGroup}>
                    <label>연락처</label>
                    <SaveInput name="receiverPhone" placeholder="010-0000-0000" required />
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
                    <SaveInput name="detailAddress" placeholder="상세 주소를 입력하세요" required />
                </div>
                <div className={styles.inputGroup}>
                    <label>배송 요청사항</label>
                    <SaveInput name="orderRequest" placeholder="예: 문 앞에 놓아주세요" />
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