import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchBtn, SaveBtn, MoveBtn } from "../../components/button/Button";
import { SearchInput, SaveInput, NumberInput } from "../../components/input/Input";
import Content from "../../components/Title/ContentComp";
import TiptapEditor from "../../components/CkEditor/TiptapEditor";
import styles from "./GoodsWrite.module.css";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import DaumAddrSearchModal from "../../components/DaumAddrModal/DaumAddrModal";
import { GoodsWriteApi } from "./GoodsApi";
import { getIdolSelectBoxApi } from '../Audition/idolApi';
import { useAuth } from "../../context/AuthContext";

function GoodsWrite() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const formRef = useRef();
    const [editorData, setEditorData] = useState("");
    const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
    
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
                    label: i.name       // 화면에 표시될 참가자 이름
                }));
                setIdolList(formattedList);
            }
        });
    },[]);

    // 이미지 변경 핸들러
    const handleMainImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImg(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImgPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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

    const handleSave = async () => {
        if (window.confirm("상품을 등록하시겠습니까?\n※주의 : 상품을 등록하신 이후 판매상태와 반품주소 및 재고수량만 수정하실 수 있습니다.")) {
            const formData = new FormData(formRef.current);
            formData.append("gcontent", editorData); // DTO의 gcontent와 매칭
            //console.log("에디터 데이터 실제 byte 크기:", new Blob([editorData]).size);
            if(mainImg) formData.append("gimgFile", mainImg); // 서버에서 처리할 파일 객체
            GoodsWriteApi(formData).then((res) => {
                if (res.data.success) {
                    alert("상품이 등록되었습니다.");
                    navigate(state?.from || "/GoodsList");
                }
            })
            console.log("전송 데이터 확인:", Object.fromEntries(formData));
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
        window.open("/GoodsPreview", "_blank", "width=1500,height=1000,scrollbars=yes");
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

    return (
        <Content TitleName="Goods Write">
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                        
                        {/* 1. 대표 이미지 업로드 섹션 */}
                        {/* <div className={styles.formGroup}> */}
                        {/* 아래주석은 중앙 정렬 */}
                        <div className={styles.formGroup} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px" }}>
                            <label className={styles.label}><span className={styles.required}>*</span> 대표 상품 이미지 (Main Thumbnail)</label>
                            <div className={styles.imageUploadWrapper}>
                                {/* 컨테이너는 딱 하나만 사용합니다 */}
                                <div className={styles.imagePreviewContainer}>
                                    <label htmlFor="mainImgFile" className={styles.imageLabel}>
                                        {mainImgPreview ? (
                                            <div className={styles.imageWrapper}>
                                                <img src={mainImgPreview} alt="대표이미지" />
                                                <div className={styles.imageOverlay}>변경하기</div>
                                            </div>
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <span>+</span>
                                                <p>이미지 추가</p>
                                            </div>
                                        )}
                                    </label>
                                    
                                    {mainImgPreview && (
                                        <button 
                                            type="button" 
                                            className={styles.imageDeleteBadge} 
                                            onClick={handleRemoveMainImg} 
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                <input 
                                    type="file" 
                                    id="mainImgFile" 
                                    accept="image/*" 
                                    onChange={handleMainImgChange} 
                                    className={styles.hiddenInput} 
                                />
                            </div>
                        </div>

                        {/* 2. 상품명 및 기본 정보 */}
                        {/* <div className={styles.formGroup}>
                            <label className={styles.label}>상품명</label>
                            <SaveInput name="gname" maxLength={100} style={{width:"100%"}} placeholder="상품명을 입력하세요" />
                        </div> */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}><span className={styles.required}>*</span> 상품명</label>
                                <SaveInput name="gname" maxLength={100} style={{width:"100%"}} placeholder="상품명을 입력하세요" />
                            </div>
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}><span className={styles.required}>*</span> 참가자명</label>
                                <SearchSelect 
                                    name="idol.profileId" 
                                    className={styles.fullWidth} 
                                    options={[{ value: "", label: "선택 안함" }, ...idolList]} 
                                />
                            </div>
                        </div>

                        <div style={{display: "flex", gap: "20px"}}>
                            <div className={styles.formGroup} style={{flex: 1}}>
                                <label className={styles.label}><span className={styles.required}>*</span> 판매가</label>
                                <NumberInput name="price" placeholder="0" style={{width:"100%"}} />
                            </div>
                            <div className={styles.formGroup} style={{flex: 1}}>
                                <label className={styles.label}><span className={styles.required}>*</span> 재고 수량</label>
                                <NumberInput name="stockCnt" 
                                    onInput={handleStockChange} defaultValue={1} placeholder="0" style={{width:"100%"}} />
                            </div>
                        </div>

                        {/* 3. 배송 및 상태 정보 */}
                        <div style={{display: "flex", gap: "20px"}}>
                            <div className={styles.formGroup} style={{flex: 1}}>
                                <label className={styles.label}><span className={styles.required}>*</span> 배송비</label>
                                <NumberInput name="gdelPrice" placeholder="3000" style={{width:"100%"}} />
                            </div>
                            <div className={styles.formGroup}  style={{flex: 1}}>
                                <label className={styles.label}><span className={styles.required}>*</span> 택배사</label>
                                <SaveInput 
                                    maxLength={255}
                                    style={{width:"100%"}}
                                    placeholder="택배사를 입력하세요"
                                    name="gdelType"
                                />
                            </div>
                        </div>

                        <div style={{display: "flex", gap: "20px"}}>
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}><span className={styles.required}>*</span> 출고지 주소</label>
                                <SaveInput 
                                    style={{width:"100%"}}
                                    placeholder="출고지 주소를 입력하세요"
                                    name="gdelivAddr"
                                />
                            </div>
                            <div className={styles.formGroup} style={{flex: 1}}>
                                <label className={styles.label}><span className={styles.required}>*</span> 판매 상태</label>
                                <SearchSelect name="status" 
                                onChange={handleStatusChange}
                                className={styles.fullWidth} options={searchOptions} />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 반품 주소</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <SaveInput 
                                    value={address} 
                                    readOnly
                                    className={styles.readOnlyInput}
                                    name="gdelivAddrReturn"
                                    style={{ flex: 1 }} 
                                    placeholder="주소를 검색하세요" 
                                />
                                <SearchBtn type="button" onClick={() => setIsModalOpen(true)}>주소 검색</SearchBtn>
                            </div>
                            <SaveInput name="gdelivAddrReturnDetail" style={{ width: "100%" }} placeholder="상세 주소를 입력하세요" />
                        </div>
                        <DaumAddrSearchModal
                            isOpen={isModalOpen} 
                            onClose={() => setIsModalOpen(false)} 
                            onComplete={handleAddressComplete} 
                        />

                        {/* 4. 상세 설명 (Tiptap 위지윅) */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}><span className={styles.required}>*</span> 상세 설명</label>
                            <TiptapEditor onChange={(data) => setEditorData(data)} />
                        </div>

                        <div className={styles.btnWrapper}>
                            <MoveBtn type="button" color="purple" onClick={handlePreview}>미리보기</MoveBtn>
                            <SaveBtn type="button" onClick={handleSave}>상품 등록</SaveBtn>
                        </div>
                    </form>
                </div>
            </div>
        </Content>
    );
}

export default GoodsWrite;