
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookmarkPageApi, deleteBookmarkApi } from "./MyMainApi";

import { useAuth } from "../../context/AuthContext";

import { formatDate, formatDateTime } from "../Admin/ACommon";
import "./MyMain.css";


function MyBookmark () {

  const {user} = useAuth();

  const date = new Date();
  const today = formatDate(date);  

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);  
  const [pageType, setPageType] = useState("ALL");
  const [events, setEvents] = useState([]);

  const params = useRef({
    memberId:user.id,
    pageType:"",
    startDate:"",
    endDate:"",
  });  

  //건수 확인
  const isEmpty = events.length === 0;

  const pageTypes = [
    {value : "ALL", label : "전체"},    
    {value : "EVENT", label : "오디션 일정"},
    {value : "VIDEO", label : "아이돌 영상"},
    {value : "GOODS", label : "아이돌 굿즈"},
  ]

  const loadEvents = async (searchParams) => {

    try {
        const res = await getMyBookmarkPageApi(
            {
              ...searchParams,
              pageType: pageType,
              startDate : startDate || today, 
              endDate :endDate || today
            }
        );

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

  useEffect (() => {
    loadEvents(params.current);
  },[pageType]);  

  const handleSearch = () => {
    
    if(startDate > endDate || !startDate || !endDate) {
      alert("날짜 입력이 잘못되었습니다. 확인 바랍니다.");
      return;
    }
    loadEvents(params.current);
  }  

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

      <input type="date" value={startDate} name="startDate" onChange={(e)=>setStartDate(e.target.value)} /> -
      <input type="date" value={endDate} name="endDate" onChange={(e)=>setEndDate(e.target.value)}/>
      <button onClick={handleSearch}>검색</button>

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

        {isEmpty ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", height:"50px" }}>
                데이터가 없습니다.
              </td>
            </tr>

        ) : 

        events.map((event,index) => {

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
                <td style={{textAlign:"left"}}>
                {
                  event.PAGETYPE === 'GOODS'
                    ? <img src={`${process.env.REACT_APP_IMG_URL}${event.NAME}`} style={{width:"80px",height:"80px"}}/>
                    : event.NAME
                }
                </td>
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