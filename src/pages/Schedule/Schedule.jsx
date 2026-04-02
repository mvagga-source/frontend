// hooks
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// JavaScript Lib
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";

// API
import { getEventsApi } from "./ScheduleApi";
import { getMyPageBookmarskApi } from "../MyPage/MyMainApi";
import { toggleBookmarkApi } from "../Common/BookmarkApi";

// Login(user info)
import { useAuth } from "../../context/AuthContext";

// CSS
import "./Schedule.css";

function Schedule() {

  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [events, setEvents] = useState([]);
  const {user} = useAuth();
  const pageType = "EVENT"; // 페이지구분


  const getEvents  = async () => {

      try {
        const eventRes = await getEventsApi("N");

        setEvents(eventRes.data.map(e => ({
          id: e.eno,
          title: e.title,
          start: e.startDate,
          end: e.endDate,
          backgroundColor:'rgba(0, 242, 255, 0.1)',
          borderColor:'rgba(0, 242, 255, 0.1)',
          extendedProps: {
            desc: e.description,            
            bookmarked: ""
          }
        })));

      }catch (err) {
        console.error(err);
      }
      
  };

  const getBookmarkInfo = async () => {
      console.log("getBookmarkInfo");
      try {
        const bookmarkRes = await getMyPageBookmarskApi(user.id, pageType);
        const pageId = bookmarkRes.data.map(b => b.pageId);

        setEvents(prev =>
          prev.map(v =>
            pageId.includes(v.id)
              ? {
                  ...v,
                  extendedProps: {
                    ...v.extendedProps,
                    bookmarked: true
                  }
                }
              : v
          )
        );

      }catch (err) {
        console.error(err);
      }    
  }

  // 이벤트 정보 가져오기
  useEffect(() => {
    getEvents();
  }, []);  

  // 로그인 일경우 북마크 정보 가져오기
  useEffect(() => {
    if(!user?.id) return;

    getBookmarkInfo();
  }, [user?.id]);    

  const toggleBookmark = async (eno) => {

    console.log("eno : ",eno);
    
    try {
        const res = await toggleBookmarkApi(user.id, eno, pageType);
        const bookmarked = res.data;

        setEvents(prev =>
          prev.map(e =>
            e.id === Number(eno)
              ? {
                  ...e,
                  extendedProps: {
                    ...e.extendedProps,
                    bookmarked: bookmarked
                  }
                }
              : e
          )
        );

        {bookmarked ? alert("북마크에 등록되었습니다.\n\n'마이페이지'에서 확인 가능합니다.") : alert("북마크 등록이 취소 되었습니다.");}

      }catch (err) {
        console.error(err);
      }
  }

  const hendleModal = (e) => {

    setPosition({
      x: e.clientX,
      y: e.clientY,
    });    

    setIsModalOpen(true);
  }

  return (

    <div className="main-container">

      <div className="main-head">
        <div className="main-title">
          <h1>Audition Schedule</h1>
        </div>
      </div>
      <div className="sidebar-divider"></div>

      <div className="main-list">
        
        { <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          // dayMaxEvents={true}
          key={events.length}
          events={events}
          locale={koLocale}
          headerToolbar={{
            left: 'title',
            center: '',
            right: 'prev,next'
          }}

          eventContent={(eventInfo) => {
            const bookmarked = eventInfo.event.extendedProps.bookmarked;
            const truncate = (text, max = 10) => {
              const chars = [...text];
              return chars.length > max
                ? chars.slice(0, max).join('') + '...'
                : text;
            };
            const getDateDiff = (start, end) => {
              const diff = end - start; // ms 차이
              return Math.ceil(diff / (1000 * 60 * 60 * 24));
            };

            return (
              <div className="bookmark-info">
                <div className="bookmark-info-title"> 
                  <ul>
                    <li className="bookmark-icon">●</li>
                    <li className="bookmark-title-text">
                      {getDateDiff(eventInfo.event.start, eventInfo.event.end) > 1 ? eventInfo.event.title : truncate(eventInfo.event.title,16)}
                    </li>
                  </ul>
                  <span className="tooltip-text">
                    {eventInfo.event.title}                    
                  </span>
                </div>
                <div className="bookmark-info-value"
                    onClick={(e) => {
                      e.stopPropagation();
                      {
                        if (!user?.id){
                          if (window.confirm("로그인후 사용가능 합니다. 로그인 하시겠습니까?")){
                            navigate("/UserLogin",{
                                    state: {
                                      from: location.pathname
                                    }
                          });
                          }
                          return;
                        }
                      }
                      toggleBookmark(eventInfo.event.id);
                    }}
                >
                  {bookmarked ? <span className="bookmark-status status-ongoing">북마크</span> : <span className="bookmark-status status-ended">북마크</span>}
                </div>

                {isModalOpen && (
                  <div style={{
                        position: "fixed",
                        top: position.y,
                        left: position.x,
                        height: "100px",
                        width: "100px",
                        background: "white",
                        border: "1px solid black",
                        padding: "10px",
                      }}>

                      <button type="button" onClick={()=>setIsModalOpen(false)}>닫기</button>
                  </div>
                )}

              </div>
            );
          }}
          
        /> }
      </div> {/* end main-list */} 

    </div>
  );
}

export default Schedule;