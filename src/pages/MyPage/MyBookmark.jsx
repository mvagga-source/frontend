
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookmarkApi } from "../Common/BookmarkApi";
import { deleteBookmarkApi } from "./MyMainApi";

import { useAuth } from "../../context/AuthContext";

import { formatDate, formatDateTime } from "../Admin/ACommon";
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

    <>
   <div className="my-btn-wrap">
      <select>
        <option>오디션 일정</option>
        <option>아이돌 영상</option>
      </select>
    </div>

    <table className="my-table">
      <colgroup>
        <col style={{width:"5%"}}/>
        <col style={{width:"5%"}}/>
        <col style={{width:"10%"}}/>        
        <col style={{width:"15%"}}/>          
        <col style={{width:"20%"}}/>
        <col style={{width:"35%"}}/>
        <col style={{width:"10%"}}/>                
      </colgroup>
      <thead>
        <tr>
          <th>
          </th>
          <th>순번</th>
          <th>생성일자</th>
          <th>화면</th>
          <th>이름</th>          
          <th>제목</th>
          <th>처리</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event,index) => (
          <tr key={event.id}>
              <td></td>
              <td>{events.length - index}</td>
              <td>{formatDateTime(event.createdAt)}</td>
              <td>{pageTypes[event.pageType]}</td>
              <td>{event.name}</td>
              <td>{event.title}</td>
              <td>
                    {event.pageType === "VIDEO" &&
                      <Link to={`/Mvideo/${event.pageId}`}>
                        <button className="my-status_btn my-ongoing-all">
                          이동
                        </button>                    
                      </Link>                    
                    }

                    <button className="my-status_btn my-upcoming-all" onClick={() => deleteEvent(event.id)}>
                      삭제
                    </button>                    
                
              </td>                                                                      
          </tr>
        ))}
      </tbody>
      
    </table>    

    </>
  );
}

export default MyBookmark;