import { useState, useEffect } from "react";

// fullcalendar
//import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";

import { getEventApi,toggleBookmarkApi,getMyBookmarkApi } from "./ActionCalendarApi";
import { useAuth } from "../../context/AuthContext";
import "./ActionCalendar.css";

function ActionCalendar() {

  const [events, setEvents] = useState([]);
  const {user} = useAuth();

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
          extendedProps: {
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
        const res = await toggleBookmarkApi(eno, user.id);
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

      }catch (err) {
        console.error(err);
      }
  }

  return (

    <div style={{width:"1200px", margin:"0 auto"}}>

      <h2>오디션 일정</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        key={events.length}
        events={events}
        locale={koLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        eventContent={(eventInfo) => {
          const bookmarked = eventInfo.event.extendedProps.bookmarked;
          return (
            <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
              <span>{eventInfo.event.title}</span>

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(eventInfo.event.id, 101);
                }}
                style={{cursor:"pointer"}}
              >
                {bookmarked ? "⭐" : "☆"}
              </span>
            </div>
          );
        }}
        
      />

    </div>
  );
}

export default ActionCalendar;