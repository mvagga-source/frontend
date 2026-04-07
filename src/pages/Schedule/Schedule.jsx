// hooks
import { useState, useEffect, useRef } from "react";
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
import Content from "../../components/Title/ContentComp";

// CSS
import "./Schedule.css";

function Schedule() {

  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [highlightDates, setHighlightDates] = useState([]);

  const [events, setEvents] = useState([]);
  const {user} = useAuth();
  const pageType = "EVENT"; // 페이지구분

  const params = useRef({
    memberId:user.id,
    pageType:pageType,
    startDate:"",
    endDate:"",
  });    

  useEffect(() => {

    const getEvents  = async () => {

        console.log("getEvents");

        try {
          const eventRes = await getEventsApi("N");

          if (eventRes) {
            const data = await eventRes.data.map(e => ({
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
            }));
            setEvents(data);

            setHighlightDates( 
              eventRes.data
                .filter(e => e.highlightFlag === "Y")
                .map(e => {
                  const date = new Date(e.startDate);
                  date.setDate(date.getDate()-1);
                  return date.toISOString().slice(0,10);
                })
            );

            console.log("highlightDates : ",highlightDates);
          }

          if (user?.id) {

            const bookmarkRes = await getMyPageBookmarskApi(params.current);
            const pageId = bookmarkRes.data.map(b => b.pageId);

            console.log("pageId : ",pageId);

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
          }

        }catch (err) {
          console.error(err);
        }
    };

    getEvents();
  }, []);  

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

  return (

    <Content TitleName="Schedule">

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

          dayCellClassNames={(arg) => {
            const dateStr = arg.date.toISOString().slice(0, 10);
            if (highlightDates.includes(dateStr)) {
              return ['highlight-day']; // CSS 클래스 지정
            }
            return [];
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
                    <li className="bookmark-icon">
                      <svg className="bookmark-info-value" width="22" height="22" viewBox="0 0 24 24"
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
                          fill={`${bookmarked ? "currentColor" : "none"}`} stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-4-7 4V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v16z"/>                  
                      </svg>                      
                    </li>
                    <li className="bookmark-title-text">
                      {getDateDiff(eventInfo.event.start, eventInfo.event.end) > 1 ? eventInfo.event.title : truncate(eventInfo.event.title,16)}
                    </li>
                  </ul>
                  <span className="tooltip-text">
                    {eventInfo.event.title} {eventInfo.event.extendedProps.desc ? ` - ${eventInfo.event.extendedProps.desc}` : ''}
                  </span>
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

    </Content>
  );
}

export default Schedule;