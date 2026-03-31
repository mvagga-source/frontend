import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./IdeaWrite.module.css";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import { IdeaWriteApi } from "./IdeaApi"; // 실제 API 경로에 맞춰 수정하세요

function IdeaSave() {
    const navigate = useNavigate();
    const formRef = useRef();

    const categoryOptions = [
        { value: "기능제안", label: "기능 제안" },
        { value: "컨텐츠", label: "신규 컨텐츠" },
        { value: "디자인", label: "UI/UX 개선" },
        { value: "이벤트", label: "이벤트 아이디어" },
        { value: "기타", label: "기타" }
    ];

    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : "");
    };

    const handleCancelFile = () => {
        if (formRef.current["file"]) {
            formRef.current["file"].value = "";
        }
        setFileName("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        if(window.confirm("아이디어를 등록하시겠습니까?")) {
            IdeaWriteApi(formData)
            .then((res) => {
                if (res.data.success) {
                    alert("아이디어가 소중하게 접수되었습니다!");
                    navigate("/Community/IdeaList");
                }
            });
        }
    };

    return (
        <div className={styles.ideaContainer}>
            {/* 좌측 등록 폼 */}
            <form className={styles.ideaForm} ref={formRef}>
                <h2>아이디어 제안</h2>

                <label>
                    <span className={styles.required}>*</span>
                    카테고리
                </label>
                <SearchSelect 
                    name="ideacategory" 
                    options={categoryOptions} 
                    className={styles.customWidth} 
                />

                <label>
                    <span className={styles.required}>*</span>
                    제안 제목
                </label>
                <input
                    type="text"
                    name="ideatitle"
                    placeholder="멋진 아이디어의 제목을 적어주세요"
                    className={styles.ideaInput}
                />

                <label>
                    <span className={styles.required}>*</span>
                    상세 내용
                </label>
                <textarea
                    name="ideacontent"
                    rows="8"
                    className={styles.ideaTextarea}
                    placeholder="제안하시려는 내용을 상세히 적어주시면 검토에 큰 도움이 됩니다."
                />

                <div className={styles.fileUpload}>
                    <label className={styles.fileLabel}>
                        📎 참고 자료 첨부
                        <input type="file" name="file" onChange={handleFileChange} />
                    </label>

                    {fileName && (
                        <div className={styles.fileInfo}>
                            <span className={styles.fileName}>파일명: {fileName}</span>
                            <button 
                                type="button" 
                                className={styles.fileCancelBtn} 
                                onClick={handleCancelFile}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                <button type="button" onClick={handleSave} className={styles.submitBtn}>
                    제안하기
                </button>
            </form>

            {/* 우측 가이드 영역 */}
            <div className={styles.guideBox}>
                <h3>💡 아이디어 작성 가이드</h3>
                <p>여러분의 작은 아이디어가 더 나은 서비스를 만듭니다.</p>

                <ul>
                    <li>✔ 구체적인 실행 방안이 포함되면 좋습니다.</li>
                    <li>✔ 관련 이미지나 기획안을 첨부해보세요.</li>
                    <li>✔ 중복된 제안이 있는지 먼저 확인해주세요.</li>
                    <li>✔ 선정된 아이디어는 서비스에 반영될 수 있습니다.</li>
                </ul>
            </div>
        </div>
    );
}

export default IdeaSave;