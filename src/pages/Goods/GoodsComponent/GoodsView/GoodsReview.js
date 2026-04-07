import React, { useState, useEffect, useCallback } from "react";
import styles from "./GoodsReview.module.css"; // BoardComment와 유사한 스타일 적용
import { SaveBtn } from "../../../../components/button/Button";
import { useAuth } from "../../../../context/AuthContext";
import { getReviewListApi } from "../../GoodsApi";
import dayjs from "dayjs";
import GoodsReviewItem from "./GoodsReview/GoodsReviewItem";
import GoodsReviewSort from "./GoodsReview/GoodsReviewSort";
import GoodsReviewSaveForm from "./GoodsReview/GoodsReviewSaveForm";

/**
 * 굿즈 리뷰 목록
 * @param {*} param0 
 * @returns 
 */
function GoodsReview({ gno, sellerId }) {
    //가상스크롤 적용은 사용X(리뷰가 많아지는 경우 적용 필요)
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);

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

    return (
        <>
        <div className={styles.reviewSection}>
            {/* 리뷰 작성 컴포넌트 */}
            {/* <GoodsReviewSaveForm /> */}

            {/* 리뷰 리스트 영역 */}
            <div className={styles.listContainer}>
                {/* 정렬 옵션 그룹 */}
                <GoodsReviewSort totalCount={totalCount} sortType={sortType} onSortChange={handleSortChange} />
                {/* 리뷰리스트 */}
                <ul className={styles.reviewList}>
                {reviews.length > 0 ? (
                    reviews.map((r) => (
                    <GoodsReviewItem
                        key={r.grno}
                        r={r}
                        setReviews={setReviews}
                        user={user}
                        sellerId={sellerId}
                        editingId={editingId}
                        setEditingId={setEditingId}
                        refreshList={refreshList}
                    />
                    ))
                ) : (
                    // 이 부분을 프래그먼트 <>로 감싸야 합니다.
                    <>
                    {!loading && (
                        <div className={styles.emptyReview}>
                        <div className={styles.emptyIcon}>📝</div>
                        <p className={styles.emptyText}>등록된 리뷰가 없습니다.</p>
                        <p className={styles.subText}>첫 번째 리뷰의 주인공이 되어보세요!</p>
                        </div>
                    )}
                    </>
                )}
                </ul>
            </div>
        </div>

        {/* [추가] BoardComment에서 가져온 네온 더보기 버튼 */}
        {hasMore && (
            <div 
            className={`${styles.moreBtnBar} ${loading ? styles.loading : ""}`} 
            onClick={handleMore}
            >
            {loading ? (
                <>
                <div className={styles.spinner}></div>
                <span className={styles.loadingText}>LOADING...</span>
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
