
import React, { useEffect, useRef, useState } from "react";
import { getBookmarkPageApi, deleteMyBookmarkApi } from "./BookmarkApi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "./Bookmark.css";
import bg from "../../assets/images/singer_bg.png";

function MngVote () {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);  
  const loader = useRef(null);
  const pageSize = 10;

  const pageTypes = {
    "BK":"오디션 일정",
    "MV":"아이돌 영상"
  }
    

  // 데이터 가져오기
  const loadEvents = async (page) => {

    try {

      const res = await getBookmarkPageApi(page,pageSize);
      const newEvents = res.data.content;

      console.log("res : ",res.data.content);

      setEvents(prev => [...prev, ...newEvents]);
      
    } catch(e){
      console.error("데이터 불러오기 실패 :",e);
    }    

  };

  // 페이지 변경 시 실행
  useEffect(() => {
      loadEvents(page);
  }, [page]);


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
      await deleteMyBookmarkApi(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch(e){
      console.error("삭제실패 :",e);
    }
  };

  return (

    <div className="bk-main-container" >

        <div className="bk-main-head" style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "auto 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "75% 0"
          }}>
            <div className="bk-main-title">
              <h1>MYPAGE</h1>
            </div>
            <div className="bk-sidebar-divider"></div>
            <ul>
                <Link to="/Bookmark"><li>북마크 관리</li></Link>
                <Link to="/MngVote"><li className="bk-ongoing-bc"><span>●</span>투표 관리</li></Link>
                <li>구매내역</li>
                <li>판매내역</li>
            </ul>            
            {/* <div className="bk-sidebar-divider"></div> */}
        </div>
        

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
                  <li style={{width:"5%"}} className="bk-center">{index+1}</li>
                  <li style={{width:"15%"}}>{pageTypes[event.pageType]}</li>
                  <li style={{width:"35%"}}>{event.event.title}</li>
                  <li style={{width:"20%"}} className="bk-center">{event.event.startDate} ~ {event.event.endDate}</li>
                  <li style={{width:"10%"}} className="bk-center">{dayjs(event.createdAt).format("YYYY-MM-DD")}</li>
                  <li style={{width:"15%"}} className="bk-center">
                    <button className="bk-move_btn bk-status-ongoing">
                      알림중.
                    </button>
                    <button className="bk-delete_btn bk-status-upcoming" onClick={() => deleteEvent(event.id)}>
                      삭제
                    </button>
                  </li>
                </ul>

  {/* 
                <h3>{event.event.title}</h3>
                <p>{event.event.startDate} - {event.event.endDate}</p>
                <p>{dayjs(event.createdAt).format("YYYY-MM-DD")}</p> */}
      
              </div>
              <div className="bk-sidebar-divider"></div>
            </div>

            
          ))}
        </div>

        {/* 스크롤 감지 영역 */}
        {/* <div ref={loader} style={{height:"50px", textAlign:"center"}}> */}
          {/* {hasMore ? "로딩중..." : "마지막 데이터"} */}
        {/* </div> */}

    </div>
  );
}

export default MngVote;