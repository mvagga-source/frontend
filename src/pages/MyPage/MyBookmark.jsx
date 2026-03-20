
import React, { useEffect, useRef, useState } from "react";
import { getBookmarkPage, deleteBookmark } from "./MyBookmarkApi";

import "./MyBookmark.css";
import dayjs from "dayjs";

function MyBookmark () {

  const [events, setEvents] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);  
  const pageSize = 10;

  const pageTypes = {
    "BK":"오디션 일정",
    "MV":"아이돌 영상"
  }
    
  // 데이터 가져오기
  const loadEvents = async (page) => {

    try {
        const res = await getBookmarkPage(page,pageSize);
        //setEvents(prev => [...prev, ...res.data.content]); // 중복해서 보임
        setEvents(res.data.content);
        setTotalElements(res.data.totalElements);
      } catch(e){
        console.error("데이터 불러오기 실패 :",e);
      }
  };

  // 페이지 변경 시 실행
  useEffect(() => {
      loadEvents(page); 
  }, []);


  // 스크롤 감지
  // useEffect(() => {

  //     const observer = new IntersectionObserver(
  //         (entries) => {
  //             if (entries[0].isIntersecting && hasMore && !loading) {
  //                 setPage(prev => prev + 1);
  //             }
  //         },
  //         { threshold: 1 }
  //     );
  //     const currentLoader = loader.current;
  //     if (currentLoader) {
  //         observer.observe(currentLoader);
  //     }
  //     return () => {
  //         if (currentLoader) observer.unobserve(currentLoader);
  //     };

  // }, [hasMore, loading]);

  const deleteEvent = async (id) => {

    try {
      await deleteBookmark(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      alert("삭제 되었습니다.")
    } catch(e){
      console.error("데이터 삭제실패 :",e);
    }
  };

  return (

        <>

        <div className="bk-main-list">

          <ul className="bk-card-row-title">
            <li style={{width:"5%"}}>순번</li>
            <li style={{width:"15%"}}>북마크 화면</li>
            <li style={{width:"35%"}}>제목</li>
            <li style={{width:"20%"}}>기간</li>
            <li style={{width:"10%"}}>생성 일자</li>
            <li style={{width:"15%"}}></li>
          </ul>                

          {events.map((event,index) => (

            <div className="bk-card-row-box">

              <div className="bk-card-row" key={event.id}>
                <ul className="bk-card-row-list">
                  <li style={{width:"5%"}} className="bk-center">{totalElements - index}</li>
                  <li style={{width:"15%"}}>{pageTypes[event.pageType]}</li>
                  <li style={{width:"35%"}}>{event.event.title}</li>
                  <li style={{width:"20%"}} className="bk-center">{event.event.startDate} ~ {event.event.endDate}</li>
                  <li style={{width:"10%"}} className="bk-center">{dayjs(event.createdAt).format("YYYY-MM-DD")}</li>
                  <li style={{width:"15%"}} className="bk-center">
                    <button className="bk-status_btn bk-ongoing-all">
                      알림
                    </button>
                    <button className="bk-status_btn bk-upcoming-all" onClick={() => deleteEvent(event.id)}>
                      삭제
                    </button>
                  </li>
                </ul>

              </div>
              <div className="bk-sidebar-divider"></div>
            </div>

            
          ))}
        </div>

        {/* 스크롤 감지 영역 */}
        {/* <div ref={loader} style={{height:"50px", textAlign:"center"}}> */}
          {/* {hasMore ? "로딩중..." : "마지막 데이터"} */}
        {/* </div> */}
    </>
  );
}

export default MyBookmark;