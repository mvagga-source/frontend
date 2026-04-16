import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SaveBtn, MoveBtn } from "../../components/button/Button";
import { NumberInput, SaveInput } from "../../components/input/Input";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import styles from "./GoodsWrite.module.css";
// API 함수들은 실제 경로에 맞게 수정 (updateReturnStatusApi 등 추가 필요)
import { getReturnDetailByRnoApi, updateReturnStatusApi } from "./GoodsApi";

function GoodsSaleReturn() {
    const navigate = useNavigate();
    const { rno } = useParams(); // 반품 고유 번호 기반
    const [loading, setLoading] = useState(true);
    const [returnDetail, setReturnDetail] = useState(null);

    // 판매자가 수정/관리할 상태값
    const [status, setStatus] = useState("");
    const [gdelPrice, setGdelPrice] = useState(0);
    const [gdelType, setGdelType] = useState("");
    const [rejectReason, setRejectReason] = useState(""); // 거절 시 사유 입력용

    useEffect(() => {
        if (!rno) return;
        getReturnDetailByRnoApi(rno)
            .then(res => {
                const data = res.data.data;
                setReturnDetail(data);
                setStatus(data.returnStatus);
                setGdelPrice(data.gdelPrice || 0);
                setGdelType(data.gdelType || "");
                setLoading(false);
            })
            .catch(err => {
                alert("반품 정보를 불러오지 못했습니다.");
                navigate(-1);
            });
    }, [rno, navigate]);

    // 상태 변경 핸들러 (승인, 완료, 거부 등)
    const handleStatusUpdate = (nextStatus) => {
        let msg = `상태를 [${nextStatus}]로 변경하시겠습니까?`;
        if (nextStatus === "거부" && !rejectReason) {
            alert("거부 사유를 입력해주세요.");
            return;
        }

        if (window.confirm(msg)) {
            const updateData = {
                rno: rno,
                returnStatus: nextStatus,
                gdelPrice: gdelPrice,
                gdelType: gdelType,
                returnSaleReasonDetail: nextStatus === "거부"?`${rejectReason}`:""
            };

            updateReturnStatusApi(updateData).then(res => {
                if (res.data.success) {
                    alert(`[${nextStatus}] 처리가 완료되었습니다.`);
                    window.location.reload(); // 최신 데이터 갱신
                }
            });
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <>
            <div className={styles.header}>
                <h2 className={styles.title}>반품/교환 관리 (판매자용)</h2>
                <div className={styles.infoBox}>
                    <p className={styles.infoTitle}>📌 판매자 가이드</p>
                    <ul className={styles.infoList}>
                        <li>구매자가 신청한 사유와 상세 내용을 확인 후 처리를 진행해 주세요.</li>
                        <li><strong>회수중:</strong> 반품을 승인하고 택배사에 회수를 요청한 상태입니다.</li>
                        <li><strong>완료:</strong> 상품 수령 및 검수가 끝나 환불/교환 처리를 확정하는 단계입니다.</li>
                    </ul>
                </div>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.container}>
                    {/* 1. 신청 정보 (수정 불가) */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>주문 및 신청 정보</label>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#fff' }}>
                            <p>주문번호: <span style={{ color: '#00f2ff' }}>{returnDetail.order?.orderId}</span></p>
                            <p>신청종류: <strong>{returnDetail.returnType}</strong> ({returnDetail.returnStatus})</p>
                            <p>상품명: {returnDetail.order?.goods?.gname} ({returnDetail.returnCnt}개)</p>
                            <p>신청일시: {new Date(returnDetail.crdt).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* 소비자 연락처 및 수거지 정보 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>🚛 수거지(회수) 정보</label>
                        <div style={{ padding: '15px', background: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.2)', borderRadius: '8px', color: '#fff' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                                <span style={{ color: '#aaa' }}>수거 성함</span>
                                <span>{returnDetail.pickupName}</span>
                                
                                <span style={{ color: '#aaa' }}>수거 연락처</span>
                                <span style={{ color: '#00f2ff', fontWeight: 'bold' }}>
                                    {returnDetail.pickupPhone}
                                </span>
                                
                                <span style={{ color: '#aaa' }}>수거 주소</span>
                                <span>
                                    [{returnDetail.pickupAddr}] {returnDetail.pickupAddrDetail}
                                </span>

                                <span style={{ color: '#aaa' }}>수거 요청사항</span>
                                <span style={{ color: '#ffcc00' }}>
                                    {returnDetail.orderRequest || "요청사항 없음"}
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                            * 구매자가 신청 시 작성한 수거 정보입니다. 주문 시 정보와 다를 수 있으니 반드시 확인 후 회수 진행 바랍니다.
                        </p>
                    </div>

                    {/* 2. 구매자 사유 (수정 불가) */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>구매자 신청 사유</label>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#fff' }}>
                            <p>사유: <span style={{ color: '#ffcc00' }}>{returnDetail.returnReason}</span></p>
                            <p style={{ marginTop: '10px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                                상세내용: {returnDetail.returnReasonDetail || "내용 없음"}
                            </p>
                        </div>
                    </div>

                    <hr style={{ border: '0.5px solid rgba(0, 242, 255, 0.1)', margin: '30px 0' }} />

                    {/* 3. 판매자 관리 영역 (수정 가능) */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>배송비 및 택배사 설정</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>배송비(차감/지불액)</p>
                                <NumberInput
                                    type="number"
                                    value={gdelPrice}
                                    style={{ width: '100%' }}
                                    onChange={(e) => setGdelPrice(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>회수 택배사</p>
                                <SaveInput 
                                    type="text"
                                    placeholder="예: CJ대한통운"
                                    value={gdelType}
                                    style={{ width: '100%' }}
                                    onChange={(e) => setGdelType(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* 판매자 처리 결과 및 거절 사유 표시 */}
                        <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#fff', border: status === '거부' ? '1px solid rgba(255, 77, 77, 0.3)' : 'none' }}>
                            <p>현재 처리 상태: <strong style={{ color: status === '거부' ? '#ff4d4d' : '#00f2ff' }}>{status}</strong></p>
                            
                            {status === "거부" && (
                                <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,77,77,0.2)', paddingTop: '10px' }}>
                                    <p style={{ color: '#ff4d4d', fontSize: '13px', fontWeight: 'bold' }}>🚫 판매자 거절 사유</p>
                                    <p style={{ marginTop: '5px', fontSize: '14px', whiteSpace: 'pre-wrap', color: '#eee' }}>
                                        {returnDetail.returnSaleReasonDetail || "등록된 거절 사유가 없습니다."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. 상태별 액션 버튼 */}
                    <div className={styles.formGroup} style={{ marginTop: '30px' }}>
                        <label className={styles.label}>단계별 처리</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {status === "접수" && (
                                <>
                                    <SaveBtn onClick={() => handleStatusUpdate("회수중")} style={{ flex: 1 }}>반품 승인 (회수 시작)</SaveBtn>
                                    <SaveBtn 
                                        onClick={() => setStatus("거부_입력")} 
                                        style={{ flex: 1, background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '8px', cursor: 'pointer' }}
                                    >
                                        반품 거부
                                    </SaveBtn>
                                </>
                            )}
                            {status === "회수중" && (
                                <SaveBtn onClick={() => handleStatusUpdate("완료")} style={{ flex: 1, background: '#00ff00', color: '#000' }}>물건 확인 및 최종 완료</SaveBtn>
                            )}
                            {(status === "완료" || status === "거부" || status === "취소") && (
                                <div style={{ textAlign: 'center', width: '100%', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#aaa' }}>
                                    이미 처리가 완료된 건입니다. ({status})
                                </div>
                            )}
                        </div>

                        {/* 거부 사유 입력창 (거부 버튼 클릭 시 노출) */}
                        {status === "거부_입력" && (
                            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ff4d4d', borderRadius: '8px' }}>
                                <p style={{ color: '#ff4d4d', marginBottom: '10px' }}>거부 사유를 입력해주세요.</p>
                                <textarea 
                                    className={styles.textarea}
                                    style={{ width: '100%', height: '80px', background: '#222', color: '#fff', border: '1px solid #444'}}
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="구매자에게 전달될 거절 사유"
                                />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={() => handleStatusUpdate("거부")} style={{ background: '#ff4d4d', border: 'none', color: '#fff', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>거부 확정</button>
                                    <button onClick={() => setStatus("접수")} style={{ background: '#444', border: 'none', color: '#fff', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GoodsSaleReturn;