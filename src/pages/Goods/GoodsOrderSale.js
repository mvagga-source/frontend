import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SaveBtn, MoveBtn } from "../../components/button/Button";
import { SaveInput } from "../../components/input/Input";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import styles from "./GoodsWrite.module.css"; // 기존 스타일 유지
// API 함수들은 실제 경로에 맞춰 수정 필요
import { getOrderDetailApi, updateDelivStatusApi, cancelOrderApi } from "./GoodsApi";

function GoodsOrderSale() {
    const navigate = useNavigate();
    const { gono } = useParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        fetchOrderDetail();
    }, [gono]);

    const fetchOrderDetail = () => {
        getOrderDetailApi(gono)
            .then(res => {
                setOrder(res.data.data);
                setNewStatus(res.data.data.delivStatus);
                setLoading(false);
            })
            .catch(err => {
                alert("주문 내역을 불러오는데 실패했습니다.");
                navigate(-1);
            });
    };

    // 1. 운송장 번호를 담을 상태 추가
    const [trackingNo, setTrackingNo] = useState("");
    
    // 송장 정보 입력 핸들러 > 배송 준비중으로 변경 (주문 승인)
    const handleStartShipping = () => {
        if (!trackingNo) {
            alert("운송장 번호를 입력해주세요.");
            return;
        }
        //택배사 운송장 유효성체크 넣기

        if (window.confirm(`운송장 [${trackingNo}]으로 배송을 시작하시겠습니까?`)) {
            updateDelivStatusApi(gono, { 
                delivStatus: "배송중", 
                trackingNo: trackingNo,
            }).then(res => {
                alert("배송 처리가 완료되었습니다.");
                fetchOrderDetail();
            });
        }
    };

    // 1. 배송 준비중으로 변경 (주문 승인)
    const handlePrepareOrder = () => {
        if (window.confirm("주문을 확인하고 배송 준비 상태로 변경하시겠습니까?\n이후에는 구매자가 직접 취소할 수 없습니다.")) {
            updateDelivStatusApi(gono, { delivStatus: "배송준비중" }).then(res => {
                alert("배송 준비 상태로 변경되었습니다. 이제 송장을 등록해 주세요.");
                fetchOrderDetail();
            });
        }
    };

    // 주문 강제 취소 (관리자/판매자 권한)
    const handleOrderCancel = () => {
        const reason = window.prompt("취소 사유를 입력해주세요 (예: 재고 부족, 잔고 부족 등)");
        if (reason) {
            cancelOrderApi(gono, { reason }).then(res => {
                alert("주문이 취소 처리되었습니다.");
                fetchOrderDetail();
            });
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <>
            <div className={styles.header}>
                <h2 className={styles.title}>주문 상세 관리 (판매자용)</h2>
                <div className={styles.infoBox}>
                    <p className={styles.infoTitle}>📌 주문 및 정산 정보 안내</p>
                    <ul className={styles.infoList}>
                        <li>현재 주문의 결제 상태와 배송 정보를 확인하고 수정할 수 있습니다.</li>
                        <li><strong>정산 상태:</strong> {order.settleYn === 'y' ? "정산 완료" : "정산 대기중"}</li>
                        <li>배송 완료 후 일정 기간이 지나면 정산 프로세스가 진행됩니다.</li>
                    </ul>
                </div>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.container}>
                    {/* 1. 상품 및 결제 정보 섹션 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>주문 정보</label>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p style={{ color: '#fff', margin: '5px 0' }}>주문번호: <span style={{ color: '#00f2ff' }}>{order.orderId}</span></p>
                            <p style={{ color: '#fff', margin: '5px 0' }}>상품명: {order.goods?.gname} ({order.cnt}개)</p>
                            <p style={{ color: '#fff', margin: '5px 0' }}>결제금액: {order.totalPrice?.toLocaleString()}원 ({order.paymentMethod})</p>
                            <p style={{ color: '#aaa', fontSize: '12px' }}>결제일시: {new Date(order.crdt).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* 2. 배송지 정보 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>수령인 정보</label>
                        <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.8' }}>
                            <p>성함: {order.receiverName}</p>
                            <p>연락처: {order.receiverPhone}</p>
                            <p>주소: {order.address} {order.detailAddress}</p>
                            <p>요청사항: <span style={{ color: '#00f2ff' }}>{order.orderRequest || "없음"}</span></p>
                        </div>
                    </div>

                    <hr style={{ border: '0.5px solid rgba(0, 242, 255, 0.1)', margin: '30px 0' }} />

                    <div className={styles.formGroup}>
                        <label className={styles.label}>배송 관리</label>
                        {/* [단계 1] 배송대기: 주문 확인 버튼만 */}
                        {order.delivStatus === "배송대기" && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <SaveBtn onClick={handlePrepareOrder} style={{ flex: 1 }}>주문 확인 (발주)</SaveBtn>
                            </div>
                        )}

                        {/* [단계 2] 배송준비중: SaveInput으로 송장 입력받기 */}
                        {order.delivStatus === "배송준비중" && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <SaveInput 
                                            type="text"
                                            style={{ width: '100%' }}
                                            placeholder="운송장 번호를 입력하세요"
                                            value={trackingNo}
                                            onChange={(e) => setTrackingNo(e.target.value)}
                                        />
                                    </div>
                                    <SaveBtn onClick={handleStartShipping} style={{ width: '120px' }}>배송 시작</SaveBtn>
                                </div>
                            </div>
                        )}

                        {/* [단계 3] 배송중 이후: 정보 표시 */}
                        {["배송중", "배송완료", "구매확정"].includes(order.delivStatus) && (
                            <div className={styles.statusDisplayBox}>
                                <p>현재 상태: <strong>{order.delivStatus}</strong></p>
                                <p>운송장 번호: {order.trackingNo}</p>
                            </div>
                        )}
                    </div>
                    {/* 3. 취소 정보 표시 (추가된 부분) */}
                    {order.status === "CANCEL" && (
                        <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                            <div style={{ 
                                padding: '15px', 
                                backgroundColor: 'rgba(255, 77, 77, 0.1)', 
                                border: '1px solid #ff4d4d', 
                                borderRadius: '8px' 
                            }}>
                                <p style={{ color: '#ff4d4d', fontWeight: 'bold', marginBottom: '5px' }}>🚨 취소된 주문입니다</p>
                                <p style={{ color: '#fff', fontSize: '14px' }}>
                                    취소 사유: <span style={{ color: '#ff4d4d' }}>{order.cancelReason || "사유 미입력"}</span>
                                </p>
                                <p style={{ color: '#aaa', fontSize: '12px' }}>
                                    취소 일시: {new Date(order.cancelDate).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 4. 정산 상태 및 관리 버튼 */}
                    <div className={styles.formGroup} style={{ marginTop: '40px' }}>
                        <div style={{ 
                            padding: '20px', backgroundColor: 'rgba(0,0,0,0.2)', 
                            borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)' 
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ color: '#aaa' }}>현재 정산 상태: </span>
                                    <span style={{ 
                                        color: order.settleYn === 'y' ? '#00ff00' : '#ffcc00', 
                                        fontWeight: '700' 
                                    }}>
                                        {order.settleYn === 'y' ? "정산 완료" : "미정산"}
                                    </span>
                                </div>
                                {/* 배송 시작 전에는 취소 버튼 항상 노출 */}
                                {["배송대기", "배송준비중"].includes(order.delivStatus) && (
                                order.status !== 'CANCEL' && (
                                    <button 
                                        onClick={handleOrderCancel}
                                        style={{ 
                                            padding: '8px 15px', background: 'transparent', 
                                            border: '1px solid #ff4d4d', color: '#ff4d4d', 
                                            borderRadius: '5px', cursor: 'pointer' 
                                        }}
                                    >
                                        주문 취소 처리
                                    </button>
                                )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.btnWrapper}>
                        <MoveBtn type="button" onClick={() => navigate("/MyMain/MySaleRecord")}>목록으로</MoveBtn>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GoodsOrderSale;