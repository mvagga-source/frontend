import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./IdeaList.module.css";
import { NavLink } from "react-router-dom";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import dayjs from "dayjs";
import { getIdeaListApi } from "./IdeaApi";

function IdeaList() {
    const dummyIdeas = [
        { id: 1, title: "굿즈 예약 기능 추가 요청", author: "user123", time: "10분 전" },
        { id: 2, title: "팬 커뮤니티 이벤트 제안", author: "fanlove", time: "25분 전" },
        { id: 3, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 4, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 5, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 6, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 7, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 8, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 9, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 10, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
    ];

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    const observer = useRef();

    // 아이디 마스킹
    const maskId = (id) => {
        if (!id) return "익명";
        return id.length > 2 ? id.substring(0, 2) + "****" : id + "*";
    };

    // 시간 포맷 (상대 시간)
    const formatTime = (date) => {
        const now = dayjs();
        const target = dayjs(date);
        const diffMin = now.diff(target, "minute");
        const diffHour = now.diff(target, "hour");

        if (diffMin < 1) return "방금 전";
        if (diffMin < 60) return `${diffMin}분 전`;
        if (diffHour < 24) return `${diffHour}시간 전`;
        return target.format("YYYY-MM-DD");
    };

    const getList = useCallback(async (lastId) => {
        if (loading || !hasMore) return; 
        setLoading(true);
        getIdeaListApi(lastId).then((res) => {
            if (res.data.success) {
                const { list, hasNext, totalCount: count } = res.data; 

                if (list.length === 0) {
                    setHasMore(false);
                } else {
                    setIdeas((prev) => [...prev, ...list]);
                    setHasMore(hasNext); // Slice의 hasNext 활용
                    setTotalCount(count);
                }
            }
        }).catch((err) => {
            setHasMore(false);
        })
        .finally(() => setLoading(false));
    }, [loading, hasMore]);

    // 첫 렌더링
    useEffect(() => {
        getList(0);
    }, []);

    // 마지막 요소 감시 (Intersection Observer)
    const lastElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
            // 리스트의 마지막 요소 repono 추출
            const lastIdeano = ideas.length > 0 ? ideas[ideas.length - 1].ideano : 0;
            getList(lastIdeano);
        }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, ideas, getList]);

    return (
        <div className={styles.ideaContainer}>
            <div className={styles.ideaList}>
                <div className={styles.listHeader}>
                    <h2>아이디어 제안</h2>
                    <span>총{totalCount? totalCount : 0}건</span>
                </div>

                <ul>
                    {ideas.map((idea, index) => {
                        const isLast = ideas.length === index + 1;
                        return (
                            <li 
                                key={idea.ideano} 
                                ref={isLast ? lastElementRef : null}
                                className={styles.ideaItem}
                            >
                                <div className={styles.categoryBadge}>[{idea.ideacategory}] {idea.ideatitle}</div>
                                {/* <div className={styles.ideaTitle}>{idea.ideatitle}</div> */}
                                <div className={styles.ideaMeta}>
                                    <span>{maskId(idea.member?.id)}</span>
                                    <span>{formatTime(idea.crdt)}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                {loading && <div className={styles.loadingText}>데이터를 불러오는 중...</div>}
            </div>

            <div className={styles.ideaGuide}>
                <h3>아이디어 작성 가이드</h3>
                <p>구체적인 내용과 기대 효과를 함께 작성해 주세요.</p>
                <p>여러분의 새로운 아이디어 제안을 기다립니다</p>
                <div className={styles.guideBox}>
                    <div>✔ 기능 설명을 명확하게</div>
                    <div>✔ 필요한 이유 작성</div>
                    <div>✔ 기대 효과 포함</div>
                </div>
                <NavLink to="/Community/IdeaWrite">
                    <button className={styles.writeButton}>제안하기</button>
                </NavLink>
            </div>
        </div>
    );
}

export default IdeaList;
