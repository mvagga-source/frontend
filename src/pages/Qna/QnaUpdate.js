import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./QnaWrite.module.css"; // 아래 CSS 참고
import { SaveInput } from "../../components/input/Input";
import { QnaUpdateApi, getQnaViewApi } from './QnaApi';
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";

function QnaUpdate() {
    const navigate = useNavigate();
    const formRef = useRef(); // form에 접근하기 위한 ref 생성
    const { qno } = useParams();
    const { user } = useAuth();
    const [qna, setQna] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. 기존 데이터 불러오기
    useEffect(() => {
        if (!qno) return;
        getQnaViewApi(qno)
            .then((res) => {
                if (res.data.success) {
                    const data = res.data.data;
                    // 이미 답변이 달린 경우 수정 방지 (보안)
                    if (data.status === "답변완료") {
                        alert("답변이 완료된 문의는 수정할 수 없습니다.");
                        navigate(-1);
                        return;
                    }
                    setQna(data);
                }
            })
            .catch(err => console.error("데이터 로드 실패", err))
            .finally(() => setLoading(false));
    }, [qno, navigate]);

    const handleUpdate = async () => {
        const formData = new FormData(formRef.current);
        formData.append("qno", qno);
        if (window.confirm("문의사항을 수정하시겠습니까?")) {
            QnaUpdateApi(formData).then((res) => {
                if (res.data.success) {
                    alert("문의가 성공적으로 수정되었습니다.");
                    navigate("/Community/QnaView/"+qno);
                }
            })
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className={styles.writeContainer}>
            {/* form에 ref 연결 및 기본 submit 방지 */}
            <form className={styles.writeForm} 
                ref={formRef} onSubmit={(e) => e.preventDefault()}
            >
                <h2 className={styles.title}>1:1 문의 수정</h2>

                <div className={styles.inputSection}>
                    <label htmlFor="qtitle">문의 제목</label>
                    <SaveInput
                        id="qtitle"
                        type="text"
                        name="qtitle"
                        className={styles.writeInput}
                        placeholder="문의 제목을 입력해주세요"
                        maxLength="100"
                        defaultValue={qna?.qtitle} // 기존 제목 채우기
                    />
                </div>

                <div className={styles.inputSection}>
                    <label htmlFor="qcontent">문의 상세 내용</label>
                    <textarea
                        id="qcontent"
                        name="qcontent"
                        className={styles.writeTextarea}
                        placeholder="문의하실 내용을 상세히 적어주시면 정확한 답변이 가능합니다."
                        defaultValue={qna?.qcontent} // 기존 내용 채우기
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
                        onClick={handleUpdate} // 저장 로직 실행
                    >
                        문의 수정
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

export default QnaUpdate;