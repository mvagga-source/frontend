import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SearchBtn, SaveBtn, MoveBtn } from "../../components/button/Button";
import { SearchInput, SaveInput, NumberInput } from "../../components/input/Input";
import Content from "../../components/Title/ContentComp";
import TiptapEditor from "../../components/CkEditor/TiptapEditor";
import formStyles from "../Board/BoardWrite.module.css";
import styles from "./GoodsWrite.module.css";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import DaumAddrSearchModal from "../../components/DaumAddrModal/DaumAddrModal";
import { GoodsUpdateApi, getGoodsDetailApi } from "./GoodsApi";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import { getIdolSelectBoxApi } from "../Audition/idolApi";

function GoodsUpdate() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const { gno } = useParams();
    const formRef = useRef();
    const [editorData, setEditorData] = useState("");
    const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
    
    const [goods, setGoods] = useState(null); // 불러온 상품 데이터

    // 대표 이미지 상태 관리
    const [mainImg, setMainImg] = useState(null);
    const [mainImgPreview, setMainImgPreview] = useState(null);

    //다음 주소찾기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState(""); // 주소 상태

    const searchOptions = [
        { value: "판매중", label: "판매중" },
        { value: "품절", label: "품절" },
        { value: "판매중지", label: "판매중지" },
    ];

    // 참가자 selectBoxOption
    const [idolList, setIdolList] = useState([]);
    
    useEffect(() => {
        getIdolSelectBoxApi({}).then((res) => {
            if (res.data.success) {
                const formattedList = res.data.data.map(i => ({
                    value: i.profileId, // 또는 i.idolId (실제 PK 값)
                    label: i.profileId + ". " + i.name       // 화면에 표시될 참가자 이름
                }));
                
                //console.log("변환된 리스트:", formattedList);
                setIdolList(formattedList);
            }
        });
    },[]);

    // [추가] 기존 데이터 불러오기 함수
    const getGoodsDetail = async () => {
        getGoodsDetailApi({ gno }).then((res) => {
            if (res.data.success) {
                const data = res.data.data;
                setGoods(data);
                setEditorData(data?.gcontent);
                setAddress(data?.gdelivAddrReturn || "");
                // 기존 이미지가 있다면 프리뷰에 세팅 - 서버 경로
                if (data?.gimg) {
                    setMainImgPreview(data.gimg); 
                }
            }
        });
    };

    useEffect(() => {
        getGoodsDetail();
    }, [gno]);

    // 이미지 변경 핸들러
    /*const handleMainImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImg(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImgPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };*/

    // 이미지 삭제 핸들러
    const handleRemoveMainImg = () => {
        setMainImg(null);
        setMainImgPreview(null);
        document.getElementById("mainImgFile").value = "";      //useRef대신
    };

    const handleAddressComplete = (data) => {
        setAddress(data.address);
        setIsModalOpen(false); // 주소 선택 후 자동 닫기
    };

    const handleUpdate = async () => {
        if (window.confirm("상품 정보를 수정하시겠습니까?")) {
            const formData = new FormData(formRef.current);
            formData.append("gno", gno);
            formData.append("gcontent", editorData);
            if(mainImg) formData.append("gimgFile", mainImg); // 서버에서 처리할 파일 객체
            GoodsUpdateApi(formData).then((res) => {
                if (res.data.success) {
                    alert("상품 정보가 수정되었습니다.");
                    navigate(state?.from || "/GoodsView/"+gno);
                }
            });
        }
    };

    // [추가] 미리보기 함수
    const handlePreview = () => {
        const formData = new FormData(formRef.current);
        const previewData = {
            gname: formData.get("gname") || "상품명 없음",
            // GoodsView가 gcontent의 첫 줄을 제목으로 쓰므로 형식 유지
            gcontent: (formData.get("gname") || "상품명") + "\n" + editorData,
            price: parseInt(formData.get("price")) || 0,
            stockCnt: parseInt(formData.get("stockCnt")) || 0,
            status: formData.get("status") || "판매중",
            gdelPrice: parseInt(formData.get("gdelPrice")) || 0,
            gdelType: formData.get("gdelType") || "일반배송",
            gdelivAddr: formData.get("gdelivAddr") || "출고지 미입력",
            gimg: mainImgPreview, // 미리보기용 base64 이미지
            member: { id: user?.id || "Admin" }, // 현재 로그인 사용자
            isPreview: true // 미리보기 모드임을 알림
        };
        // 로컬 스토리지에 임시 저장
        localStorage.setItem("goods_preview", JSON.stringify(previewData));
        
        // 새 창 열기 (Route는 아래 2번 단계에서 설정)
        window.open("/GoodsPreview", "_blank", "width=1100,height=900,scrollbars=yes");
    }
    // 재고 입력 시 상태 변경 핸들러
    const handleStockChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        const statusSelect = formRef.current.querySelector('select[name="status"]'); // name="status"인 요소 찾기

        if (value === 0) {
            statusSelect.value = "품절"; // 재고 0 입력 시 '품절'로 강제 변경
        } else if (value > 0 && statusSelect.value === "품절") {
            statusSelect.value = "판매중"; // 재고가 생기면 다시 '판매중'으로 변경 (센스!)
        }
    };

    // 상태 변경 시 재고 변경 핸들러
    const handleStatusChange = (e) => {
        const status = e.target.value;
        const stockInput = formRef.current.querySelector('input[name="stockCnt"]'); // name="stockCnt"인 요소 찾기

        if (status === "품절") {
            stockInput.value = 0; // '품절' 선택 시 재고 0으로 강제 변경
        } else if (status === "판매중" && parseInt(stockInput.value) <= 0) {
            // '판매중'인데 재고가 0이라면 최소 1개는 넣으라고 안내하거나 1로 세팅
            stockInput.value = 1;
        }
    };
    if (!goods) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <Content TitleName="Goods Update">
            <div className={formStyles.wrapper}>
                <div className={formStyles.container}>
                    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                        
                        {/* 1. 대표 이미지 업로드 섹션 */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}><span className={styles.required}>*</span> 대표 상품 이미지<span className={styles.readOnlyNote}>(수정 불가)</span></label>
                            <div className={styles.imageUploadWrapper}>
                                <div className={styles.imagePreviewContainer} style={{ cursor: 'default' }}>
                                    {/* htmlFor를 제거하여 input 파일창이 뜨지 않게 막기 */}
                                    <div className={styles.imageLabel} style={{ cursor: 'default' }}>
                                        {mainImgPreview ? (
                                            <div className={styles.imageWrapper}>
                                                <img src={mainImgPreview} alt="대표이미지" style={{ opacity: 0.8 }} />
                                                {/* 변경 안내 오버레이를 삭제하거나 '수정 불가' 메시지로 */}
                                                <div className={styles.imageOverlay} style={{ display: 'none' }}>변경 불가</div>
                                            </div>
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <p>등록된 이미지가 없습니다.</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* X 버튼은 당연히 제거된 상태 유지 */}
                                </div>

                                {/* input 태그는 있어도 되고 없어도 되지만, readOnly 프롭이 있다면 확실히 작동 안 함 */}
                                <input 
                                    type="file" 
                                    id="mainImgFile" 
                                    disabled // input 자체를 비활성화
                                    className={styles.hiddenInput} 
                                />
                            </div>
                        </div>

                        {/* 2. 상품명 및 기본 정보 */}
                        {/* <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>상품명</label>
                            <SaveInput name="gname" maxLength={100} readOnly defaultValue={goods?.gname} style={{width:"100%"}} placeholder="상품명을 입력하세요" />
                        </div> */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                            <div className={formStyles.formGroup} style={{ flex: 1 }}>
                                <label className={formStyles.label}>
                                    <span className={styles.required}>*</span> 상품명
                                    <span className={styles.readOnlyNote}>(수정 불가)</span>
                                </label>
                                <SaveInput name="gname" maxLength={100} readOnly defaultValue={goods?.gname} style={{width:"100%"}} placeholder="상품명을 입력하세요" />
                            </div>
                            <div className={formStyles.formGroup} style={{ flex: 1 }}>
                                <label className={formStyles.label}>
                                    <span className={styles.required}>*</span> 참가자명
                                    <span className={styles.readOnlyNote}>(수정 불가)</span>
                                </label>
                                <SearchSelect 
                                    name="idol.profileId"
                                    disabled
                                    defaultValue={goods?.idol?.profileId}
                                    className={styles.fullWidth} 
                                    options={[{ value: "", label: "선택 안함" }, ...idolList]} 
                                />
                            </div>
                        </div>

                        <div style={{display: "flex", gap: "20px"}}>
                            <div className={formStyles.formGroup} style={{flex: 1}}>
                                <label className={formStyles.label}>
                                    <span className={styles.required}>*</span> 판매가
                                    <span className={styles.readOnlyNote}>(수정 불가)</span>
                                </label>
                                <NumberInput name="price" readOnly placeholder="0" defaultValue={goods?.price} style={{width:"100%"}} />
                            </div>
                            <div className={formStyles.formGroup} style={{flex: 1}}>
                                <label className={formStyles.label}><span className={styles.required}>*</span> 재고 수량 (Stock)</label>
                                <NumberInput name="stockCnt" placeholder="0" defaultValue={goods?.stockCnt} 
                                    onInput={handleStockChange} style={{width:"100%"}} />
                            </div>
                        </div>

                        {/* 3. 배송 및 상태 정보 */}
                        <div style={{display: "flex", gap: "20px"}}>
                            <div className={formStyles.formGroup} style={{flex: 1}}>
                                <label className={formStyles.label}><span className={styles.required}>*</span> 배송비</label>
                                <NumberInput name="gdelPrice" placeholder="3000" defaultValue={goods?.gdelPrice} style={{width:"100%"}} />
                            </div>
                            <div className={formStyles.formGroup}  style={{flex: 1}}>
                                <label className={formStyles.label}><span className={styles.required}>*</span> 택배사</label>
                                <SaveInput 
                                    maxLength={255}
                                    style={{width:"100%"}}
                                    placeholder="택배사를 입력하세요"
                                    name="gdelType"
                                    defaultValue={goods?.gdelType}
                                    />
                            </div>
                        </div>

                        <div style={{display: "flex", gap: "20px"}}>
                            <div className={formStyles.formGroup} style={{ flex: 1 }}>
                                <label className={formStyles.label}><span className={styles.required}>*</span> 출고지 주소</label>
                                <SaveInput 
                                    style={{width:"100%"}}
                                    placeholder="출고지 주소를 입력하세요"
                                    name="gdelivAddr"
                                    defaultValue={goods?.gdelivAddr}
                                />
                            </div>
                            <div className={formStyles.formGroup} style={{flex: 1}}>
                                <label className={formStyles.label}><span className={styles.required}>*</span> 판매 상태</label>
                                <SearchSelect 
                                    name="status"
                                    className={styles.fullWidth}
                                    onChange={handleStatusChange}
                                    options={searchOptions} />
                            </div>
                        </div>

                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}><span className={styles.required}>*</span> 반품 주소</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <SaveInput 
                                    name="gdelivAddrReturn"
                                    value={address} 
                                    style={{ flex: 1 }} 
                                    placeholder="주소를 검색하세요"
                                />
                                <SearchBtn type="button" onClick={() => setIsModalOpen(true)}>주소 검색</SearchBtn>
                            </div>
                            <SaveInput name="gdelivAddrReturnDetail" defaultValue={goods?.gdelivAddrReturnDetail} style={{ width: "100%" }} placeholder="상세 주소를 입력하세요" />
                        </div>
                        <DaumAddrSearchModal
                            isOpen={isModalOpen} 
                            onClose={() => setIsModalOpen(false)} 
                            onComplete={handleAddressComplete} 
                        />

                        {/* 4. 상세 설명 (Tiptap 위지윅) */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <span className={styles.required}>*</span> 상세 설명
                                <span className={styles.readOnlyNote}>(수정 불가)</span>
                            </label>
                            <TiptapEditor 
                            readOnly
                            content={goods?.gcontent || ""}
                            onChange={(data) => setEditorData(data)} />
                        </div>

                        <div className={formStyles.btnWrapper}>
                            <MoveBtn type="button" color="purple" onClick={handlePreview}>미리보기</MoveBtn>
                            <SaveBtn type="button" onClick={handleUpdate}>상품 수정</SaveBtn>
                        </div>
                    </form>
                </div>
            </div>
        </Content>
    );
}

export default GoodsUpdate;
