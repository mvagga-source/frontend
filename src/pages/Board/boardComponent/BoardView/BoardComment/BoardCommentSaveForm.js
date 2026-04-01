import React, { useState } from "react";
import styles from "./BoardCommentSaveForm.module.css";
import { SaveBtn } from "../../../../../components/button/Button";
import { CommentWriteApi } from "../../../BoardApi";

function BoardCommentSaveForm({ bno, getList }) {
    const [newComment, setNewComment] = useState("");

    // 댓글 저장 로직
    const handleSave = async () => {
      if (!newComment.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
      }
      const formData = new URLSearchParams();
      formData.append("bno", bno);          // Long 값 그대로 문자열로 보내도 OK
      formData.append("ccontent", newComment);
      CommentWriteApi(formData)
      .then((res) => {
        if (res.data?.success) {
          // 댓글 저장 후 새로 리스트 불러오기
          getList(0, false);
          
          // 입력창 초기화
          setNewComment("");
        }
      });
    };

    return (
        <div className={styles.commentInputBox}>
        <textarea
            className={styles.textarea}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요."
        />
        <div className={styles.submitBtn}>
            <SaveBtn onClick={handleSave}>등록</SaveBtn>
        </div>
        </div>
    );
}

export default BoardCommentSaveForm;