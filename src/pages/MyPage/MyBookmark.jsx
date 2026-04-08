
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


  const [pageType, setPageType] = useState("ALL");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);  

  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const size = 10;

  const [params, setParams] = useState({
    memberId:user.id,
    page : page,
    size : size,
    pageType: pageType,
    startDate:"",
    endDate:"",
  });  

  //건수 확인
  const isEmpty = list.length === 0;

  const pageTypes = [
    {value : "ALL", label : "전체"},    
    {value : "EVENT", label : "오디션 일정"},
    {value : "VIDEO", label : "아이돌 영상"},
    {value : "GOODS", label : "아이돌 굿즈"},
  ]

  // 페이지 정보 API
  const getMyBookmarkPage = async (searchParams) => {

    try {
        // console.log("searchParams : ",searchParams);
        const res = await getMyBookmarkPageApi(searchParams);
        // console.log("res : ",res.data.list);
        if(res.data){

          // 지역변수 선언
          const { list, maxPage, startPage, endPage, totalCount } = res.data;
          setList(list || []);
          setTotalPages(maxPage || 1);
          setStartPage(startPage || 1);
          setEndPage(endPage || 1);
          setTotalCount(totalCount || 0);
        }
      } catch(e){
        console.error("데이터 불러오기 실패 :",e);
      }
  };  

  // 페이지 정보 삭제 API
  const deleteEvent = async (id) => {

    try {
      await deleteBookmarkApi(id);
      setList(prev => prev.filter(event => event.id !== id));
      alert("삭제 되었습니다.")
    } catch(e){
      console.error("데이터 삭제실패 :",e);
    }
  };  

  // 검색 버튼
  const handleSearch = () => {
    
    if(startDate > endDate || !startDate || !endDate) {
      alert("날짜 입력이 잘못되었습니다. 확인 바랍니다.");
      return;
    }

    setParams(prev => ({
      ...prev,
      page : 1,
      startDate : startDate || today, 
      endDate :endDate || today
    }));
  }  

  const handelDelete = (id) => {
    
    if (!window.confirm("북마크 정보를 삭제하시겠습니까?")) return;

    deleteEvent(id);
  }  

  const handelPage = (page) => {
    setParams(prev => ({
      ...prev,
      page: page,
    }));
  }

  useEffect (() => {

    getMyBookmarkPage(params);
  },[params]);  

  return (

    <>
   <div className="my-form-wrap">
      <select onChange={(e)=> {
        setPageType(e.target.value);
        setParams(prev => ({
          ...prev,
          pageType: e.target.value,
        }));        
      }}>
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
        {["5%","10%","15%","20%","35%","7%","8%"].map((c,i) => (
          <col key={i} style={{width:c}}/>  
        ) )}
      </colgroup>
      <thead>
        <tr>
          <th>순번</th>
          <th>생성일자</th>
          <th>화면</th>
          <th>제목</th>          
          <th>내용</th>
          <th>이동</th>
          <th>처리</th>          
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

        list.map((list,index) => {

          const pathMap = {
            GOODS: `/GoodsView/${list.PAGEID}`,
            VIDEO: `/Mvideo/${list.PAGEID}`,
            EVENT: `/Schedule`,
          };
          const path = pathMap[list.PAGETYPE];

          return (
            <tr key={list.ID}>
                <td style={{textAlign:"center"}}>{list.length - index}</td>
                <td style={{textAlign:"center"}}>{formatDateTime(list.CREATEDAT)}</td>
                <td style={{textAlign:"center"}}>{pageTypes.find(v => v.value === list.PAGETYPE)?.label ||"-" }</td>
                <td style={{textAlign:"left"}}>
                {
                  list.PAGETYPE === 'GOODS'
                    ? <img src={`${process.env.REACT_APP_IMG_URL}${list.NAME}`} style={{width:"80px",height:"80px"}}/>
                    : list.NAME
                }
                </td>
                <td style={{textAlign:"left"}}>{list.TITLE}</td>
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
                  <button className="my-status_btn my-upcoming-all" onClick={() => handelDelete(list.ID)}>
                    삭제
                  </button>                    
                </td>                                                                      
            </tr>
          );
      })}
      </tbody>
      
    </table>

   {/* 페이징 */}
    <div className="my-pagination">

        <button className="my-next-prev__button"
              onClick={() => (
                setPage(p => {
                  handelPage(p-1);
                  return Math.max(p - 1, 1);
                })
              )}>
          이전
        </button>

        {/* 페이지 번호 */}
        {
        Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((p) => (
            <button
                  className={`my-pages__button ${p === page ? "active" : ""}`}
                  key={p}
                  disabled={p === page}
                  onClick={() => {
                    setPage(p);
                    handelPage(p);
                  }}
            >
              {p}
            </button>
        ))}

        <button className="my-next-prev__button" 
                onClick={() => (
                  setPage(p => {
                    handelPage(p + 1);
                    return Math.min(p + 1, maxPage);
                  })
                )}>
          다음
        </button>        
    </div>      

    </>
  );
}

export default MyBookmark;