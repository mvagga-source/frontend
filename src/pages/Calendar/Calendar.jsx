// hooks
import { useState, useEffect } from "react";

// JavaScript Lib
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";

// API
import { getEventApi,toggleBookmarkApi,getMyBookmarkApi } from "./CalendarApi";

// Login(user info)
import { useAuth } from "../../context/AuthContext";

// CSS
import "./Calendar.css";

function Calendar() {

  const [events, setEvents] = useState([]);
  const {user} = useAuth();
  const pageType = "BK"; // 페이지구분

  useEffect(() => {

    const fetchEvents  = async () => {
      try {
        const res = await getEventApi();

        const bookmarkRes = await getMyBookmarkApi(user.id);
        const bookmarkIds = bookmarkRes.data;

        setEvents(res.data.map(e => ({
          id: e.eno,
          title: e.title,
          start: e.startDate,
          end: e.endDate,
          backgroundColor:'rgba(0, 242, 255, 0.1)',
          borderColor:'rgba(0, 242, 255, 0.1)',
          extendedProps: {
            desc: e.description,            
            bookmarked: bookmarkIds.includes(e.eno)
          }
        })));

      }catch (err) {
        console.error(err);
      }
      
    };

    fetchEvents();

  }, [user.id]);  

  const toggleBookmark = async (eno) => {
    
    try {
        const res = await toggleBookmarkApi(eno, user.id, pageType);
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

        {bookmarked ? alert("북마크에 등록되었습니다.\n\n'마이페이지'에서 확인 가능합니다.") : alert("북마크 등록이 삭제 되었습니다.");}

      }catch (err) {
        console.error(err);
      }
  }

  return (

    <div className="main-container">

      <div className="main-head">
        <div className="main-title">
          <h1>Audition Calendar</h1>
        </div>
      </div>
      <div className="sidebar-divider"></div>


      <div className="main-list">
        
        { <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
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
            return (
              <div className="bookmark-info">
                <span> <span className="bookmark-icon">●</span> {eventInfo.event.title} / {eventInfo.event.extendedProps.desc} </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(eventInfo.event.id);
                  }}
                  style={{cursor:"pointer"}}
                >
                  {bookmarked ? <span className="bookmark-status status-ongoing">북마크</span> : <span className="bookmark-status status-ended">북마크</span>}
                </span>

              </div>
            );
          }}
          
        /> }

      </div>
    </div>
  );
}

export default Calendar;