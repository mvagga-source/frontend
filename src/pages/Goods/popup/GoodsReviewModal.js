import React, { useState, useEffect } from "react";
import styles from "./GoodsReviewModal.module.css";
import { ReviewWriteApi, ReviewUpdateApi, getGoodsReviewDetailApi } from "../GoodsApi";

/**
 * 리뷰 등록 및 수정 팝업
 * 기존에 존재하면 수정으로 진행
 */
function GoodsReviewModal({ gno, gono, onClose, refreshList }) {
    const [reviewData, setReviewData] = useState(null);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (gono) {
            setLoading(true);
            getGoodsReviewDetailApi(gono)
                .then((res) => {
                    if (res.data?.success) {
                        if (res.data && res.data.data.grno) {
                            // 리뷰가 이미 존재함 -> 수정 모드 세팅
                            const data = res.data.data;
                            setReviewData(data);
                            setContent(data.grcontents || "");
                            setRating(data.rating || 5);
                            setPreviewImg(data.grImg || null);
                        } else {
                            // 리뷰가 없음 -> 등록 모드 (초기값 유지)
                            setReviewData(null);
                        }
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [gono]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return alert("파일 크기는 5MB를 초과할 수 없습니다.");
            setPreviewImg(URL.createObjectURL(file));
            setSelectedFile(file);
        }
    };

    // 파일 삭제 핸들러
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewImg(null); // previewImg를 null로 만들어 서버에 삭제 신호를 보냄
    };

    const handleSave = async () => {
        if (!content.trim()) return alert("리뷰 내용을 입력해주세요.");
        if (loading) return;

        setLoading(true);
        const formData = new FormData();
        //formData.append("gno", gno);
        formData.append("grcontents", content);
        formData.append("rating", rating);

        // --- 파일/이미지 처리 로직 (기존 수정 폼 방식 적용) ---
        if (selectedFile) {
            // 1) 새로운 파일을 선택한 경우
            formData.append("file", selectedFile);
        } else if (!previewImg) {
            // 2) 기존 이미지도 지우고 새 파일도 선택 안 한 경우 (삭제)
            formData.append("grImg", ""); 
        } else {
            // 3) 기존 이미지를 그대로 유지하는 경우 (문자열 전송)
            formData.append("grImg", previewImg);
        }
        
        if (gono && !reviewData) formData.append("order.gono", gono);
        if (reviewData) formData.append("grno", reviewData.grno);
        //if (selectedFile) formData.append("file", selectedFile);

        const apiCall = reviewData ? ReviewUpdateApi : ReviewWriteApi;
        apiCall(formData)
            .then((res) => {
                if (res.data?.success) {
                    alert(reviewData ? "수정되었습니다." : "리뷰가 등록되었습니다.");
                    //refreshList();
                    onClose();
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>리뷰 {reviewData ? "수정하기" : "작성하기"}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.ratingArea}>
                        <span className={styles.ratingLabel}>상품은 어떠셨나요?</span>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span 
                                    key={num} 
                                    className={num <= rating ? styles.starActive : styles.starInactive}
                                    onClick={() => setRating(num)}
                                >★</span>
                            ))}
                            <span className={styles.ratingScore}>{rating}.0</span>
                        </div>
                    </div>

                    <textarea
                        className={styles.textarea}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="구매하신 굿즈의 솔직한 후기를 남겨주세요."
                    />

                    <div className={styles.actionRow}>
                        <div className={styles.fileLeft}>
                            <label htmlFor="modalFile" className={styles.fileLabel}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                                </svg>
                                <span>사진 첨부</span>
                            </label>
                            <input type="file" id="modalFile" accept="image/*" onChange={handleFileChange} className={styles.hiddenInput} />
                            
                            {previewImg && (
                                <div className={styles.previewWrapper}>
                                    <img src={previewImg} alt="미리보기" className={styles.previewThumb} />
                                    <button className={styles.removeBtn} onClick={handleRemoveFile}>&times;</button>
                                </div>
                            )}
                        </div>

                        <div className={styles.footerBtns}>
                            {/* <button className={styles.cancelBtn} onClick={onClose}>취소</button> */}
                            <button className={styles.submitBtn} onClick={handleSave} disabled={loading}>
                                {reviewData ? "수정" : "리뷰 등록"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoodsReviewModal;