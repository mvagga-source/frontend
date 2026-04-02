import React, { useState, useEffect, useRef, useCallback } from "react";
import dayjs from "dayjs";
import styles from "./GoodsReviewReplyEditDelete.module.css";
import { ReviewDeleteApi, ReviewUpdateApi } from "../../../../GoodsApi";
import { useToast } from "../../../../../../context/ToastMsg/ToastContext";

/**
 * 굿즈 답글 수정 및 삭제
 * @param {*} param0 
 * @returns 
 */
export default function GoodsReviewReplyEditDelete({ child, user, setReviews, refreshList }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(child.grcontents);
    const { showToast } = useToast();

    // 답글 수정/삭제 전용 업데이트 함수
    const updateReplyInList = useCallback((updatedReply, isDelete = false) => {
    setReviews((prev) =>
        prev.map((item) => {
                // 해당 부모 리뷰 안에 수정/삭제하려는 답글이 있는지 확인
                const hasChild = item.children?.some((c) => c.grno === updatedReply.grno);
                
                if (hasChild) {
                    return {
                        ...item,
                        children: isDelete
                            ? item.children.filter((c) => c.grno !== updatedReply.grno) // 삭제
                            : item.children.map((c) => (c.grno === updatedReply.grno ? { ...c, ...updatedReply } : c)) // 수정
                    };
                }
                return item;
            })
        );
    }, [setReviews]);

    // 답글 삭제
    const handleDelete = async () => {
        if (!window.confirm("답글을 삭제하시겠습니까?")) return;
        const formData = new FormData();
        formData.append("grno", child.grno);
        
        ReviewDeleteApi(formData).then((res) => {
            if (res.data?.success) {
                //alert("답글이 삭제되었습니다.");
                showToast("상품 리뷰에 대한 답글이 삭제되었습니다.");
                updateReplyInList(child, true);
                //refreshList();
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
                showToast("상품 리뷰에 대한 답글이 수정되었습니다.");
                // 서버에서 받은 최신 데이터(res.data.data)로 리스트 업데이트
                const updatedData = res.data.data;
                
                // 만약 서버 데이터에 parent 정보가 없으면 child에서 보정
                if (!updatedData.parent) updatedData.parent = child.parent;
                updateReplyInList(res.data.data, false);
                
                setIsEditing(false);
                //refreshList();
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
                    <span className={styles.sellerName}>{child.member?.nickname}</span>
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
                    <div className={styles.commentActions}>
                        <span className={styles.actionBtn} onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "취소" : "수정"}
                        </span>
                        <span className={styles.divider}>|</span>
                        {isEditing ? (
                            <span className={styles.actionBtn} onClick={handleUpdate} style={{color: '#00f2ff'}}>저장</span>
                        ) : (
                            <span className={styles.actionBtn} onClick={handleDelete}>삭제</span>
                        )}
                    </div>
            </div>
            )}
        </div>
    );
}
