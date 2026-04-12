import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Calendar, momentLocalizer } from "react-big-calendar";
import koLocale from "@fullcalendar/core/locales/ko";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// API
import { getEventsApi } from "./ScheduleApi";
import { getMyPageBookmarskApi } from "../MyPage/MyMainApi";
import { toggleBookmarkApi } from "../Common/BookmarkApi";

import { useAuth } from "../../context/AuthContext";

import styles from "./Event.module.css";

moment.locale("ko");
const localizer = momentLocalizer(moment);

function Schedule() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  const [events, setEvents] = useState([]);
  const [highlightDates, setHighlightDates] = useState([]);

  const { user } = useAuth();
  const pageType = "EVENT";

  const params = useRef({
    memberId: user?.id,
    pageType,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {

    const getEvents = async () => {
      try {
        const eventRes = await getEventsApi("N");

        if (eventRes) {

          const parseDateString = (dateStr, hour = 0, minute = 0) => {
            if (!dateStr) return null;
            const [year, month, day] = dateStr.split("-").map(Number);
            return new Date(year, month - 1, day, hour, minute);
          };

          const data = eventRes.data.map((e) => ({
            id: e.eno,
            title: e.description ? `${e.title} / ${e.description}` : e.title,
            start: parseDateString(e.startDate, 0, 0),
            end: parseDateString(e.endDate, 23, 59),
            desc: e.description,
            bookmarked: false,
          }));

          setEvents(data);

          setHighlightDates(
            eventRes.data
              .filter((e) => e.highlightFlag === "Y")
              .map((e) => {
                const d = new Date(e.startDate);
                d.setDate(d.getDate());
                return d.toDateString();
              })
          );
        }

        if (user?.id) {
          const bookmarkRes = await getMyPageBookmarskApi(params.current);
          const pageId = bookmarkRes.data.map((b) => b.pageId);

          setEvents((prev) =>
            prev.map((v) =>
              pageId.includes(v.id)
                ? { ...v, bookmarked: true }
                : v
            )
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    getEvents();
  }, []);

  const toggleBookmark = async (eno) => {
    try {
      const res = await toggleBookmarkApi(user.id, eno, pageType);
      const bookmarked = res.data;

      setEvents((prev) =>
        prev.map((e) =>
          e.id === eno ? { ...e, bookmarked } : e
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMouseEnter = (event, e) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      content: event.title,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const EventComponent = ({ event }) => {
    const truncate = (text, max = 10) => {
      const chars = [...text];
      return chars.length > max
        ? chars.slice(0, max).join("") + "..."
        : text;
    };

    return (
      <>
      <div className={styles.evBookmarkInfo}>
        <ul>
          <li className={styles.evBookmarkIcon}>
            <svg className={styles.evBookmarkInfoValue} width="22" height="22" viewBox="0 0 24 24"
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
                  toggleBookmark(event.id);
                }}
                fill={`${event.bookmarked ? "currentColor" : "none"}`} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-4-7 4V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v16z"/>                  
            </svg>
          </li>
          <li className={styles.evBookmarkTitleText}>
            {truncate(event.title, 16)}
          </li>
        </ul>
      </div>
      {/* <div
          onMouseEnter={(e) => handleMouseEnter(event, e)}
          onMouseLeave={handleMouseLeave}
        >
        {event.title}
      </div> */}
      </>
    );
  };

  const dayPropGetter = (date) => {
    const key = date.toDateString();
    if (highlightDates.includes(key)) {
      return {
        className: "highlightDay",
        style: {},
      };
    }
    return {};
  };

  const CustomToolbar = ({ date, onNavigate }) => {
    const formatted = moment(date).format("YYYY. M.");

    return (
      <div className={styles.evYearMonth}>
        <div className={styles.evYearMonthLeft}>
          {formatted}
        </div>

        <div className={styles.evYearMonthRight}>
          <button onClick={() => onNavigate("PREV")}><FontAwesomeIcon icon={faCaretLeft} />이전 달</button>
          <button onClick={() => onNavigate("NEXT")}>다음 달 <FontAwesomeIcon icon={faCaretRight} /></button>
        </div>
      </div>
    );
  };


  return (
    <div className={styles.evMain}>
      <div className={styles.evMainWrap}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          // views={["month", "week", "day"]}
          views={["month"]}
          dayPropGetter={dayPropGetter}
          components={{
            toolbar: CustomToolbar,
            event: EventComponent,
          }}
          formats={{
            weekdayFormat: (date) => {
              const days = ["일", "월", "화", "수", "목", "금", "토"];
              return days[date.getDay()];
            },
          }}
        />
      </div>

      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            background: '#000',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
          }}
        >
          {tooltip.content}
        </div>
      )}

    </div>

  );
}

export default Schedule;