import React, { useState } from "react";
import styles from "./Report.module.css";
import { SearchSelect } from "../../components/SelectBox/SelectBox";

function Report() {
    const [form, setForm] = useState({
        type: "",
        target: "",
        reason: "",
        detail: "",
        file: null
    });

    const option = [
        { value: "abuse", label: "비방/욕설" },
        { value: "spam", label: "도배/스팸" },
        { value: "etc", label: "기타" }
    ];

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        alert("신고가 접수되었습니다.");
    };

    return (
        <div className={styles.reportContainer}>
            {/* 좌측 폼 */}
            <form className={styles.reportForm} onSubmit={handleSubmit}>
                <h2>신고하기</h2>

                <label>신고 유형</label>
                <SearchSelect name="ReportType" options={option} className={styles.customWidth}/>

                <label>신고 대상 (URL 또는 사용자)</label>
                <input
                    type="text"
                    name="target"
                    placeholder="URL 또는 사용자 ID"
                    onChange={handleChange}
                />

                <label>신고 사유</label>
                <input
                    type="text"
                    name="reason"
                    placeholder="간단한 사유"
                    onChange={handleChange}
                />

                <label>상세 설명</label>
                <textarea
                    name="detail"
                    rows="5"
                    className={styles.reportTextarea}
                    placeholder="구체적으로 작성해주세요"
                    onChange={handleChange}
                />

                <div className={styles.fileUpload}>
                <label className={styles.fileLabel}>
                    📎 파일 첨부
                    <input type="file" name="file" onChange={handleChange} />
                </label>

                {form.file && (
                    <span className={styles.fileName}>{form.file.name}</span>
                )}
                </div>

                <button type="submit" className={styles.submitBtn}>
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

export default Report;
