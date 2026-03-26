import React, { useState, useEffect, useCallback } from "react";
import styles from "./GoodsReview.module.css"; // BoardComment와 유사한 스타일 적용
import { SaveBtn } from "../../../components/button/Button";
import { useAuth } from "../../../context/AuthContext";
import { getReviewListApi, ReviewWriteApi, ReviewUpdateApi, ReviewDeleteApi } from "../GoodsApi";
import dayjs from "dayjs";
import boardCommentStyles from "../../Board/boardComponent/BoardComment.module.css";
import GoodsReviewItem from "./GoodsReviewItem";
import GoodsReviewSort from "./GoodsReviewSort";

/**
 * 굿즈 리뷰 목록
 * @param {*} param0 
 * @returns 
 */
function GoodsReview({ gno, sellerId }) {
    //가상스크롤 적용은 사용X(리뷰가 많아지는 경우 적용 필요)
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(5.0); // 별점 상태 추가
    const [selectedFile, setSelectedFile] = useState(null); // 실제 파일 객체
    const [previewImg, setPreviewImg] = useState(null);    // 미리보기용 URL

    const [lastGrno, setLastGrno] = useState(0);      //마지막 번호
    const [lastLikeCnt, setLastLikeCnt] = useState(0); // 되움되요 정렬
    const [lastRating, setLastRating] = useState(0.0); // 평점순 정렬
    const [totalCount, setTotalCount] = useState(0);    //댓글 삭제와 답글을 제외한 전체개수
    
    // 추가 상태: 더 가져올 데이터가 있는지 여부와 로딩 상태
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 수정 중인 리뷰 grno
    const [editingId, setEditingId] = useState(null);

    // 정렬 상태 추가
    const [sortType, setSortType] = useState("DESC");

    // 정렬 변경 핸들러
    const handleSortChange = (type) => {
        if (sortType === type) return;
        setSortType(type);
        setReviews([]); // 기존 리스트 초기화
        setLastGrno(0); // 페이징 초기화
        setLastLikeCnt(0); // 초기화
        setLastRating(0);  // 초기화
    };

    // 댓글 리스트 가져오기 (처음 로드나 저장 후 새로 불러오기)
    const getList = async (lastGrno = 0, lastLikeCnt = 0, lastRating = 0, append = true) => {
        setLoading(true);
        getReviewListApi(gno, 10, lastGrno, sortType, lastLikeCnt, lastRating)
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
                setLastLikeCnt(res.data.lastLikeCnt || 0); // 마지막 도운되요 순 정렬용
                setLastRating(res.data.lastRating || 0);   // 마지막 별점순 순 정렬용
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
            grImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300", 
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
            grImg: "https://images.unsplash.com/photo-1593305841993-f11277132603?q=80&w=300",
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
            getList(0, 0, 0, false); 
        }
    }, [gno, sortType]);

    // 더보기 클릭 핸들러
    const handleMore= useCallback(() => {
        if (loading || !hasMore) return;
        // 현재 상태의 lastGrno를 사용하여 다음 데이터 호출
        getList(lastGrno, lastLikeCnt, lastRating, true);
    },[loading, hasMore, lastGrno, lastLikeCnt, lastRating]);

    // 자식에게 전달할 리프레시 함수
    const refreshList = useCallback(() => {
        getList(0, 0, 0, false);
    }, [getList]);

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

    // 컴포넌트 언마운트 시 메모리 해제
    useEffect(() => {
        // 컴포넌트가 사라질 때 실행되는 clean-up 함수
        return () => {
            if (previewImg) {
                URL.revokeObjectURL(previewImg);
            }
        };
    }, [previewImg]);

    // 선택 취소 기능 (미리보기 이미지 클릭 시 삭제 등)
    const handleRemoveFile = () => {
        // 파일 삭제 시 또는 컴포넌트 언마운트 시
        URL.revokeObjectURL(previewImg);   // 메모리 해제
        setSelectedFile(null);
        setPreviewImg(null);
    };

    return (
        <>
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
            {/* 정렬 옵션 그룹 */}
            <GoodsReviewSort totalCount={totalCount} sortType={sortType} onSortChange={handleSortChange} />
            {/* 리뷰리스트 */}
            <ul className={styles.reviewList}>
            {reviews.map((r) => (
                // 리뷰 개별 컴포넌트
                <GoodsReviewItem
                    key={r.grno}
                    r={r}
                    user={user}
                    sellerId={sellerId}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    refreshList={refreshList}
                />
            ))}
            </ul>
        </div>
        </div>
        {/* [추가] BoardComment에서 가져온 네온 더보기 버튼 */}
        {hasMore && (
            <div 
            className={`${boardCommentStyles.moreBtnBar} ${loading ? boardCommentStyles.loading : ""}`} 
            onClick={handleMore}
            >
            {loading ? (
                <>
                <div className={boardCommentStyles.spinner}></div>
                <span className={boardCommentStyles.loadingText}>LOADING...</span>
                </>
            ) : (
                "더보기"
            )}
            </div>
        )}
        </>
    );
}

export default GoodsReview;