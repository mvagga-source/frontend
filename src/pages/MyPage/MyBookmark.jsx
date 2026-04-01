
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

  const [pageType, setPageType] = useState("");
  const [events, setEvents] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);  
  const pageSize = 10;

  const pageTypes = [
    {value : "ALL", label : "전체"},    
    {value : "EVENT", label : "오디션 일정"},
    {value : "VIDEO", label : "아이돌 영상"},
    {value : "GOODS", label : "아이돌 굿즈"},
  ]

  const loadEvents = async (pageType) => {

    try {
        const res = await getMyBookmarkApi(user.id, pageType);

        console.log("res : ",res.data);

        if(res.data || res.data.success)
          setEvents(res.data.data);
      } catch(e){
        console.error("데이터 불러오기 실패 :",e);
      }
  };  

  const deleteEvent = async (id) => {

    try {
      await deleteBookmarkApi(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      alert("삭제 되었습니다.")
    } catch(e){
      console.error("데이터 삭제실패 :",e);
    }
  };  

  // 데이터 가져오기
  useEffect (() => {
    loadEvents();
  },[]);

  useEffect (() => {
    loadEvents(pageType);
  },[pageType]);  

  const handelDelete = (id) => {
    
    if (!window.confirm("북마크 정보를 삭제하시겠습니까?")) return;

    deleteEvent(id);
  }  

  return (

    <>
   <div className="my-form-wrap">
      <select onChange={(e)=>setPageType(e.target.value)}>
        {pageTypes.map(v =>(
          <option key={v.value} value={v.value}>{v.label}</option>
        ))}
      </select>
    </div>

    <table className="my-table">
      <colgroup>
        <col style={{width:"5%"}}/>
        <col style={{width:"10%"}}/>        
        <col style={{width:"15%"}}/>          
        <col style={{width:"20%"}}/>
        <col style={{width:"35%"}}/>
        <col style={{width:"7%"}}/>        
        <col style={{width:"8%"}}/>                
      </colgroup>
      <thead>
        <tr>
          <th>순번</th>
          <th>생성일자</th>
          <th>화면</th>
          <th>제목</th>          
          <th>내용</th>
          <th>처리</th>
          <th>이동</th>          
        </tr>
      </thead>
      <tbody>
        {events.map((event,index) => {

          const pathMap = {
            GOODS: `/GoodsView/${event.PAGEID}`,
            VIDEO: `/Mvideo/${event.PAGEID}`,
            EVENT: `/Schedule`,
          };
          const path = pathMap[event.PAGETYPE];

          return (
            <tr key={event.ID}>
                <td style={{textAlign:"center"}}>{events.length - index}</td>
                <td style={{textAlign:"center"}}>{formatDateTime(event.CREATEDAT)}</td>
                <td style={{textAlign:"center"}}>{pageTypes.find(v => v.value === event.PAGETYPE)?.label ||"-" }</td>
                <td style={{textAlign:"left"}}>{event.NAME}</td>
                <td style={{textAlign:"left"}}>{event.TITLE}</td>
                <td style={{textAlign:"center"}}>
                 {path &&
                    <Link to={path}>
                      <button className="my-status_btn my-ongoing-all">
                        이동
                      </button>                    
                    </Link>                    
                  }                
                </td>                
                <td style={{textAlign:"center"}}>
                  <button className="my-status_btn my-upcoming-all" onClick={() => handelDelete(event.ID)}>
                    삭제
                  </button>                    
                </td>                                                                      
            </tr>
          );
      })}
      </tbody>
      
    </table>    

    </>
  );
}

export default MyBookmark;