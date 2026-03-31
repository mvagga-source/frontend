import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReportWrite.module.css";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import { ReportWriteApi } from "./ReportApi";
import { getIdolSelectBoxApi } from "../Audition/idolApi";

function ReportSave() {
    const navigate = useNavigate();
    const formRef = useRef();

    const options = [
        { value: "비방/욕설", label: "비방/욕설" },
        { value: "도배/스팸", label: "도배/스팸" },
        { value: "부적절한 콘텐츠", label: "부적절한 콘텐츠" },
        { value: "성희롱", label: "성희롱" },
        { value: "기타", label: "기타" }
    ];

    const [idolList, setIdolList] = useState([]);
        
    useEffect(() => {
        getIdolSelectBoxApi({}).then((res) => {
            if (res.data.success) {
                const formattedList = res.data.data.map(i => ({
                    value: i.profileId, // 또는 i.idolId (실제 PK 값)
                    label: "#" + i.profileId + "(" + i.name + ")"       // 화면에 표시될 참가자 이름
                }));
                
                //console.log("변환된 리스트:", formattedList);
                setIdolList(formattedList);
            }
        });
    },[]);

    // 파일 이름을 저장할 상태 (초기값은 빈 문자열)
    const [fileName, setFileName] = useState("");

    // 파일이 선택되었을 때 실행될 함수
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); // 파일이 있으면 이름 저장
        } else {
            setFileName(""); // 취소 시 초기화
        }
    };

    const handleCancelFile = () => {
        if (formRef.current["file"]) {
            formRef.current["file"].value = ""; // 실제 input 태그의 파일 데이터를 비움
        }
        setFileName(""); // 화면에 표시되는 파일명 상태 초기화
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        if (window.confirm("신고를 접수하시겠습니까?")) {
            ReportWriteApi(formData)
            .then((res) => {
                if (res.data.success) {
                    alert("신고가 정상적으로 접수되었습니다.");
                    navigate("/Community/ReportList");
                }
            });
        }
    };
    return (
        <div className={styles.reportContainer}>
            {/* 좌측 폼 */}
            <form className={styles.reportForm} ref={formRef}>
                <h2>신고하기</h2>

                <label>
                    <span className={styles.required}>*</span>
                    신고 유형
                </label>
                <SearchSelect name="reportType" options={options} className={styles.customWidth}/>

                <label>
                    <span className={styles.required}>*</span>
                    신고 대상 (URL 또는 사용자)
                </label>
                <input
                    type="text"
                    name="targetType"
                    placeholder="URL 또는 사용자 ID"
                />

                <label>
                    <span className={styles.required}>*</span>
                    신고 사유
                </label>
                <input
                    type="text"
                    name="reason"
                    placeholder="간단한 사유"
                />
                
                {/* selectBox로 선택 */}
                <label>
                    <span className={styles.required}>*</span>
                    참가자
                </label>
                <SearchSelect 
                    name="idol.profileId"
                    className={styles.fullWidth} 
                    options={[{ value: "", label: "선택 안함" }, ...idolList]} 
                />
                {/* <label>참가자</label>
                <input
                    type="text"
                    name="idol"
                    placeholder="피해 대상 참가자"
                /> */}

                <label>
                    <span className={styles.required}>*</span>
                    상세 설명
                </label>
                <textarea
                    name="reasonContent"
                    rows="5"
                    className={styles.reportTextarea}
                    placeholder="구체적으로 작성해주세요"
                />

                <div className={styles.fileUpload}>
                <label className={styles.fileLabel}>
                    📎 파일 첨부
                    {/* onChange를 통해 파일 선택 감지 */}
                    <input type="file" name="file" onChange={handleFileChange} />
                </label>

                {fileName && (
                    <div className={styles.fileInfo}>
                        <span className={styles.fileName}>선택됨: {fileName}</span>
                        {/* 취소 버튼 추가 */}
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
                    신고하기
                </button>
            </form>

            {/* 우측 가이드 */}
            <div className={styles.guideBox}>
                <h3>신고 가이드</h3>
                <p>정확한 신고를 위해 아래 내용을 참고해주세요.</p>

                <ul>
                    <li>✔ 문제가 되는 부분을 명확히 작성</li>
                    <li>✔ 가능하면 URL 포함</li>
                    <li>✔ 허위 신고는 제재될 수 있음</li>
                </ul>
            </div>
        </div>
    );
}

export default ReportSave;
