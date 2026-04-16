import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SaveBtn, MoveBtn, SearchBtn } from "../../components/button/Button";
import { SaveInput } from "../../components/input/Input";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import styles from "./GoodsWrite.module.css"; // 기존 스타일 재활용
import { getReturnDetailApi, GoodsReturnApi } from "./GoodsApi";
import DaumAddrSearchModal from "../../components/DaumAddrModal/DaumAddrModal";

function GoodsReturn() {
    const navigate = useNavigate();
    const { gono } = useParams(); // 주문번호 기반
    const [loading, setLoading] = useState(true);
    const [orderDetail, setOrderDetail] = useState(null);
    const [availableQty, setAvailableQty] = useState(0); // [추가] 반품 가능 잔여 수량

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pickupAddr, setPickupAddr] = useState("");

    // 주소 검색 버튼을 눌렀을 때 DaumAddrSearchModal을 여는 함수
    const handleAddressSearch = () => {
        setIsModalOpen(true);
    };

    // 주소 선택이 완료되었을 때 실행되는 함수
    const handleAddressComplete = (data) => {
        setPickupAddr(data.address || data); 
        setIsModalOpen(false); // 주소 선택 후 모달 닫기
    };

    // 서버로 보낼 상태값들
    const [returnType, setReturnType] = useState("반품");
    const [returnQty, setReturnQty] = useState(1);
    const [reason, setReason] = useState("변심");
    const [reasonDetail, setReasonDetail] = useState("");

    const formRef = useRef(null);

    // 반품 사유 옵션
    const returnReasons = [
        { value: "변심", label: "단순 변심 (배송비 구매자 부담)", types: ["반품", "교환"] },
        { value: "파손", label: "상품 파손 및 불량", types: ["반품", "교환"] },
        { value: "오배송", label: "오배송 및 누락", types: ["반품", "교환"] },
        { value: "지연", label: "배송 지연으로 인한 반품", types: ["반품"] }, // 반품만 가능하게 설정
    ];

    // 현재 선택된 returnType에 맞는 사유만 필터링
    const filteredReasons = returnReasons.filter(r => r.types.includes(returnType));

    // [추가 로직] 만약 '교환'을 눌렀는데 현재 사유가 '지연'이라면 '변심'으로 강제 변경
    useEffect(() => {
        if (returnType === "교환" && reason === "지연") {
            setReason("변심");
        }
    }, [returnType]);

    useEffect(() => {
        // 서버에서 주문 상세 정보 가져오기
        getReturnDetailApi(gono)
            .then(res => {
                console.log(res);
                const data = res.data.data;
                const alreadyReturned = res.data.alreadyReturned || 0;
                const remaining = data.cnt - alreadyReturned;

                if (remaining <= 0) {
                    alert("이미 모든 수량이 반품/교환 처리되었습니다.");
                    navigate(-1);
                    return;
                }
                setPickupAddr(data?.address || "");
                setOrderDetail(data);
                setAvailableQty(remaining);
                setReturnQty(1); // 초기 수량 설정 (서버 필드명이 cnt인 경우)
                setLoading(false);
            })
            .catch(err => {
                alert("주문 정보를 불러오지 못했습니다.");
                navigate(-1);
            }).finally(() => setLoading(false));
    }, [gono, navigate]);

    // 환불 금액 계산 로직 (수량 * 단가 - 배송비)
    const calculateRefund = () => {
        if (!orderDetail) return 0;

        const itemPrice = orderDetail.goods?.price || 0;
        const totalItemPrice = itemPrice * returnQty; // 선택한 수량만큼의 상품 가격
        
        // 배송비 가져오기 (주문 시 기록된 배송비 우선, 없으면 상품 기본 배송비)
        const deliveryFee = orderDetail.gdelPrice || orderDetail.goods?.gdelPrice || 0;

        // 사유가 '변심'일 때만 배송비 차감
        if (reason === "변심") {
            const refund = totalItemPrice - deliveryFee;
            return refund < 0 ? 0 : refund;
        }

        // 그 외(파손, 오배송 등)는 상품 가격 전액 환불
        return totalItemPrice;
    };

    const handleReturnSubmit = async () => {
        if (!reason) return alert("반품 사유를 선택해주세요.");

        if (window.confirm(`반품 수량 ${returnQty}개로 신청하시겠습니까?`)) {
            const formData = new FormData(formRef.current);
            // 추가 데이터 삽입 (ref에 없는 값들)
            formData.append("order.gono", gono);
            formData.append("refundPrice", calculateRefund());

            GoodsReturnApi(formData).then(res => {
                if (res.data.success) {
                    alert("반품 접수가 완료되었습니다.");
                    navigate("/MyMain/MyReturn");
                }
            });
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <>
            <div className={styles.header}>
                <h2 className={styles.title}>반품/교환 요청</h2>
                <div className={styles.infoBox}>
                    <p className={styles.infoTitle}>⚠️ 반품 신청 전 확인해 주세요</p>
                    <ul className={styles.infoList}>
                        <li>단순 변심으로 인한 반품은 <strong>왕복 배송비가 차감</strong>된 후 환불됩니다.</li>
                        <li>교환은 불량 또는 주문한 것과 다른 상품이 왔거나 구성품이 빠진 경우만 <strong>왕복 배송비가 차감</strong>됩니다.</li>
                        <li>상품 택 제거, 사용 흔적, 포장 훼손 시 반품이 거부될 수 있습니다.</li>
                        <li><strong>허위 반품 접수:</strong> 고의로 상품을 훼손하여 반품을 시도할 경우 서비스 이용이 제한될 수 있습니다.</li>
                        <li>주소가 변경되었다면 직접 수정해 주세요.</li>
                    </ul>
                </div>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                        {/* 1. 신청 상품 정보 (Read Only) */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>반품/교환 신청 상품</label>
                            {`${orderDetail?.goods?.gname || orderDetail?.gname} / ${orderDetail?.cnt}개`}
                            <SaveInput 
                                readOnly 
                                hidden={true}
                                className={styles.readOnlyInput}
                                // 서버 데이터 구조에 맞게 gname 또는 goods.gname 확인 필요
                                value={`${orderDetail?.goods?.gname || orderDetail?.gname} / ${orderDetail?.cnt}개`}
                            />
                        </div>
                        {/* 0. 신청 종류 선택 (반품/교환) */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>신청 종류</label>
                            <div style={{ display: 'flex', gap: '20px', color: '#fff' }}>
                                <label><input type="radio" name="returnType" value="반품" checked={returnType === "반품"} onChange={(e) => setReturnType(e.target.value)} /> 반품(환불)</label>
                                <label><input type="radio" name="returnType" value="교환" checked={returnType === "교환"} onChange={(e) => setReturnType(e.target.value)} /> 교환</label>
                            </div>
                        </div>

                        {/* 2. 반품 사유 선택 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 반품/교환 사유</label>
                            <SearchSelect 
                                name="returnReason" 
                                className={styles.fullWidth} 
                                options={filteredReasons} // 필터링된 목록 사용
                                value={reason}
                                onChange={(e) => setReason(e.target.value)} // 상태 업데이트 연결
                            />
                        </div>

                        {/* 3. 상세 사유 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 상세 사유 설명</label>
                            <textarea 
                                name="returnReasonDetail"
                                className={styles.textarea}
                                placeholder="상품 불량의 경우 자세한 내용을 적어주시면 처리가 빠릅니다."
                                value={reasonDetail}
                                onChange={(e) => setReasonDetail(e.target.value)} // 상태 업데이트 연결
                            />
                        </div>

                        {/* 4. 수량 선택 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 반품 수량 선택</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {availableQty > 0 ? (
                                    <select 
                                        name="returnCnt" 
                                        value={returnQty}
                                        onChange={(e) => setReturnQty(Number(e.target.value))}
                                        style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#333', color: '#fff', width: '100px' }}
                                    >
                                        {/* Array.from을 사용하여 확실하게 숫자로 배열 생성 */}
                                        {Array.from({ length: availableQty }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>
                                                {num} 개
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span style={{ color: '#ff4d4d' }}>반품 가능한 수량이 없습니다.</span>
                                )}
                                <span style={{ color: '#aaa' }}>
                                    (반품 가능: {availableQty}개 / 전체 구매: {orderDetail?.cnt}개)
                                </span>
                            </div>
                        </div>

                        {/* 수거인 이름 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> {/*반품 보내시는 분*/}수거인성함</label>
                            <SaveInput 
                                type="text"
                                name="pickupName" // DTO 필드명과 일치
                                placeholder="반품 보내시는 분"
                                style={{minWidth:'100%'}}
                                defaultValue={orderDetail?.receiverName}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 수거 관련 연락처</label>
                            <SaveInput 
                                type="text"
                                name="pickupPhone" // DTO 필드명과 일치
                                placeholder="연락 가능한 번호"
                                style={{minWidth:'100%'}}
                                defaultValue={orderDetail?.receiverPhone}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/[^0-9]/, '')
                                        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
                                }}
                            />
                        </div>

                        {/* 상품 수거지 주소 */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 상품 수거지 주소 (기사님 방문 주소)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>
                                <SaveInput 
                                    type="text" 
                                    name="pickupAddr"
                                    readOnly
                                    value={pickupAddr}
                                    className={styles.input} // 기존 스타일 활용
                                    placeholder="주소를 검색하세요"
                                    style={{minWidth:'82%'}}
                                />
                                <SearchBtn type="button" style={{marginLeft:'2%'}} onClick={handleAddressSearch}>주소 검색</SearchBtn>
                                </div>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 상품 수거지 상세 주소</label>
                            <textarea 
                                type="text" 
                                name="pickupAddrDetail"
                                className={styles.textarea}
                                placeholder="상세 주소를 입력하세요"
                            >
                                {orderDetail?.detailAddress}
                            </textarea>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>기사님 확인 요청사항</label>
                            <SaveInput 
                                type="text" 
                                name="orderRequest" 
                                placeholder="문 앞에 두었습니다." 
                                className={styles.input}
                                style={{minWidth:'100%'}} 
                            />
                        </div>

                        {/* 5. 환불 예상 금액 안내 */}
                        <div className={styles.formGroup} style={{ marginTop: '30px' }}>
                            <div style={{ 
                                padding: '20px', backgroundColor: 'rgba(0,0,0,0.2)', 
                                borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)' 
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>선택 상품 금액 ({returnQty}개)</span>
                                    <span>{((orderDetail?.goods?.price || 0) * returnQty).toLocaleString()}원</span>
                                </div>

                                {/* 변심일 때만 차감 내역 표시 */}
                                {reason === "변심" && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4d4d', marginBottom: '10px' }}>
                                        <span>반품/교환 배송비 (변심 차감)</span>
                                        <span>- {(orderDetail?.gdelPrice || orderDetail?.goods?.gdelPrice || 0).toLocaleString()}원</span>
                                    </div>
                                )}
                                
                                {/* 변심이 아닐 때 표시 (선택 사항) */}
                                {reason && reason !== "변심" && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00ff00', marginBottom: '10px' }}>
                                        <span>배송비 혜택</span>
                                        <span>판매자 귀책 (0원)</span>
                                    </div>
                                )}

                                <hr style={{ border: '0.5px solid rgba(255,255,255,0.1)', margin: '15px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '700' }}>
                                    <span>최종 환불 예정 금액</span>
                                    <span style={{ color: '#00f2ff' }}>{calculateRefund().toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>

                        <DaumAddrSearchModal
                            isOpen={isModalOpen} 
                            onClose={() => setIsModalOpen(false)} 
                            onComplete={handleAddressComplete} 
                        />

                        <div className={styles.btnWrapper}>
                            <MoveBtn type="button" onClick={() => navigate(-1)}>이전으로</MoveBtn>
                            <SaveBtn type="button" onClick={handleReturnSubmit}>반품 신청하기</SaveBtn>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default GoodsReturn;