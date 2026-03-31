import React, { useState, useCallback } from "react";
import styles from "./GoodsReviewReplySave.module.css";
import { ReviewReplyApi } from "../../../../GoodsApi";

/**
 * 굿즈 답글 등록
 * @param {*} param0 
 * @returns 
 */
const GoodsReviewReplyForm = ({ gno, parentGrno, refreshList, isReplying, setReviews, setIsReplying }) => {
    // 답글 관련 상태 추가
    const [replyContent, setReplyContent] = useState("");

    // 특정 리뷰(parent)의 children에 새 답글을 추가하는 함수
    const addReplyToList = useCallback((newReply) => {
        // 1. newReply가 제대로 왔는지 확인
        if (!newReply) return;

        setReviews((prev) =>
            prev.map((item) => {
                // 2. 서버 DTO 구조상 부모 ID는 newReply.parent.grno에 있을 가능성이 큼
                // 만약 API에서 parent_grno를 따로 보내주지 않는다면 아래와 같이 접근
                const parentId = newReply.parent?.grno;

                if (item.grno === parentId) {
                    return {
                        ...item,
                        // 기존 children에 새 답글 추가 (불변성 유지)
                        children: [...(item.children || []), newReply],
                    };
                }
                return item;
            })
        );
    }, []);

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
                const savedData = res.data.data;
        
                // 만약 서버 응답에 parent 정보가 빠져있다면 수동으로 넣어줌 (안전장치)
                if (!savedData.parent && parentGrno) {
                    savedData.parent = { grno: parentGrno };
                }
                setReplyContent("");
                setIsReplying(false);
                
                // 이제 안전하게 전달
                addReplyToList(savedData);
                //refreshList();
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
