import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import styles from "./PaymentResult.module.css";

const PaymentResult = ({ type }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(type === "success");
    const [error, setError] = useState(false);

    const pg_token = searchParams.get("pg_token");
    const tid = sessionStorage.getItem("tid");

    useEffect(() => {
        // 성공 타입일 때만 서버 승인 로직 실행
        if (type === "success" && pg_token && tid) {
            axiosInstance.post(`/api/goodsOrders/approve?pg_token=${pg_token}&tid=${tid}`)
                .then(() => {
                    setLoading(false);
                    // 성공 시 5초 후 이동 혹은 사용자 클릭 대기
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                    setError(true);
                });
        }
    }, [type, pg_token, tid]);

    // 1. 로딩 중 (승인 처리 중)
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.spinner}></div>
                    <h2 className={styles.title}>결제 승인 중</h2>
                    <p className={styles.text}>안전한 결제를 위해 최종 승인 단계 진행 중입니다.</p>
                </div>
            </div>
        );
    }

    // 2. 결과 데이터 설정
    const config = {
        success: {
            icon: <span className={`${styles.icon} ${styles.successIcon}`}>✓</span>,
            title: "결제 완료!",
            text: "주문이 정상적으로 처리되었습니다. 이용해 주셔서 감사합니다.",
            btnText: "주문 내역 확인",
            btnAction: () => navigate("/mypage/orders"),
            isError: false
        },
        fail: {
            icon: <span className={`${styles.icon} ${styles.errorIcon}`}>✕</span>,
            title: "결제 실패",
            text: "결제 과정 중 오류가 발생했습니다. 다시 시도해 주세요.",
            btnText: "장바구니로 돌아가기",
            btnAction: () => navigate("/cart"),
            isError: true
        },
        cancel: {
            icon: <span className={`${styles.icon} ${styles.warningIcon}`}>!</span>,
            title: "결제 취소",
            text: "결제가 취소되었습니다. 주문을 계속하시려면 다시 시도해주세요.",
            btnText: "홈으로 이동",
            btnAction: () => navigate("/"),
            isError: false
        }
    };

    // 승인 요청 실패 시 fail 화면으로 강제 전환
    const current = (type === "success" && error) ? config.fail : config[type];

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {current.icon}
                <h2 className={styles.title}>{current.title}</h2>
                <p className={styles.text}>{current.text}</p>
                <button 
                    className={`${styles.button} ${current.isError ? styles.secondaryBtn : styles.primaryBtn}`} 
                    onClick={current.btnAction}
                >
                    {current.btnText}
                </button>
            </div>
        </div>
    );
};

export default PaymentResult;