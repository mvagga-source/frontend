import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import boardCommentStyles from "../../Board/boardComponent/BoardComment.module.css";
import styles from "./GoodsReviewReplyEditDelete.module.css";
import { ReviewDeleteApi, ReviewUpdateApi } from "../GoodsApi";

/**
 * 굿즈 답글 수정 및 삭제
 * @param {*} param0 
 * @returns 
 */
export default function GoodsReviewReplyEditDelete({ child, user, refreshList }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(child.grcontents);

    // 답글 삭제
    const handleDelete = async () => {
        if (!window.confirm("답글을 삭제하시겠습니까?")) return;
        const formData = new FormData();
        formData.append("grno", child.grno);
        
        ReviewDeleteApi(formData).then((res) => {
            if (res.data?.success) {
                alert("답글이 삭제되었습니다.");
                refreshList();
            }
        });
    };

    // 답글 수정 저장
    const handleUpdate = async () => {
        if (!editContent.trim()) return alert("내용을 입력해주세요.");
        
        const formData = new FormData();
        formData.append("grno", child.grno);
        formData.append("grcontents", editContent);

        ReviewUpdateApi(formData).then((res) => {
            if (res.data?.success) {
                //alert("답글이 수정되었습니다.");
                setIsEditing(false);
                refreshList();
            }
        });
    };

    // 삭제된 답글은 보여주지 않음
    if (child.delYn === 'y') return null;

    return (
        <div className={styles.sellerReply}>
            {/* 1. 헤더: 작성자 정보와 날짜만 남김 */}
            <div className={styles.replyHeader}>
                <div className={styles.sellerInfo}>
                    <span className={styles.replyIcon}>ㄴ</span>
                    <span className={styles.sellerName}>{child.member?.id}</span>
                    <span className={styles.sellerBadge}>판매자</span>
                </div>
                <span className={styles.replyDate}>
                    {dayjs(child.crdt).format("YYYY-MM-DD HH:mm:ss")}
                </span>
            </div>

            {/* 2. 본문 영역 */}
            {isEditing ? (
                <div className={styles.editWrapper}>
                    <textarea 
                        className={styles.editTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                </div>
            ) : (
                <p className={styles.replyContent}>{child.grcontents}</p>
            )}

            {/* 3. 하단 액션 버튼 영역 (수정/삭제) */}
            {user && user.id === child.member?.id && (
            <div className={styles.replyActions}>
                    <div className={boardCommentStyles.commentActions}>
                        <span className={boardCommentStyles.actionBtn} onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "취소" : "수정"}
                        </span>
                        <span className={boardCommentStyles.divider}>|</span>
                        {isEditing ? (
                            <span className={boardCommentStyles.actionBtn} onClick={handleUpdate} style={{color: '#00f2ff'}}>저장</span>
                        ) : (
                            <span className={boardCommentStyles.actionBtn} onClick={handleDelete}>삭제</span>
                        )}
                    </div>
            </div>
            )}
        </div>
    );
}