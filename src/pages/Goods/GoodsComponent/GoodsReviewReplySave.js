import React, { useState } from "react";
import styles from "./GoodsReviewItem.module.css";
import { ReviewReplyApi } from "../GoodsApi";

/**
 * 굿즈 답글 등록
 * @param {*} param0 
 * @returns 
 */
const GoodsReviewReplyForm = ({ gno, parentGrno, refreshList, isReplying, setIsReplying }) => {
    // 답글 관련 상태 추가
    const [replyContent, setReplyContent] = useState("");

    // 답글 저장 핸들러
    const handleReplySave = async () => {
        if (!replyContent.trim()) return alert("답글 내용을 입력해주세요.");
        
        const formData = new FormData();
        formData.append("gno", gno || ""); // 상품 번호
        formData.append("parent_grno", parentGrno);     // 부모 리뷰 번호(Controller의 @RequestParam)
        formData.append("grcontents", replyContent);
        // 답글은 rating과 file이 없음

        ReviewReplyApi(formData).then((res) => {
            if (res.data?.success) {
                //alert("답글이 등록되었습니다.");
                setReplyContent("");
                setIsReplying(false);
                refreshList();
            }
        });
    };

    return (
        <div className={styles.replyInputWrapper}>
            <textarea
                className={styles.replyTextarea}
                placeholder="판매자 답글을 남겨주세요."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className={styles.replyBtnGroup}>
                <button 
                    className={styles.replyCancelBtn} 
                    onClick={() => setIsReplying(false)}
                >
                    취소
                </button>
                <button 
                    className={styles.replySaveBtn} 
                    onClick={handleReplySave}
                >
                    등록
                </button>
            </div>
        </div>
    );
};

export default GoodsReviewReplyForm;
