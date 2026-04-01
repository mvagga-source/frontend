import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./QnaList.module.css";
import { SaveBtn } from "../../components/button/Button";
import { getQnaListApi } from "./QnaApi";
import { NavLink, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";

const QnaList = () => {
  const navigate = useNavigate();
  const [qna, setQna] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const getList = useCallback(async (lastQno) => {
    if (loading || !hasMore) return;
    setLoading(true);
    getQnaListApi(lastQno).then((res) => {
      if (res.data.success) {
        const newData = res.data.list;
        setTotalCount(res.data.totalCount);
        setQna((prev) => (lastQno === 0 ? newData : [...prev, ...newData]));
        setHasMore(newData.length === 10);
      }
    }).finally(() => setLoading(false));
  }, [loading, hasMore]);

  useEffect(() => {
    getList(0);
  }, []);

  const handleView = (qno) => {
    navigate(`/Community/QnaView/${qno}`);
  };

  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const lastQno = qna.length > 0 ? qna[qna.length - 1].qno : 0;
        getList(lastQno);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, qna, getList]);

  return (
    <div className={styles.qnaContainer}>
      {/* 1. 타이틀 섹션 */}
      <div className={styles.titleSection}>
        <h2>나의 문의 내역</h2>
      </div>

      {/* 2. 가이드 섹션 */}
      <div className={styles.topGuideSection}>
        <div className={styles.guideTitle}>
          <h3>1:1 문의 가이드</h3>
          <p>궁금하신 점을 남겨주시면 운영진이 확인 후 답변해 드립니다.</p>
        </div>
        <ul className={styles.guideList}>
          <li>✔ 답변은 평균 1~2일 소요</li>
          <li>✔ 개인정보 포함 주의</li>
          <li>✔ 상세한 내용 작성 권장</li>
        </ul>
      </div>

      {/* 3. 헤더 (총 건수 및 등록 버튼) */}
      <div className={styles.header}>
        <h2 className={styles.countText}>
          총 <span className={styles.highlight}>{totalCount}</span>건의 문의
        </h2>
        <button 
          type="button" 
          className={styles.createBtn} 
          onClick={() => navigate("/Community/QnaWrite")}
        >
          문의 등록
        </button>
      </div>

      {/* 4. 리스트 영역 */}
      <div className={styles.list}>
        {qna.length === 0 && !loading && (
          <div className={styles.noData}>등록된 문의 내역이 없습니다.</div>
        )}
        
        {qna.map((item, index) => {
          const isLastElement = qna.length === index + 1;
          return (
            <div 
              key={item.qno}
              ref={isLastElement ? lastElementRef : null} 
              className={styles.item}
              onClick={() => handleView(item.qno)}
            >
              <div className={styles.titleWrapper}>
                <span className={styles.title}>{item.qtitle}</span>
                {/* 답변 완료 시 작은 체크 아이콘 등을 추가할 수 있습니다 */}
              </div>
              <div className={styles.infoWrapper}>
                <div className={styles.date}>{dayjs(item.crdt).format("YYYY-MM-DD HH:mm:ss")}</div>
                <div className={`${styles.status} ${item.status === "답변완료" ? styles.completed : styles.pending}`}>
                  {item.status}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* 스크롤 로딩 표시 */}
        {loading && <LoadingScreen />}
      </div>
    </div>
  );
};

export default QnaList;