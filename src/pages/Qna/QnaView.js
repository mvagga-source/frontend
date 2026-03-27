import React, { useState, useEffect } from "react";
import styles from "./QnaView.module.css";
import { getQnaViewApi, QnaDeleteApi } from "./QnaApi"; // API 함수 정의 필요
import dayjs from "dayjs";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const QnaView = () => {
    const navigate = useNavigate();
    const [qna, setQna] = useState(null);
    const [loading, setLoading] = useState(true);
    const { qno } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        if (!qno) return;
        getQnaViewApi(qno)
        .then((res) => {
        if (res.data.success) {
            setQna(res.data.data);
        }
        })
        .finally(() => setLoading(false));
    }, [qno]);

    // 삭제 핸들러
    const handleDelete = () => {
        if (window.confirm("정말 이 문의글을 삭제하시겠습니까?")) {
            const formData = new FormData();
            formData.append("qno", qno);
            QnaDeleteApi(formData).then((res) => {
                if (res.data.success) {
                    alert("삭제되었습니다.");
                    navigate("/Community/QnaList");
                }
            });
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className={styles.container}>
        {/* 상단 버튼 레이아웃 */}
        <div className={styles.buttonWrapper}>
            <button onClick={() => navigate("/Community/QnaList")} className={styles.listBtn}>
            목록으로
            </button>
            
            {/* 작성자 본인이고, 답변 대기 상태일 때만 버튼 노출 */}
            {user?.id === qna?.member?.id && qna?.status === "답변대기" && (
            <div className={styles.adminBtns}>
                <button onClick={() => navigate(`/Community/QnaUpdate/${qno}`)} className={styles.editBtn}>
                수정
                </button>
                <button onClick={handleDelete} className={styles.deleteBtn}>
                삭제
                </button>
            </div>
            )}
        </div>
        
        <div className={styles.questionSection}>
        <div className={styles.header}>
            {/* 왼쪽: 상태와 제목 */}
            <div className={styles.titleWrapper}>
            <span className={`${styles.statusTag} ${qna.status === "답변완료" ? styles.done : ""}`}>
                {qna.status}
            </span>
            <h2 className={styles.title}>{qna.qtitle}</h2>
            </div>

            {/* 오른쪽: 작성일 */}
            <span className={styles.date}>
            작성일: {dayjs(qna.crdt).format("YYYY-MM-DD HH:mm")}
            </span>
        </div>
        
        <div className={styles.content}>{qna.qcontent}</div>
        </div>

        <div className={styles.divider} />

        <div className={styles.answerSection}>
            {qna.answerContent ? (
            <>
                <div className={styles.answerHeader}>
                <strong>관리자 답변</strong>
                <span className={styles.date}>
                    {dayjs(qna.updt).format("YYYY-MM-DD HH:mm")}
                </span>
                </div>
                <div className={styles.answerContent}>
                {qna.answerContent}
                </div>
            </>
            ) : (
            <div className={styles.emptyAnswer}>
                문의하신 내용을 검토 중입니다. 곧 답변을 드리겠습니다.
            </div>
            )}
        </div>
        </div>
    );
};

export default QnaView;