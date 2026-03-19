import React, { useState } from "react";
import styles from "./BoardComment.module.css";
import { NeonBtn } from "../../components/button/Button";
import { getCommentListApi, CommentWriteApi } from "./BoardApi";

function BoardComment({ bno }) {
  const [comments, setComments] = useState([]);    //수정예정
  const [newComment, setNewComment] = useState("");
  
  // 추가 상태: 더 가져올 데이터가 있는지 여부와 로딩 상태
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 댓글 리스트 가져오기 (처음 로드나 저장 후 새로 불러오기)
  const getList = async (lastCno = 0, append = true) => {
    try {
      setLoading(true);
      const response = await getCommentListApi(bno, 10, lastCno);
      const newComments = response.data.data.list || [];

      if (append) {
        setComments((prev) => [...prev, ...newComments]);
      } else {
        setComments(newComments);
      }

      // 가져온 데이터가 요청한 size보다 적으면 더 이상 데이터 없음
      if (newComments.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("댓글 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 더보기 클릭
  const handleMore = () => {
    if (loading || !hasMore) return;
    const lastCno = comments.length > 0 ? comments[comments.length - 1].cno : 0;
    getList(lastCno, true);
  };

  // 댓글 저장 로직
  const handleSave = async () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    const formData = new URLSearchParams();
    formData.append("bno", bno);          // Long 값 그대로 문자열로 보내도 OK
    formData.append("ccontent", newComment);
    const response = await CommentWriteApi(formData);
    if (response.data && response.data.success) {
      // 댓글 저장 후 새로 리스트 불러오기
      getList(0, false);
      
      // 입력창 초기화
      setNewComment("");
    }
  };

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentTitle}>Comments ({comments.length})</h3>
      
      {/* 댓글 작성창 */}
      <div className={styles.commentInputBox}>
        <textarea
          className={styles.textarea}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요."
        />
        <div className={styles.submitBtn}>
          <NeonBtn onClick={handleSave}>등록</NeonBtn>
        </div>
      </div>

      {/* 댓글 리스트 */}
      <ul className={styles.commentList}>
        {comments.map((c) => (
          <li key={c.cno} className={styles.commentItem}>
            <div className={styles.commentInfo}>
              <span className={styles.commentAuthor}>{c.member.id}</span>
              <span className={styles.commentDate}>{new Date(c.cdate).toLocaleString()}</span>
            </div>
            <p className={styles.commentContent}>{c.ccontent}</p>
          </li>
        ))}
      </ul>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className={styles.moreBtnContainer} style={{ textAlign: 'center', marginTop: '20px' }}>
          <NeonBtn onClick={handleMore}>
            {loading ? "로딩 중..." : "댓글 더보기"}
          </NeonBtn>
        </div>
      )}
    </div>
  );
}

export default BoardComment;