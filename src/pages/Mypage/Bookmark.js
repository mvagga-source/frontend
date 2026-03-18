
import React, { useEffect, useRef, useState } from "react";
import { getBookmarkPageApi, deleteMyBookmarkApi } from "./BookmarkApi";
import dayjs from "dayjs";
import "./Bookmark.css";

function MyPage () {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);  
  const loader = useRef(null);
  const pageSize = 2;

  // 데이터 가져오기
  const loadEvents = async (page) => {

      if (loading || !hasMore) return;

      setLoading(true); // 로딩 시작

      const res = await getBookmarkPageApi(page,pageSize);
      const newEvents = res.data.content;

      console.log("res : ",res.data.content);

      if (newEvents.length === 0) {
          setHasMore(false);
          setLoading(false); // 로딩 종료
          return;
      }

      setEvents(prev => [...prev, ...newEvents]);

      setLoading(false); // 로딩 종료
  };

  // 페이지 변경 시 실행
  useEffect(() => {
      loadEvents(page);
  }, [page]);


  // 스크롤 감지
  useEffect(() => {

      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting && hasMore && !loading) {
                  setPage(prev => prev + 1);
              }
          },
          { threshold: 1 }
      );
      const currentLoader = loader.current;
      if (currentLoader) {
          observer.observe(currentLoader);
      }
      return () => {
          if (currentLoader) observer.unobserve(currentLoader);
      };

  }, [hasMore, loading]);

  const deleteEvent = async (id) => {
    try {
      await deleteMyBookmarkApi(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch(e){
      console.error("삭제실패 :",e);
    }
  };

  return (
    <div style={{width:"1200px", margin:"0 auto"}}>

      <h2>// 북마크 관리 //</h2>

      {events.map(event => (

        <div className="card-box" key={event.id}>
          <h3>{event.event.title}</h3>
          <p>{event.event.startDate} - {event.event.endDate}</p>
          <p>{dayjs(event.createdAt).format("YYYY-MM-DD")}</p>
          <button className="delete_btn" onClick={() => deleteEvent(event.id)}>
            삭제
          </button>
        </div>

      ))}

      {/* 스크롤 감지 영역 */}
      <div ref={loader} style={{height:"50px", textAlign:"center"}}>
        {/* {hasMore ? "로딩중..." : "마지막 데이터"} */}
      </div>

    </div>
  );
}

export default MyPage;