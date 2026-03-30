
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookmarkApi } from "../Common/BookmarkApi";
import { deleteBookmarkApi } from "./MyMainApi";

import { useAuth } from "../../context/AuthContext";

import "./MyMain.css";
import dayjs from "dayjs";

function MyBookmark () {

  const {user} = useAuth();

  const [events, setEvents] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);  
  const pageSize = 10;

  const pageTypes = {
    "EVENT":"오디션 일정",
    "VIDEO":"아이돌 영상",
    "GOODS":"아이돌 굿즈"
  }
    
  // 데이터 가져오기
  useEffect (() => {

    const loadEvents = async () => {

      try {
          const res = await getMyBookmarkApi(user.id);
          console.log("res.data : ",res.data);
          setEvents(res.data);
          // setTotalElements(res.data.totalElements);
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

        <div className="my-main-list">

          <select>
            <option>오디션 일정</option>
            <option>아이돌 영상</option>
          </select>


          <ul className="my-card-row-title">
            <li style={{width:"5%"}}>순번</li>
            <li style={{width:"10%"}}>북마크 일자</li>            
            <li style={{width:"15%"}}>화면</li>
            <li style={{width:"20%"}}>이름</li>            
            <li style={{width:"40%"}}>제목</li>
            <li style={{width:"10%"}}></li>
          </ul>                

          {events.map((event,index) => (

            <div className="my-card-row-box">

              <div className="my-card-row" key={event.id}>
                <ul className="my-card-row-list">
                  <li style={{width:"5%"}} className="my-center">{events.length - index}</li>
                  <li style={{width:"10%"}} className="my-center">{dayjs(event.createdAt).format("YYYY-MM-DD")}</li>                  
                  <li style={{width:"15%"}} className="my-center">{pageTypes[event.pageType]}</li>
                  <li style={{width:"20%"}} className="ellipsis">{event.name}</li>                  
                  <li style={{width:"40%"}} className="ellipsis">{event.title}</li>
                  <li style={{width:"5%"}} className="my-center">
                    {event.pageType === "VIDEO" &&
                      <Link to={`/Mvideo/${event.pageId}`}>
                        <button className="my-status_btn my-ongoing-all">
                          이동
                        </button>                    
                      </Link>                    
                    }
                  </li>
                  <li style={{width:"5%"}} className="my-center">
                    <button className="my-status_btn my-upcoming-all" onClick={() => deleteEvent(event.id)}>
                      삭제
                    </button>
                  </li>
                </ul>

              </div>
              <div className="my-sidebar-divider"></div>
            </div>

            
          ))}
        </div>

  );
}

export default MyBookmark;