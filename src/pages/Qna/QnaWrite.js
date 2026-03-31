import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QnaWrite.module.css"; // 아래 CSS 참고
import { SaveInput } from "../../components/input/Input";
import { QnaWriteApi } from './QnaApi';

function QnaWrite() {
    const navigate = useNavigate();
    const formRef = useRef(); // form에 접근하기 위한 ref 생성

    const handleSave = async () => {
        const formData = new FormData(formRef.current);
        if (window.confirm("문의사항을 등록하시겠습니까?")) {
            QnaWriteApi(formData).then((res) => {
                if (res.data.success) {
                    alert("문의가 성공적으로 등록되었습니다.");
                    navigate("/Community/QnaList");
                }
            })
        }
    };

    return (
        <div className={styles.writeContainer}>
            {/* form에 ref 연결 및 기본 submit 방지 */}
            <form className={styles.writeForm} 
                ref={formRef} onSubmit={(e) => e.preventDefault()}
            >
                <h2 className={styles.title}>1:1 문의하기</h2>

                <div className={styles.inputSection}>
                    <label htmlFor="qtitle">
                        <span className={styles.required}>*</span>
                        문의 제목
                    </label>
                    <SaveInput
                        id="qtitle"
                        type="text"
                        name="qtitle" // FormData가 인식할 이름
                        className={styles.writeInput}
                        placeholder="문의 제목을 입력해주세요"
                        maxLength="100"
                    />
                </div>

                <div className={styles.inputSection}>
                    <label htmlFor="qcontent">
                        <span className={styles.required}>*</span>
                        문의 상세 내용
                    </label>
                    <textarea
                        id="qcontent"
                        name="qcontent" // FormData가 인식할 이름
                        className={styles.writeTextarea}
                        placeholder="문의하실 내용을 상세히 적어주시면 정확한 답변이 가능합니다."
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button 
                        type="button" 
                        className={styles.cancelBtn} 
                        onClick={() => navigate(-1)}
                    >
                        취소
                    </button>
                    <button 
                        type="button" 
                        className={styles.submitBtn} 
                        onClick={handleSave} // 저장 로직 실행
                    >
                        문의 등록
                    </button>
                </div>
            </form>

            <aside className={styles.guideBox}>
                <h3>문의 안내</h3>
                <p>궁금하신 점이나 불편한 사항을 남겨주시면 관리자가 확인 후 답변해 드립니다.</p>
                <ul>
                    <li>✔ 운영 시간: 평일 10:00 ~ 18:00</li>
                    <li>✔ 주말 및 공휴일은 답변이 늦어질 수 있습니다.</li>
                    <li>✔ 답변 완료 시 목록에서 확인 가능합니다.</li>
                    <li>✔ 개인정보가 포함되지 않도록 유의해주세요.</li>
                </ul>
            </aside>
        </div>
    );
}

export default QnaWrite;