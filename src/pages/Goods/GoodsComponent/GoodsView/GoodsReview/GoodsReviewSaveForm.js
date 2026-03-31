import React, { useState, useEffect } from "react";
import styles from "./GoodsReviewSaveForm.module.css";
import { SaveBtn } from "../../../../../components/button/Button";
import { ReviewWriteApi } from "../../../GoodsApi";

function GoodsReviewSaveForm({ gno, refreshList, setSortType }) {
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(5.0); // 별점 상태 추가
    const [selectedFile, setSelectedFile] = useState(null); // 실제 파일 객체
    const [previewImg, setPreviewImg] = useState(null);    // 미리보기용 URL

    // 파일 선택 핸들러 추가
    const handleFileChange = (e) => {
    const file = e.target.files[0];
        if (file) {
            // 1. 파일 크기 제한 (예: 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("파일 크기는 5MB를 초과할 수 없습니다.");
                return;
            }

            if (previewImg) {
                URL.revokeObjectURL(previewImg);        //코드가 길어짐
            }

            // 3. 미리보기 URL 생성
            /*const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImg(reader.result);
            };
            reader.readAsDataURL(file);*/
            if(file){
                const url = URL.createObjectURL(file);
                setPreviewImg(url);
                // 파일 객체 저장
                setSelectedFile(file);
            }
        }
    };

    // 선택 취소 기능 (미리보기 이미지 클릭 시 삭제 등)
    const handleRemoveFile = () => {
        // 파일 삭제 시 또는 컴포넌트 언마운트 시
        URL.revokeObjectURL(previewImg);   // 메모리 해제
        setSelectedFile(null);
        setPreviewImg(null);
    };

    // 컴포넌트 언마운트 시 메모리 해제
    useEffect(() => {
        // 컴포넌트가 사라질 때 실행되는 clean-up 함수
        return () => {
            if (previewImg) {
                URL.revokeObjectURL(previewImg);
            }
        };
    }, [previewImg]);

    // 리뷰 저장 (별점 데이터 포함)
    const handleSave = async () => {
        if (!newReview.trim()) return alert("리뷰 내용을 입력해주세요.");
        
        const formData = new FormData();
        formData.append("gno", gno);
        formData.append("grcontents", newReview);
        formData.append("rating", rating); // 별점 전송
        if (selectedFile) formData.append("file", selectedFile);
        
        // 등록
        ReviewWriteApi(formData).then((res) => {
            if (res.data?.success) {
                setNewReview(""); // 리뷰 내용 취소
                setRating(5); // 별점 초기화
                handleRemoveFile();
                setSortType("DESC");
                refreshList(); // 새로고침
            }
        })
    };

    return (
        <div className={styles.reviewInputBox}>
            <div className={styles.ratingArea}>
                <span className={styles.ratingLabel}>상품은 어떠셨나요?</span>
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
            </div>
            
            <textarea
                className={styles.textarea}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="구매하신 굿즈의 솔직한 후기를 남겨주세요."
            />

            {/* 버튼들을 한 줄에 정렬하는 컨테이너 */}
            <div className={styles.actionRow}>
                <div className={styles.fileLeft}>
                    <label htmlFor="reviewFile" className={styles.fileLabel}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span>사진 첨부</span>
                    </label>
                    <input type="file" id="reviewFile" accept="image/*" onChange={handleFileChange} className={styles.hiddenInput} />
                    
                    {/* 미리보기 및 삭제 버튼 */}
                    {previewImg && (
                        <div className={styles.previewWrapper}>
                            <img src={previewImg} alt="미리보기" className={styles.previewThumb} />
                            <button className={styles.removeBtn} onClick={handleRemoveFile}>×</button>
                        </div>
                    )}
                </div>

                <div className={styles.submitRight}>
                    <SaveBtn onClick={handleSave}>리뷰 등록</SaveBtn>
                </div>
            </div>
        </div>
    );
}

export default GoodsReviewSaveForm;