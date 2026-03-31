import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./PaymentResult.module.css";
import { PaymentResultSuccessApi, PaymentResultCancelApi } from "./PaymentResultApi";

const PaymentResult = ({ type }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(type === "success");
    const [error, setError] = useState(false);

    const pg_token = searchParams.get("pg_token");
    const tid = sessionStorage.getItem("tid");

    useEffect(() => {
        // 성공 시 승인 요청
        if (type === "success" && pg_token && tid) {
            PaymentResultSuccessApi({ pg_token, tid })
                .then((res) => {
                    if (res.data?.success) {
                        //결제 성공처리
                        setError(false);
                    } else {
                        setError(true);
                        PaymentResultCancelApi({ tid, status: "FAILED" });
                    }
                })
                .catch((err) => {
                    setError(true);
                    PaymentResultCancelApi({ tid, status: "FAILED" });
                })
                .finally(() => {
                    setLoading(false);
                    sessionStorage.removeItem("tid");
                });
        }
        // 취소 또는 실패 시 서버 상태 업데이트
        else if ((type === "cancel" || type === "fail") && tid) {
            const status = type === "cancel" ? "CANCEL" : "FAILED";
            PaymentResultCancelApi({ tid, status })
                .then((res) => {
                    if (res.data?.success) {
                        //결제실패처리
                    }
                }).finally(() => {
                    setLoading(false);
                    setError(true);
                    sessionStorage.removeItem("tid");
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
            btnAction: () => navigate("/MyMain/MyPurchase", { replace: true }),
            isError: false
        },
        fail: {
            icon: <span className={`${styles.icon} ${styles.errorIcon}`}>✕</span>,
            title: "결제 실패",
            text: "결제 과정 중 오류가 발생했습니다. 다시 시도해 주세요.",
            btnText: "이전화면으로 돌아가기",
            btnAction: () => {
                // 히스토리가 있으면 뒤로가기, 없으면 안전하게 홈으로 이동
                if (window.history.length > 1) {
                    navigate(-1);
                } else {
                    navigate("/");
                }
            },
            isError: true
        },
        cancel: {
            icon: <span className={`${styles.icon} ${styles.warningIcon}`}>!</span>,
            title: "결제 취소",
            text: "결제가 취소되었습니다. 주문을 계속하시려면 다시 시도해주세요.",
            btnText: "이전화면으로 돌아가기",
            btnAction: () => {
                // 히스토리가 있으면 뒤로가기, 없으면 안전하게 홈으로 이동
                if (window.history.length > 1) {
                    navigate(-1);
                } else {
                    navigate("/");
                }
            },
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
                {/* 메인 버튼: 이전으로 돌아가기 */}
                <button 
                    className={`${styles.button} ${current.isError ? styles.secondaryBtn : styles.primaryBtn}`} 
                    onClick={current.btnAction}
                >
                    {current.btnText}
                </button>
                {/* 보조 버튼: 홈으로 (실패/취소 시에만 노출하거나 공통 노출) */}
                {(type === "fail" || type === "cancel") && (
                    <button 
                        className={`${styles.button} ${styles.secondaryBtn}`} 
                        onClick={() => navigate("/")}
                    >
                        홈으로 이동
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;