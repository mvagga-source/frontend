import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ReportList.module.css";
import { getReportListApi } from "./ReportApi";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import dayjs from "dayjs";

const ReportList = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    const observer = useRef();

    // 시간 변환 로직
    const formatRelativeTime = (dateString) => {
        const now = dayjs();
        const target = dayjs(dateString);
        const diffSec = now.diff(target, "second");
        const diffMin = now.diff(target, "minute");
        const diffHour = now.diff(target, "hour");

        if (diffSec < 60) return "방금 전";
        if (diffMin < 60) return `${diffMin}분 전`;
        if (diffHour < 24) return `${diffHour}시간 전`;
        
        // 하루가 지나면 날짜 형식으로 표시
        return target.format("YYYY-MM-DD");
    };

    // 아이디 마스킹 로직 (첫 글자 제외 나머지 ****)
    const maskId = (id) => {
        if (!id) return "";
        if (id.length <= 1) return id; // 1글자인 경우 그대로 반환
        return id.substring(0, 1) + "*".repeat(id.length - 1);
    };

    const getList = useCallback(async (lastId) => {
        // 로딩 중이거나 데이터가 없으면 실행 방지
        if (loading || !hasMore) return; 
        setLoading(true);
        getReportListApi(lastId).then((res) => {
            if (res.data.success) {
                const { list, hasNext, totalCount: count } = res.data; 

                if (list.length === 0) {
                    setHasMore(false);
                } else {
                    setReports((prev) => [...prev, ...list]);
                    setHasMore(hasNext); // Slice의 hasNext 활용
                    setTotalCount(count);
                }
            }
        }).catch((err) => {
            setHasMore(false);
        })
        .finally(() => setLoading(false));
    }, [loading, hasMore]); // 의존성 추가

    // 첫 렌더링
    useEffect(() => {
        getList(0);
    }, []); // 처음에만 딱 한 번 실행

    // Observer 설정 (마지막 스크롤 요소 감시)
    const lastElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
            // 리스트의 마지막 요소 repono 추출
            const lastRepono = reports.length > 0 ? reports[reports.length - 1].repono : 0;
            getList(lastRepono);
        }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, reports, getList]);

    return (
        <div className={styles.ideaContainer}>
        <div className={styles.ideaList}>
            <div className={styles.listHeader}>
            <h2>신고 내역 조회</h2>
            <span>총 {totalCount}건</span>
            </div>

            <ul>
            {reports.map((report, index) => {
                const isLast = reports.length === index + 1;
                return (
                <li 
                    key={report.repono} 
                    ref={isLast ? lastElementRef : null} 
                    className={styles.ideaItem}
                >
                    <div className={styles.ideaTitle}>
                    [{report.reportType}] {maskId(report.member.id)}님이 '{'idol참가자'}' 내용을 신고하였습니다.
                    </div>
                    <div className={styles.ideaMeta}>
                    <span style={{ color: report.status === "처리완료" ? "#00f2ff" : "#64748b" }}>
                        {report.status}
                    </span>
                    {/* <span>사유: {report.reason}</span> */}
                    {/* [수정] 날짜 대신 상대 시간 표시 */}
                    <span className={styles.timeTag}>{formatRelativeTime(report.crdt)}</span>
                    </div>
                </li>
                );
            })}
            </ul>
            {loading && <LoadingScreen />}
        </div>

            {/* 우측 가이드 영역 (그대로 유지) */}
            <div className={styles.ideaGuide}>
                <h3>신고 가이드</h3>
                <p>
                    깨끗한 커뮤니티를 위해 부적절한 게시글이나 사용자를 신고해주세요. 
                    신고된 내용은 운영진의 검토 후 처리됩니다.
                </p>

                <div className={styles.guideBox}>
                    <div>✔ 허위 신고 시 활동이 제한될 수 있습니다.</div>
                    <div>✔ 증거가 되는 URL이나 ID를 명확히 기재하세요.</div>
                    <div>✔ 처리 결과는 본 내역에서 확인 가능합니다.</div>
                </div>

                <button 
                    className={styles.writeButton}
                    onClick={() => navigate("/Community/ReportSave")}
                >
                    신고하기
                </button>
            </div>
        </div>
    );
}

export default ReportList;