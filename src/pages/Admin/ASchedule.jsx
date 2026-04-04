
import React, { useEffect, useState } from "react";
import { formatDate, formatDateTime } from "./ACommon";

import { getEventsApi, deleteEventApi } from "../Schedule/ScheduleApi";

import AScheduleList from "./AScheduleList";
import AScheduleInput from "./AScheduleInput";

import "./ASchedule.css";
import "./ACommon.css";


function ASchedule() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // I : Insert, U : Update
  const [isType, setIsType] = useState("I");


  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState([]);  
  const [page, setPage] = useState(0);
  const [sortType, setSortType] = useState("LATEST");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("ALL");

  const [selectedIds, setSelectedIds] = useState([]);
  
  const pageSize = 100;  

  useEffect(()=>{
    setEvents([]);
    getEvents();    
  },[]);

  const getEvents = async () => {
 
    try {
      // 비디오 리스트
      const eventRes = await getEventsApi();
      const eData = await eventRes.data;
      
      if (eData) {
          setEvents(prev => [...prev, ...eData]);
          // console.log(eData);
      }
    } catch (err) {
        console.error(err);
    }
  };

  const deleteevents = async() => {
    try {
      await deleteEventApi(selectedIds);

      //setEvents(prev => prev.filter(v => !selectedIds.includes(v.eno))); // 리스트 제거
      setEvents(prev =>
          prev.map(v => selectedIds.includes(v.eno) ? {...v, deletedFlag:'Y' } : v)
      );
      setSelectedIds([]); // 체크 초기화      

      alert("삭제완료!!");
    } catch (err) {
      console.log(err);
    }
  }

  const hendleUpdate = () => {

     if(selectedIds.length !== 1) {
       alert("하나의 영상만 선택해서 수정할 수 있습니다.");
      return;
     }

    const event = events.find(v => v.eno === selectedIds[0]);
    setEvent(event);
    setIsModalOpen(true);
    setIsType("U");
  }

  const hendleDelete = () => {

    if (selectedIds.length === 0){
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    if (!window.confirm("선택한 항목을 삭제하시겠습니까?")) return;

    deleteevents();
  }

  return (

      <div className="av-main-list">

        <div className="av-do-wrap">
          <button className="co-button-status co-ended-all" onClick={() => {setIsModalOpen(true); setIsType("I");}}>등록</button>
          <button className="co-button-status co-ended-all" onClick={() => hendleUpdate()}>수정</button>
          <button className="co-button-status co-ended-all" onClick={() => hendleDelete()}>삭제</button>
        </div>

        <AScheduleList 
          events={events}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />

        {/* 입력창 */}
        {isModalOpen && (

          <div className="co-modal-overlay">
              <div className="co-modal-item">
                  <div className="co-modal-row">
                    <span className="co-modal-title">{isType === "I" ? "스케줄 등록" : "스케줄 수정"}</span> 
                    <button className="co-close" onClick={() => setIsModalOpen(false)}>✕</button>
                  </div>
                  <div className="co-modal-detail">
                      <AScheduleInput 
                        event={event}
                        setEvents={setEvents} 
                        onClose={() => setIsModalOpen(false)} />
                  </div>
              </div>
          </div>
        )}

      </div>
  );
}

export default ASchedule;