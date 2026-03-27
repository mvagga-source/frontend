import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./QnaList.module.css";
import { SaveBtn } from "../../components/button/Button";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import { getQnaListApi } from "./QnaApi";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const QnaList = () => {

  // 가상 API 호출
  /*useEffect(() => {
    // 예시 더미 데이터
    const dummyData = [
      { id: 1, user: "me", title: "앱 오류 문의", content: "앱이 자꾸 꺼져요.", date: "2026-03-20", answer: "업데이트 후 확인 부탁드립니다." },
      { id: 2, user: "me", title: "결제 문의", content: "결제가 안 되네요.", date: "2026-03-20", answer: "" },
      { id: 3, user: "me", title: "UI 개선 문의", content: "UI가 불편해요.", date: "2026-03-20", answer: "" },
      { id: 4, user: "me", title: "기타 문의", content: "다른 사람 문의", date: "2026-03-20",answer: "관리자 답변" },
      { id: 5, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20", answer: "확인 중" },
      { id: 6, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20", answer: "확인 중" },
      { id: 7, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20", answer: "확인 중" },
      { id: 8, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 9, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 10, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 11, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 12, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 13, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 14, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 15, user: "me", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 16, user: "other", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 17, user: "other", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 18, user: "other", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
      { id: 19, user: "other", title: "버그 신고", content: "버그가 발생했어요.", date: "2026-03-20",answer: "확인 중" },
    ];
    setQna(dummyData);
  }, []);*/
  const navigate = useNavigate();
  const [qna, setQna] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지
  const observer = useRef();

  // 리스트 호출 함수
  const getList = async (lastQno) => {
    if (loading || !hasMore) return; // 스크롤시 중복가져오는 것 방지용으로 로딩 중이거나 더 이상 데이터가 없으면 중단
    setLoading(true);
    getQnaListApi(lastQno).then((res) => {
      if (res.data.success) {
        console.log(res);
        const newData = res.data.list;
        setTotalCount(res.data.totalCount);
        // 기존 리스트 뒤에 새 데이터 추가
        setQna((prev) => [...prev, ...newData]);
        setHasMore(newData.length === 10);
      }
    }).finally(() => setLoading(false));
  };

  // 첫 렌더링 시 초기 데이터 로드
  useEffect(() => {
    getList(0); // 처음엔 lastQno를 0으로 보냄 (혹은 백엔드 로직에 따른 초기값)
  }, []);

  const handleView = (qno) => {
    // 상세 페이지 경로로 이동
    navigate(`/Community/QnaView/${qno}`);
  };

  // Intersection Observer 설정 (마지막 요소 감시)
  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      // 마지막 요소가 화면에 보이고, 더 가져올 데이터가 있다면
      if (entries[0].isIntersecting && hasMore) {
        // 현재 리스트의 마지막 항목의 qno를 전달
        const lastQno = qna.length > 0 ? qna[qna.length - 1].qno : 0;
        getList(lastQno);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, qna, getList]);

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.count}>총 문의 {totalCount}건</h2>
        <NavLink to="/Community/QnaWrite">
          <SaveBtn className={styles.createBtn}>문의 등록</SaveBtn>
        </NavLink>
      </div>

      <div className={styles.list}>
        {qna.length === 0 && <p>등록된 문의가 없습니다.</p>}
        {qna.map((item, index) => {
          // 마지막 요소에만 ref를 달아줍니다.
          const isLastElement = qna.length === index + 1;
          return (
            <div 
              key={item.qno}
              ref={isLastElement ? lastElementRef : null} 
              className={styles.item}
              onClick={() => handleView(item.qno)}
            >
              <div className={styles.title}>{item.qtitle}</div>
              <div className={styles.date}>{dayjs(item.crdt).format("YYYY-MM-DD")}</div>
              <div className={`${styles.status} ${item.status === "답변완료" ? styles.completed : styles.pending}`}>
                {item.status}
              </div>
            </div>
          );
        })}
        {/* 4. 추가 로딩 중일 때 하단에만 표시 (스크롤 유지됨) */}
        {loading && (
          <LoadingScreen />
        )}
      </div>
    </>
  );
};

export default QnaList; 