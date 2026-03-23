
import React, { useEffect, useRef, useState } from "react";
import { getBookmarksApi, deleteBookmarkApi } from "./MyBookmarkApi";

import "./MyBookmark.css";
import dayjs from "dayjs";

function MyBookmark () {

  const [events, setEvents] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);  
  const pageSize = 10;

  const pageTypes = {
    "EVENT":"오디션 일정",
    "VIDEO":"아이돌 영상"
  }
    
  // 데이터 가져오기
  useEffect (() => {

    const loadEvents = async () => {

      try {
          const res = await getBookmarksApi();

          setEvents(res.data);
          setTotalElements(res.data.totalElements);
        } catch(e){
          console.error("데이터 불러오기 실패 :",e);
        }
    };

    loadEvents();

  },[]);

  const deleteEvent = async (id) => {

    try {
      await deleteBookmarkApi(id);
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
            <li style={{width:"10%"}}>생성 일자</li>            
            <li style={{width:"15%"}}>북마크 화면</li>
            <li style={{width:"20%"}}>이름</li>            
            <li style={{width:"35%"}}>제목</li>
            <li style={{width:"15%"}}></li>
          </ul>                

          {events.map((event,index) => (

            <div className="bk-card-row-box">

              <div className="bk-card-row" key={event.id}>
                <ul className="bk-card-row-list">
                  <li style={{width:"5%"}} className="bk-center">{events.length - index}</li>
                  <li style={{width:"10%"}} className="bk-center">{dayjs(event.createdAt).format("YYYY-MM-DD")}</li>                  
                  <li style={{width:"15%"}} className="bk-center">{pageTypes[event.pageType]}</li>
                  <li style={{width:"20%"}} className="ellipsis">{event.name}</li>                  
                  <li style={{width:"35%"}} className="ellipsis">{event.title}</li>
                  <li style={{width:"15%"}} className="bk-center">
                    {/* <button className="bk-status_btn bk-ongoing-all">
                      알림
                    </button> */}
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

    </>
  );
}

export default MyBookmark;