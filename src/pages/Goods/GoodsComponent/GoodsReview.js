import React, { useState, useEffect } from "react";
import styles from "./GoodsReview.module.css"; // BoardComment와 유사한 스타일 적용
import { SaveBtn } from "../../../components/button/Button";
import { useAuth } from "../../../context/AuthContext";
import { getReviewListApi, ReviewWriteApi, ReviewUpdateApi, ReviewDeleteApi } from "../GoodsApi";

function GoodsReview({ gno }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(5.0); // 별점 상태 추가
    const [selectedFile, setSelectedFile] = useState(null); // 실제 파일 객체
    const [previewImg, setPreviewImg] = useState(null);    // 미리보기용 URL

    const [lastGrno, setLastGrno] = useState(0);      //마지막 번호
    const [totalCount, setTotalCount] = useState(0);    //댓글 삭제와 답글을 제외한 전체개수
    
    // 추가 상태: 더 가져올 데이터가 있는지 여부와 로딩 상태
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 댓글 리스트 가져오기 (처음 로드나 저장 후 새로 불러오기)
    const getList = async (lastGrno = 0, append = true) => {
        setLoading(true);
        getReviewListApi(gno, 10, lastGrno)
        .then((res) => {
            if (res.data?.success) {
                console.log(res);
                const newReviews = res.data.list || [];
                const totalCount = res.data.totalCount || 0; // 댓글 전체 개수
                const serverLastGroup = res.data.lastGrno || 0; // 다음 기준 그룹
                const isLastPage = res.data.isLast; // 마지막 페이지 여부

                if (append) {
                    setReviews((prev) => [...prev, ...newReviews]);
                } else {
                    setReviews(newReviews);
                }

                // 2. 서버에서 받은 다음 그룹 번호와 마지막 여부 저장
                setLastGrno(serverLastGroup);
                setHasMore(!isLastPage);
                
                // (선택사항) 전체 개수 상태 업데이트
                setTotalCount(totalCount); 
            }
        }).finally(() => {
        setLoading(false);
        });
    };

    // 1. 리뷰 목록 가져오기 (기존 getList 로직과 동일)
    useEffect(() => {
        // [가상 데이터 세팅] CSS 테스트용
        /*const mockReviews = [
        {
            grno: 1,
            grcontents: "디자인이 정말 예뻐요! 네온 블루 라이팅이 밤에 켜두면 분위기 대박입니다. 배송도 생각보다 빨랐어요.",
            rating: 5,
            crdt: "2024-03-15T10:00:00",
            member: { id: "NeonFan_99" },
            reviewImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300", 
            children: [
            {
                grno: 101,
                grcontents: "구매해주셔서 감사합니다! 네온 블루의 매력을 알아봐주셔서 기쁘네요. 예쁘게 사용하세요 💙",
                crdt: "2024-03-15T14:00:00",
                member: { id: "Official_Store" }, // 판매자 ID
            }
            ]
        },
        {
            grno: 2,
            grcontents: "포토카드가 한 장 누락되어서 왔어요... 상품 자체는 만족스러운데 검수 좀 신경 써주세요.",
            rating: 3,
            crdt: "2024-03-14T15:30:00",
            member: { id: "LuckyUser" },
            children: [] // 답글 없음
        },
        {
            grno: 3,
            grcontents: "실물이 훨씬 영롱합니다. 한정판이라 고민했는데 사길 잘했네요!",
            rating: 5,
            crdt: "2024-03-12T09:15:00",
            member: { id: "Collector_K" },
            reviewImg: "https://images.unsplash.com/photo-1593305841993-f11277132603?q=80&w=300",
            children: []
        },
        {
            grno: 4,
            grcontents: "생각보다 크기가 작네요. 상세 사이즈를 잘 볼 걸 그랬어요. 그래도 퀄리티는 좋습니다.",
            rating: 4,
            crdt: "2024-03-10T11:00:00",
            member: { id: "SizeChecker" },
            children: []
        },
        {
            grno: 5,
            grcontents: "배송 중 박스가 약간 찌그러져서 왔어요 ㅜㅜ 내부는 멀쩡해서 다행이지만 기분이 좀 그렇네요.",
            rating: 3,
            crdt: "2024-03-08T17:20:00",
            member: { id: "BoxCollector" },
            children: [
            {
                grno: 102,
                grcontents: "배송 중 불편을 드려 죄송합니다. 택배사에 주의 요청하겠습니다. 너른 양해 부탁드립니다.",
                crdt: "2024-03-09T09:00:00",
                member: { id: "Official_Store" },
            }
            ]
        },
        {
            grno: 6,
            grcontents: "응원봉 전용 파우치도 같이 팔면 좋겠어요! 들고 다니기 약간 불안하네요.",
            rating: 4,
            crdt: "2024-03-05T13:10:00",
            member: { id: "PouchNeed" },
            children: []
        }
        ];
        setTimeout(() => {
        setReviews(mockReviews);
        }, 300);*/

        // 리뷰 리스트 새로고침
        if (gno) {
            getList(0, false); 
        }
    }, [gno]);

    // 2. 리뷰 저장 (별점 데이터 포함)
    const handleSave = async () => {
        if (!newReview.trim()) return alert("리뷰 내용을 입력해주세요.");
        
        const formData = new URLSearchParams();
        formData.append("gno", gno);
        formData.append("grcontents", newReview);
        formData.append("rating", rating); // 별점 전송
        if (selectedFile) formData.append("file", selectedFile);
        
        // 등록
        ReviewWriteApi(formData).then((res) => {
            if (res.data?.success) {
                setNewReview(""); // 리뷰 내용 취소
                setRating(5); // 별점 초기화
                getList(0, false); // 새로고침
            }
        })
    };

    // 파일 선택 핸들러 추가
    const handleFileChange = (e) => {
    const file = e.target.files[0];
        if (file) {
            // 1. 파일 크기 제한 (예: 5MB)
            if (file.size > 5 * 1024 * 1024) {
            alert("파일 크기는 5MB를 초과할 수 없습니다.");
            return;
            }

            // 2. 파일 객체 저장
            setSelectedFile(file);

            // 3. 미리보기 URL 생성
            const reader = new FileReader();
            reader.onloadend = () => {
            setPreviewImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 선택 취소 기능 (미리보기 이미지 클릭 시 삭제 등)
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewImg(null);
    };

    // 리뷰 추천(도움돼요) 핸들러
    const handleLike = async (grno) => {
        if (!user) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }

        // 1. 상태 업데이트 (UI 즉시 반영 - 낙관적 업데이트)
        setReviews(prevReviews => 
            prevReviews.map(r => {
            if (r.grno === grno) {
                const isLiked = !r.isLiked; // 현재 상태 반전
                return {
                    ...r,
                    isLiked: isLiked,
                    likeCnt: isLiked ? (r.likeCnt || 0) + 1 : Math.max(0, (r.likeCnt || 1) - 1)
                };
            }
            return r;
            })
        );

        // 2. API 호출 (실제 DB 반영)
        try {
            // const res = await saveReviewLikeApi(grno, user.id);
            // if (!res.data.success) { 
            //   /* 실패 시 원래 상태로 복구하는 로직 추가 가능 */ 
            //   alert("처리 중 오류가 발생했습니다.");
            // }
            console.log(`리뷰 ${grno}번에 도움돼요 처리 완료`);
        } catch (error) {
            console.error("Like API Error:", error);
        }
    };

    return (
        <div className={styles.reviewSection}>
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

        {/* 리뷰 리스트 영역 */}
        <div className={styles.listContainer}>
            <h3 className={styles.listTitle}>전체 리뷰 ({reviews.length})</h3>
            <ul className={styles.reviewList}>
            {reviews.map((r) => (
                <li key={r.grno} className={styles.reviewItem}>
                {/* 일반 리뷰 메인 영역 */}
                <div className={styles.reviewMain}>
                    <div className={styles.reviewHeader}>
                    <div className={styles.userInfo}>
                        <span className={styles.author}>{r.member?.id}</span>
                        {/* 3. 별점 색상 통일 (CSS 클래스 적용) */}
                        <span className={styles.itemRating}>
                        {"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}
                        </span>
                    </div>
                    <span className={styles.date}>{new Date(r.crdt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className={styles.reviewBody}>
                    <p className={styles.content}>{r.grcontents}</p>
                    {/* 1. 포토 리뷰 이미지 표시 */}
                    {r.reviewImg && (
                        <div className={styles.reviewThumb}>
                        <img src={r.reviewImg} alt="리뷰사진" onClick={() => window.open(r.reviewImg)} />
                        </div>
                    )}
                    </div>
                    {/* 👍 도움돼요 버튼 추가 */}
                    <div className={styles.reviewActions}>
                    <button 
                        className={`${styles.helpBtn} ${r.isLiked ? styles.active : ""}`}
                        onClick={() => handleLike(r.grno)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={r.isLiked ? "#facc15" : "none"} stroke="#facc15" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                        </svg>
                        <span>도움돼요</span>
                        {r.likeCnt > 0 && <strong className={styles.likeCount}>{r.likeCnt}</strong>}
                    </button>
                    </div>
                </div>

                {/* 2. 판매자 답글 영역 (들여쓰기 레이아웃) */}
                {r.children && r.children.map(child => (
                    <div key={child.grno} className={styles.sellerReply}>
                    <div className={styles.replyHeader}>
                        <div className={styles.sellerInfo}>
                        <span className={styles.replyIcon}>ㄴ</span>
                        <span className={styles.sellerName}>{child.member?.id}</span>
                        <span className={styles.sellerBadge}>판매자</span>
                        </div>
                        <span className={styles.replyDate}>{new Date(child.crdt).toLocaleDateString()}</span>
                    </div>
                    <p className={styles.replyContent}>{child.grcontents}</p>
                    </div>
                ))}
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
}

export default GoodsReview;