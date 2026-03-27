
import React from "react";

import { formatDate, formatDateTime } from "./ACommon";

function AScheduleList({events, selectedIds, setSelectedIds}) {

  const handleCheck = (eno) => {

    setSelectedIds((prev) =>
      prev.includes(eno)
        ? prev.filter((item) => item !== eno) // 제거
        : [...prev, eno] // 추가
    );
  };

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      // 전체 선택
      const allIds = events.map((v) => v.eno);
      setSelectedIds(allIds);
    } else {
      // 전체 해제
      setSelectedIds([]);
    }
  };

  return (
      <>
        <table className="av-table">
          <colgroup>
            <col style={{width:"5%"}}/>
            <col style={{width:"5%"}}/>
            <col style={{width:"25%"}}/>          
            <col style={{width:"10%"}}/>
            <col style={{width:"10%"}}/>
            <col style={{width:"35%"}}/>
            <col style={{width:"10%"}}/>
          </colgroup>
          <thead>
            <tr>
              <th><input 
                    type="checkbox"
                    onChange={handleAllCheck}
                    checked={selectedIds.length === events.length}
                  />
              </th>
              <th>순번</th>
              <th>제목</th>
              <th>시작일자</th>
              <th>종료일자</th>
              <th>설명</th>
              <th>생성일</th>            
            </tr>
          </thead>
          <tbody>
            {events.map((event,index) => (
              <tr key={event.eno}>
                <td style={{textAlign:"center"}}>
                  <input type="checkbox" 
                         checked={selectedIds.includes(event.eno)}
                         onChange={()=>handleCheck(event.eno)}
                  />
                </td>
                <td style={{textAlign:"center"}}>{events.length - index}</td>
                <td className="co-ellipsis">{event.title}</td>
                <td style={{textAlign:"center"}}>{event.startDate}</td>
                <td style={{textAlign:"center"}}>{event.endDate}</td>
                <td className="co-ellipsis">{event.description}</td>                
                <td style={{textAlign:"center"}}>{formatDate(event.createdAt)}</td>
              </tr>            
            ))}

          </tbody>

        </table>
      </>
  );
}

export default AScheduleList;