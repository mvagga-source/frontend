import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBtn, SaveBtn, MoveBtn } from "../../components/button/Button";
import { SearchInput, SaveInput, NumberInput } from "../../components/input/Input";
import Content from "../../components/Title/ContentComp";
import TiptapEditor from "../../components/CkEditor/TiptapEditor";
import formStyles from "../Board/BoardWrite.module.css";
import styles from "./GoodsWrite.module.css";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import DaumAddrSearchModal from "../../components/DaumAddrModal/DaumAddrModal";
import { GoodsWriteApi } from "./GoodsApi";

function GoodsWrite() {
    const navigate = useNavigate();
    const formRef = useRef();
    const [editorData, setEditorData] = useState("");
    
    // 대표 이미지 상태 관리
    const [mainImg, setMainImg] = useState(null);
    const [mainImgPreview, setMainImgPreview] = useState(null);

    //다음 주소찾기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState(""); // 주소 상태

    const searchOptions = [
        { value: "판매중", label: "판매중" },
        { value: "품절", label: "품절" },
        { value: "숨김", label: "숨김" },
    ];

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
        document.getElementById("mainImgFile").value = "";
    };

    const handleAddressComplete = (data) => {
        setAddress(data.address);
        setIsModalOpen(false); // 주소 선택 후 자동 닫기
    };

    const handleSave = async () => {
        if (window.confirm("상품을 등록하시겠습니까?")) {
            const formData = new FormData(formRef.current);
            formData.append("gcontent", editorData); // DTO의 gcontent와 매칭
            if(mainImg) formData.append("gimgFile", mainImg); // 서버에서 처리할 파일 객체
            GoodsWriteApi(formData).then((res) => {
                if (res.data.success) {
                    alert("상품이 등록되었습니다.");
                    navigate("/BoardList");
                }
            })
            console.log("전송 데이터 확인:", Object.fromEntries(formData));
        }
    };

    return (
        <Content TitleName="Goods Registration">
            <div className={formStyles.wrapper}>
                <div className={formStyles.container}>
                    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                        
                        {/* 1. 대표 이미지 업로드 섹션 */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>대표 상품 이미지 (Main Thumbnail)</label>
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
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>상품명</label>
                            <SaveInput name="gname" style={{width:"100%"}} placeholder="상품명을 입력하세요" />
                        </div>

                        <div style={{display: "flex", gap: "20px"}}>
                            <div className={formStyles.formGroup} style={{flex: 1}}>
                                <label className={formStyles.label}>판매가 (Price)</label>
                                <NumberInput name="price" placeholder="0" style={{width:"100%"}} />
                            </div>
                            <div className={formStyles.formGroup} style={{flex: 1}}>
                                <label className={formStyles.label}>재고 수량 (Stock)</label>
                                <NumberInput name="stockCnt" placeholder="0" style={{width:"100%"}} />
                            </div>
                        </div>

                        {/* 3. 배송 및 상태 정보 */}
                        <div style={{display: "flex", gap: "20px"}}>
                            <div className={formStyles.formGroup} style={{flex: 1}}>
                                <label className={formStyles.label}>배송비</label>
                                <NumberInput name="gdelPrice" placeholder="3000" style={{width:"100%"}} />
                            </div>
                            <div className={formStyles.formGroup} style={{flex: 1}}>
                                <label className={formStyles.label}>판매 상태</label>
                                <SearchSelect name="status" className={styles.fullWidth} options={searchOptions} />
                            </div>
                        </div>

                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>출고지 주소</label>
                            <SaveInput 
                                style={{ flex: 1 }} 
                                placeholder="출고지 주소를 입력하세요"
                                name="gdelivAddr" 
                            />
                        </div>

                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>반품 주소</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <SaveInput 
                                    value={address} 
                                    readOnly
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
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>상세 설명</label>
                            <TiptapEditor onChange={(data) => setEditorData(data)} />
                        </div>

                        <div className={formStyles.btnWrapper}>
                            <MoveBtn type="button" color="purple">미리보기</MoveBtn>
                            <SaveBtn type="button" onClick={handleSave}>상품 등록</SaveBtn>
                        </div>
                    </form>
                </div>
            </div>
        </Content>
    );
}

export default GoodsWrite;