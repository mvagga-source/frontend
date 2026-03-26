import React, { useState, useEffect } from "react";
import styles from "./QnaList.module.css";
import { SaveBtn } from "../../components/button/Button";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import { getQnaListApi } from "./QnaApi";
import dayjs from "dayjs";

const QnaList = ({ onSelect, onCreate }) => {
  /*const [inquiries, setInquiries] = useState([]);

  // 가상 API 호출
  useEffect(() => {
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
    setInquiries(dummyData);
  }, []);

  // 현재 사용자 문의만 필터링
  const myInquiries = inquiries.filter(item => item.user === currentUser);*/

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // 리스트 호출 함수
  const getList = async () => {
    setLoading(true);
    getQnaListApi().then((res) => {
      if (res.data && res.data.status === "SUCCESS") {
        setInquiries(res.data.data || []);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    getList();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.count}>총 문의 {inquiries.length}건</h2>
        <SaveBtn className={styles.createBtn} onClick={onCreate}>문의 등록</SaveBtn>
      </div>

      <div className={styles.list}>
        {inquiries.length === 0 && <p>등록된 문의가 없습니다.</p>}
        {inquiries.map((item) => (
          // key를 DTO의 PK인 qno로 설정
          <div key={item.qno} className={styles.item} onClick={() => onSelect(item.qno)}>
            {/* DTO 필드명 qtitle 사용 */}
            <div className={styles.title}>{item.qtitle}</div>
            
            {/* Timestamp를 dayjs로 포맷팅 (crdt 필드 사용) */}
            <div className={styles.date}>
                {dayjs(item.crdt).format("YYYY-MM-DD")}
            </div>

            {/* status 필드값('답변대기', '답변완료')에 따라 텍스트와 클래스 분기 */}
            <div className={`${styles.status} ${item.status === "답변완료" ? styles.completed : styles.pending}`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default QnaList;