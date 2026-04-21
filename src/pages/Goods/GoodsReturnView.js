import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SaveBtn, MoveBtn, SearchBtn } from "../../components/button/Button";
import { SaveInput } from "../../components/input/Input";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import styles from "./GoodsWrite.module.css"; 
import { getReturnViewApi, GoodsReturnUpdateApi } from "./GoodsApi"; 
import DaumAddrSearchModal from "../../components/DaumAddrModal/DaumAddrModal";

function GoodsReturnView() {
    const navigate = useNavigate();
    const { rno } = useParams();
    const [loading, setLoading] = useState(true);
    const [returnData, setReturnData] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pickupAddr, setPickupAddr] = useState("");
    
    const [returnType, setReturnType] = useState("반품");
    const [returnQty, setReturnQty] = useState(1);
    const [reason, setReason] = useState("변심");
    const [reasonDetail, setReasonDetail] = useState("");
    const [availableQty, setAvailableQty] = useState(0);

    const formRef = useRef(null);

    const returnReasons = [
        { value: "변심", label: "단순 변심 (배송비 구매자 부담)", types: ["반품", "교환"] },
        { value: "파손", label: "상품 파손 및 불량", types: ["반품", "교환"] },
        { value: "오배송", label: "오배송 및 누락", types: ["반품", "교환"] },
        { value: "지연", label: "배송 지연으로 인한 반품", types: ["반품"] },
    ];

    useEffect(() => {
        if (!rno) return;
        setLoading(true);
        getReturnViewApi(rno)
            .then(res => {
                const data = res.data.data;
                setReturnData(data);
                setReturnType(data.returnType);
                setReturnQty(data.returnCnt);
                setReason(data.returnReason);
                setReasonDetail(data.returnReasonDetail);
                setPickupAddr(data.pickupAddr);
                
                // [수정 가능 여부] '접수' 상태일 때만 활성화
                if (data.returnStatus === "접수") {
                    setIsEditMode(true);
                }

                const already = res.data.alreadyReturned || 0;
                setAvailableQty((data.order.cnt - already) + data.returnCnt);
                setLoading(false);
            })
            .catch(err => {
                alert("내역을 불러오지 못했습니다.");
                navigate(-1);
            });
    }, [rno, navigate]);

    const calculateRefund = () => {
        if (!returnData) return 0;
        const itemPrice = returnData.order.goods?.price || 0;
        const totalItemPrice = itemPrice * returnQty;
        const deliveryFee = returnData.gdelPrice || 0;

        if (reason === "변심") {
            if(returnType === "교환") {
                const refund = totalItemPrice - (deliveryFee * 2);
                return refund < 0 ? 0 : refund;
            } else {
                const refund = totalItemPrice - deliveryFee;
                return refund < 0 ? 0 : refund;
            }
        }
        return totalItemPrice;
    };

    const handleUpdateSubmit = async () => {
        if (!window.confirm("반품/교환 내역을 수정하시겠습니까?")) return;

        const formData = new FormData(formRef.current);
        formData.append("rno", rno);
        const itemPrice = returnData.order.goods?.price || 0;
        const totalItemPrice = itemPrice * returnQty;
        formData.append("refundPrice", totalItemPrice);

        GoodsReturnUpdateApi(formData).then(res => {
            if (res.data.success) {
                alert("수정이 완료되었습니다.");
                window.location.reload();
            }
        });
    };

    if (loading) return <LoadingScreen />;

    // 상태 바 컬러
    const getStatusColor = (status) => {
        switch(status) {
            case "접수": return "#ff9800";
            case "완료": return "#4caf50";
            case "거부": return "#f44336";
            default: return "#00f2ff";
        }
    };

    // 주소 선택이 완료되었을 때 실행되는 함수
    const handleAddressComplete = (data) => {
        setPickupAddr(data.address || data); 
        setIsModalOpen(false); // 주소 선택 후 모달 닫기
    };

    return (
        <>
            <div className={styles.header}>
                <h2 className={styles.title}>반품/교환 상세 내역</h2>

                {/* [상태 바 추가] */}
                <div className={styles.statusBanner} style={{ borderLeft: `5px solid ${getStatusColor(returnData.returnStatus)}`, background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '15px', color: '#fff' }}>
                    처리 상태 : <strong style={{ color: getStatusColor(returnData.returnStatus), fontSize: '1.1rem' }}>{returnData.returnStatus}</strong>
                </div>

                {/* [거부 사유 추가] */}
                {returnData.returnStatus === "거부" && (
                    <div style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', border: '1px solid #f44336', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                        <p style={{ color: '#f44336', fontWeight: 'bold', marginBottom: '5px' }}>🚫 판매자 거부 사유</p>
                        <p style={{ color: '#ccc', fontSize: '14px' }}>{returnData.returnSaleReasonDetail || "사유가 등록되지 않았습니다."}</p>
                    </div>
                )}

                {/* 주의사항 유지 */}
                <div className={styles.infoBox}>
                    <p className={styles.infoTitle}>⚠️ 반품/교환 신청 전 확인해 주세요</p>
                    <ul className={styles.infoList}>
                        <li>단순 변심으로 인한 반품/교환은 <strong>왕복 배송비가 차감</strong>된 후 환불됩니다.</li>
                        <li>교환은 불량 또는 주문한 것과 다른 상품이 왔거나 구성품이 빠진 경우만 가능합니다.</li>
                        <li>상품 택 제거, 사용 흔적, 포장 훼손 시 반품이 거부될 수 있습니다.</li>
                        <li><strong>접수 상태에서만 정보 수정이 가능합니다.</strong></li>
                    </ul>
                </div>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                        
                        {/* 1. 신청 상품 정보 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>반품/교환 신청 상품</label>
                            <span style={{color: '#fff'}}>{`${returnData.order.goods.gname} / ${returnData.order.cnt}개`}</span>
                        </div>

                        {/* 2. 신청 종류 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 신청 종류</label>
                            <div style={{ display: 'flex', gap: '20px', color: '#fff' }}>
                                <label><input type="radio" name="returnType" value="반품" checked={returnType === "반품"} disabled={!isEditMode} onChange={(e) => setReturnType(e.target.value)} /> 반품(환불)</label>
                                <label><input type="radio" name="returnType" value="교환" checked={returnType === "교환"} disabled={!isEditMode} onChange={(e) => setReturnType(e.target.value)} /> 교환</label>
                            </div>
                        </div>

                        {/* 3. 사유 선택 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 반품/교환 사유</label>
                            <SearchSelect 
                                name="returnReason" 
                                className={styles.fullWidth} 
                                options={returnReasons.filter(r => r.types.includes(returnType))}
                                value={reason}
                                disabled={!isEditMode}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>

                        {/* 4. 상세 사유 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 상세 사유 설명</label>
                            <textarea 
                                name="returnReasonDetail"
                                className={styles.textarea}
                                value={reasonDetail}
                                readOnly={!isEditMode}
                                onChange={(e) => setReasonDetail(e.target.value)}
                            />
                        </div>

                        {/* 5. 수량 선택 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>반품/교환 수량</label>
                            <span style={{color: '#fff', fontSize: '1rem', fontWeight: 'bold'}}>
                                {returnQty} 개
                            </span>
                        </div>

                        {/* 6. 수거지 정보 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 수거인 성함</label>
                            <SaveInput name="pickupName" defaultValue={returnData?.pickupName} readOnly={!isEditMode} style={{minWidth:'100%'}} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 수거 관련 연락처</label>
                            <SaveInput name="pickupPhone" defaultValue={returnData?.pickupPhone} readOnly={!isEditMode} style={{minWidth:'100%'}} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 상품 수거지 주소</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <SaveInput name="pickupAddr" value={pickupAddr} readOnly style={{minWidth:'82%'}} />
                                {isEditMode && <SearchBtn type="button" onClick={() => setIsModalOpen(true)}>주소 검색</SearchBtn>}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 상품 수거지 상세 주소</label>
                            <textarea 
                                type="text" 
                                name="pickupAddrDetail"
                                className={styles.textarea}
                                placeholder="상세 주소를 입력하세요"
                                readOnly={!isEditMode}
                                defaultValue={returnData?.pickupAddrDetail}
                            />
                        </div>

                        {/* 5. 수거 시 기사님 확인 요청사항 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>기사님 확인 요청사항</label>
                            <SaveInput 
                                name="orderRequest" 
                                defaultValue={returnData?.orderRequest}
                                readOnly={!isEditMode} 
                                placeholder="문 앞에 두었습니다."
                                style={{minWidth:'100%'}} 
                            />
                        </div>

                        {/* 7. 환불 금액 안내 */}
                        <div className={styles.formGroup} style={{ marginTop: '30px' }}>
                            <div style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#e8f4f8' }}>
                                        <span>선택 상품 금액 ({returnQty}개)</span>
                                        <span>{((returnData?.order?.goods?.price || 0) * returnQty).toLocaleString()}원</span>
                                    </div>

                                    {/* 변심일 때만 차감 내역 표시 */}
                                    {reason === "변심" && returnType === "반품" && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4d4d', marginBottom: '10px' }}>
                                            <span>반품 배송비 (변심 차감)</span>
                                            <span>- {(returnData?.gdelPrice || returnData?.goods?.gdelPrice || 0).toLocaleString()}원</span>
                                        </div>
                                    )}

                                    {reason === "변심" && returnType === "교환" && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4d4d', marginBottom: '10px' }}>
                                            <span>교환 배송비 (변심 차감)</span>
                                            <span>- {((returnData?.gdelPrice || returnData?.goods?.gdelPrice || 0) * 2).toLocaleString()}원</span>
                                        </div>
                                    )}

                                    <hr style={{ border: 'none', borderTop: '1px solid rgba(232, 244, 248, 0.1)', margin: '15px 0' }} />
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '700' }}>
                                        <span>최종 환불 예정 금액</span>
                                        <span>{calculateRefund().toLocaleString()}원</span>
                                    </div>
                                </>
                            </div>
                        </div>

                        <div className={styles.btnWrapper}>
                            <MoveBtn type="button" onClick={() => navigate(-1)}>이전으로</MoveBtn>
                            {isEditMode && <SaveBtn type="button" onClick={handleUpdateSubmit}>내용 수정하기</SaveBtn>}
                        </div>
                    </form>
                </div>
            </div>

            <DaumAddrSearchModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onComplete={handleAddressComplete} 
            />
        </>
    );
}

export default GoodsReturnView;