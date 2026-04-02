import React, { useState, useCallback } from "react";
import styles from "./GoodsReviewEditForm.module.css";
import { ReviewUpdateApi } from "../../../../GoodsApi";
import { useToast } from "../../../../../../context/ToastMsg/ToastContext";

export default function ReviewEditForm({ r, setEditingId, setReviews, refreshList }) {
  const [newContent, setNewContent] = useState(r.grcontents);
  const [rating, setRating] = useState(r.rating);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(r.grImg ? `${process.env.REACT_APP_IMG_URL}${r.grImg}` : null);
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("5MB 이하 파일만 가능합니다.");
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewImg(null);
  };

  // 특정 리뷰만 상태에서 교체하는 함수 (useCallback으로 최적화)
  const updateReview = useCallback((updatedItem) => {
      setReviews((prev) =>
          prev.map((item) => (item.grno === updatedItem.grno ? updatedItem : item))
      );
  }, []);

  const handleUpdate = async () => {
    if (!newContent.trim()) return alert("내용을 입력해주세요.");
    const formData = new FormData();
    formData.append("grno", r.grno);
    formData.append("grcontents", newContent);
    formData.append("rating", rating);
    if (selectedFile) {
        // 1. 새로운 파일을 선택한 경우
        formData.append("file", selectedFile);
    } else if (!previewImg) {
        // 2. 기존 이미지도 지우고 새 파일도 선택 안 한 경우 (이미지 삭제 상태)
        // 서버의 dto.getGrImg()를 null로 만들기 위해 빈 값을 전달
        formData.append("grImg", ""); 
    } else {
        // 3. 기존 이미지를 그대로 유지하는 경우
        formData.append("grImg", previewImg);
    }

    ReviewUpdateApi(formData).then((res) => {
        if (res.data?.success) {
          showToast("상품 리뷰가 성공적으로 수정되었습니다.");
          setEditingId(null);
          updateReview(res.data.data);
          //refreshList();
        }
    })
  };

  return (
    <div className={styles.reviewEditForm}>
      {/* 별점 선택 */}
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={num <= rating ? styles.starActive : styles.starInactive}
            onClick={() => setRating(num)}
          >
            ★
          </span>
        ))}
        <span className={styles.ratingScore}>{rating}.0</span>
      </div>

      {/* 텍스트 입력 */}
      <textarea
        className={styles.textarea}
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="수정할 내용을 입력하세요."
      />

      {/* 하단 액션 영역 (등록 폼과 유사한 구조) */}
      <div className={styles.actionRow}>
        <div className={styles.fileLeft}>
          <label className={styles.fileLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
            <span>사진 변경</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
          </label>

          {previewImg && (
            <div className={styles.previewWrapper}>
              <img src={previewImg} alt="미리보기" className={styles.previewThumb} />
              <button className={styles.removeBtn} onClick={handleRemoveFile}>×</button>
            </div>
          )}
        </div>

        <div className={styles.btnGroup}>
          <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>
            취소
          </button>
          <button className={styles.saveBtn} onClick={handleUpdate}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
}
