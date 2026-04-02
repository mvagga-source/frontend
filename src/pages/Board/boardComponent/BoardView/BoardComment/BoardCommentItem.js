import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BoardCommentItem.module.css";
import { CancelBtn, SaveBtn } from "../../../../../components/button/Button";
import { CommentUpdateApi, CommentDeleteApi, CommentWriteApi } from "../../../BoardApi";
import { useAuth } from "../../../../../context/AuthContext";
import dayjs from "dayjs";

function BoardCommentItem({ comment: c, bno, onRefresh, setComments, getList, ...props }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    // 로컬 상태 관리 (수정 및 답글)
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(c.ccontent);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    // 답글 저장 핸들러
    const handleReplySave = async () => {
        if (!replyContent.trim()) return alert("내용을 입력하세요.");

        const formData = new URLSearchParams();
        formData.append("bno", bno);
        formData.append("ccontent", replyContent);
        // 계층형 데이터 전송 (부모의 정보를 기반으로 생성)
        formData.append("cgroup", c.cgroup);
        formData.append("cstep", c.cstep);
        formData.append("cindent", c.cindent);

        const res = await CommentWriteApi(formData);
        if (res.data?.success) {
            props.setReplyingTo(null);
            setReplyContent("");
            getList(0, false); // 새로고침
        }
    };

    // 수정 저장
    const handleUpdate = async (cno) => {
        const formData = new URLSearchParams();
        formData.append("cno", cno);
        formData.append("ccontent", editContent);
        CommentUpdateApi(formData)
        .then((res) => {
            if (res.data?.success) {
            //alert("수정되었습니다.");
            props.setEditingCno(null); // 수정 모드 종료
            //더보기 방식은 길어질 경우 사용자 불편이 있을 수 있어서
            const updatedComment = res.data.comment;
            setComments((prev) =>
                prev.map((c) => (c.cno === cno ? { ...c, ...updatedComment } : c))
            );
            //getList(0, false);   // 목록 새로고침
            }
        });
    };
    
      // 삭제 요청 (Soft Delete: delyn를 'y'로 변경하도록 서버에 요청)
      const handleDelete = async (cno) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        const formData = new URLSearchParams();
        formData.append("cno", cno);
        CommentDeleteApi(formData)
        .then((res) => {
          if (res.data?.success) {
            //alert("삭제되었습니다.");
            //더보기 방식은 길어질 경우 사용자 불편이 있을 수 있어서
            setComments((prev) =>
              prev.map((c) => (c.cno === cno ? { ...c, delYn: 'y' } : c))
            );
            //getList(0, false);   // 목록 새로고침(적용해도 됨)
          }
        });
      };
    
      // 신고 페이지로 이동하는 함수
      const handleReport = (comment) => {
        if (!user) {
          alert("로그인 후 이용 가능합니다.");
          return;
        }
        
        // 현재 페이지의 전체 경로 (예: /Community/BoardView/123)
        const currentUrl = window.location.pathname;
        
        // 신고 페이지로 이동하면서 대상 정보와 복귀 URL을 쿼리로 전달
        const params = new URLSearchParams();
        params.append("targetUrl", currentUrl);
        //params.append("targetType", "comment");
        params.append("targetIdName", "cno");
        params.append("targetId", comment.cno);
        params.append("author", comment.member?.nickname || "");
    
        navigate(`/Community/ReportWrite?${params.toString()}`);
      };

    return (
        <li className={`${styles.commentItem} ${c.cindent > 0 ? styles.replyItem : ""}`}
            style={{ marginLeft: `${c.cindent * 20}px` }}>
            
            {c.delYn === 'y' ? (
                <div className={styles.deletedWrapper}>
                    <p className={styles.deletedText}>삭제된 댓글입니다.</p>
                </div>
            ) : (
                <>
                    <div className={styles.commentInfo}>
                        <span className={styles.commentAuthor}>{c.member?.nickname}</span>
                        <span className={styles.commentDate}>{dayjs(c.cdate).format("YYYY-MM-DD HH:mm:ss")}</span>
                    </div>

                    {isEditing ? (
                        <div className={styles.replyInputBox}>
                            <textarea 
                                value={editContent} 
                                onChange={(e) => setEditContent(e.target.value)} 
                                className={styles.editArea}
                            />
                            <div className={styles.replyBtns}>
                                <CancelBtn size="xsm" square onClick={() => setIsEditing(false)}>취소</CancelBtn>
                                <SaveBtn size="xsm" square onClick={handleUpdate}>저장</SaveBtn>
                            </div>
                        </div>
                    ) : (
                        <p className={styles.commentContent}>{c.ccontent}</p>
                    )}

                    <div className={styles.commentFooter}>
                        <div className={styles.leftActions}>
                            <button className={styles.footerBtn} onClick={() => setIsReplying(!isReplying)}>답글</button>
                            {user?.id === c.member?.id && (
                                <>
                                    <button className={styles.footerBtn} onClick={() => setIsEditing(true)}>수정</button>
                                    <button className={styles.footerBtn} onClick={handleDelete}>삭제</button>
                                </>
                            )}
                        </div>
                        {user?.id !== c.member?.id && (
                            <button className={`${styles.footerBtn} ${styles.reportBtn}`} onClick={handleReport}>신고</button>
                        )}
                    </div>
                </>
            )}

            {isReplying && (
                <div className={styles.replyInputBox}>
                    <textarea 
                        value={replyContent} 
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 남겨보세요"
                        className={styles.editArea}
                    />
                    <div className={styles.replyBtns}>
                        <CancelBtn size="xsm" square onClick={() => setIsReplying(false)}>취소</CancelBtn>
                        <SaveBtn size="xsm" square onClick={handleReplySave}>저장</SaveBtn>
                    </div>
                </div>
            )}
        </li>
    );
}

export default BoardCommentItem;