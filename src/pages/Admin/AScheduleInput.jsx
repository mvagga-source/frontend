import { useState } from "react";
import { saveEventApi } from "../Schedule/ScheduleApi";

function AScheduleInput({ event, setEvents, onClose }) {

  const [form, setForm] = useState(()=>{
    return event ? {...event} : {
      title: "",
      startDate: "",    
      endDate: "",
      description: "",
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEvent();
  };

  const saveEvent = async () => {
 
          try {
            // 이벤트 저장
            const eventRes = await saveEventApi(form);
            if (event && event.eno) {

              // console.log(typeof setEvents);

              setEvents(prev =>
                  prev.map(v => v.eno === event.eno ? eventRes.data : v)
              );

              onClose();
              
            }else{
              setEvents(prev => [eventRes.data, ...prev]);
              alert("저장 되었습니다.");
            }
            
          } catch (err) {
              console.error(err);
          }

          // 입력폼 초기화
          setForm({
            title: "",
            startDate: "",    
            endDate: "",
            description: "",
          });
  };  

  return (
    <form onSubmit={handleSubmit} className="av-finput">

      {/* 제목 */}
      <div className="co-info-row">
        <span className="co-info-label">제목</span>
        <span className="co-info-val">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </span>
      </div>

      {/* 시작일 */}
      <div className="co-info-row">
        <span className="co-info-label">시작일</span>
        <span className="co-info-val">
          <input
            type="text"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </span>
      </div>      

      {/* 종료일 */}
      <div className="co-info-row">
        <span className="co-info-label">종료일</span>
        <span className="co-info-val">
          <input
            type="text"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </span>
      </div>            

      {/* 설명 */}
      <div className="co-info-row">
        <span className="co-info-label">설명</span>
        <span className="co-info-val">
          <input
            type="text"
          name="description"
          value={form.description}
            onChange={handleChange}
          />
        </span>
      </div> 

      <div className="co-button-row">
        <button type="submit" className="co-button-status co-ongoing-bc">저장</button>
        <button type="button" className="co-button-status co-ended-all" onClick={onClose}>닫기</button>
      </div>

    </form>
  );
}

export default AScheduleInput;