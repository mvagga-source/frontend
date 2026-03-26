import React, { useState, useEffect, memo } from "react";
import GoodsReviewStyles from "./GoodsReview.module.css";
import boardCommentStyles from "../../Board/boardComponent/BoardComment.module.css";
import styles from "./GoodsReviewItem.module.css";
import dayjs from "dayjs";
import { ReviewDeleteApi, GoodsReviewLikeSaveApi, ReviewReplyApi } from "../GoodsApi";
import ReviewEditForm from "./GoodsReviewEditForm";
import GoodsReviewReplyEditDelete from "./GoodsReviewReplyEditDelete";
import GoodsReviewReplyForm from "./GoodsReviewReplySave";

/**
 * 굿즈 리뷰 목록의 상세(개별 댓글) 리뷰
 * 수정 | 삭제
 * 도움돼요
 */
const GoodsReviewItem = memo(({ r, user, sellerId, editingId, setEditingId, refreshList }) => {
    const [likeCnt, setLikeCnt] = useState(r.likeCnt || 0);
    const [isLiked, setIsLiked] = useState(r.liked || false);   //서버에서는 isLiked로 보이지만 liked로 가져와짐

    // 답글 등록 관련 상태 추가
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        setIsLiked(r.liked || false);
        setLikeCnt(r.likeCnt || 0);
    }, [r.liked, r.likeCnt]);

    // 도움돼요
    const handleLike = () => {
        if (!user) return alert("로그인 후 이용 가능합니다.");
        const formData = new FormData();
        formData.append("grno", r.grno);
        GoodsReviewLikeSaveApi(formData).then((res) => {
            if (res.data?.success) {
                setIsLiked(!isLiked);
                setLikeCnt(!isLiked ? likeCnt + 1 : Math.max(0, likeCnt - 1));
                //refreshList();
            }
        });
    };

    // 댓글 삭제
    const handleDelete = async () => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        const formData = new FormData();
        formData.append("grno", r.grno);
        ReviewDeleteApi(formData).then((res) => {
            if (res.data?.success) {
                alert("삭제되었습니다.");
                refreshList();
            }
        });
    };

    //삭제된 경우 작성자에 의해 삭제되었습니다.로 표기
    if (r.delYn === 'y') {
        return (
            <>
            <li className={`${styles.reviewItem} ${styles.deletedReview}`}>
                <div className={styles.deletedMessage}>
                    <span className={styles.deletedIcon}>🚫</span> 
                    작성자에 의해 삭제된 리뷰입니다.
                </div>
                
            </li>
            {/* 삭제된 글이라도 답글이 있다면 보여줌 */}
            {r.children?.map(child => (
                <GoodsReviewReplyEditDelete key={child.grno} child={child} user={user} refreshList={refreshList} />
            ))}
            </>
        );
    }

    //작성자에 의해 삭제되지 않은 경우
    return (
    <li className={styles.reviewItem}>
      {editingId === r.grno ? (
        <ReviewEditForm r={r} setEditingId={setEditingId} refreshList={refreshList} />
      ) : (
        <>
          <div className={styles.reviewHeader}>
            <div className={styles.userInfo}>
              <span className={styles.author}>{r.member?.id}</span>
              <span className={styles.itemRating}>
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </span>
            </div>
            <span className={styles.date}>{dayjs(r.crdt).format("YYYY-MM-DD HH:mm:ss")}</span>
          </div>

          <div className={styles.reviewBody}>
            <p className={styles.content}>{r.grcontents}</p>
            {r.grImg && (
              <div className={styles.reviewThumb}>
                <img src={r.grImg} alt="리뷰사진" onClick={() => window.open(r.grImg)} />
              </div>
            )}
          </div>

          <div className={styles.reviewActions}>
                {/* 왼쪽 영역 */}
                <button 
                    className={`${styles.helpBtn} ${isLiked ? styles.active : ""}`} 
                    onClick={handleLike}
                >
                    👍 도움돼요 {likeCnt > 0 && <strong className={styles.likeCount}>{likeCnt}</strong>}
                </button>

                {/* 오른쪽 영역: 이제 styles.rightActions로 통합 제어 */}
                <div className={styles.rightActions}>
                    {/* 1. 판매자 답글 권한 (이미 답글이 없을 때만 노출) */}
                    {user && user.id === sellerId && !r.children?.some(c => c.delYn === 'n') && (
                        <>
                            <span className={styles.actionBtn} onClick={() => setIsReplying(!isReplying)}>
                                {isReplying ? "취소" : "답글"}
                            </span>
                            {user.id === r.member?.id && <span className={styles.divider}>|</span>}
                        </>
                    )}

                    {/* 2. 본인 글 수정/삭제 권한 */}
                    {user && user.id === r.member?.id && (
                        <>
                            <span className={styles.actionBtn} onClick={() => setEditingId(r.grno)}>수정</span>
                            <span className={styles.divider}>|</span>
                            <span className={styles.actionBtn} onClick={handleDelete}>삭제</span>
                        </>
                    )}
                </div>
            </div>
        </>
      )}

        {/* 답글 입력창 (토글) */}
        {isReplying && (
            <GoodsReviewReplyForm 
                gno={r.goods?.gno}
                parentGrno={r.grno}
                refreshList={refreshList}
                isReplying={isReplying}
                setIsReplying={setIsReplying}
            />
        )}

      {/* 판매자 답글 목록 */}
      {r.children?.map(child => (
        <GoodsReviewReplyEditDelete key={child.grno} child={child} user={user} refreshList={refreshList} />
      ))}
    </li>
  );
});

export default GoodsReviewItem;
