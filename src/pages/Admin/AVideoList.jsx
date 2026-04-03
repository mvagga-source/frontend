
import React from "react";
import { formatDate, formatDateTime } from "./ACommon";

function AVideoList({videos, selectedIds, setSelectedIds}) {

  const statusText = {
      "1": "통과",
      "0": "탈락"
  };  

  const handleCheck = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // 제거
        : [...prev, id] // 추가
    );
  };

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      // 전체 선택
      const allIds = videos.map((v) => v.id);
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
            <col style={{width:"5%"}}/>  {/* 순번 */} 
            <col style={{width:"10%"}}/>  {/* 탈락여부 */}        
            <col style={{width:"10%"}}/>   {/* 연습생 이름 */}
            <col style={{width:"10%"}}/>  {/* 노래 제목 */}
            <col style={{width:"15%"}}/>  {/* 유튜브 URL */}
            <col style={{width:"10%"}}/>   {/* 좋아요 */}
            <col style={{width:"10%"}}/>   {/* 조회 */}
            <col style={{width:"10%"}}/>  {/* 생성일 */}
            <col style={{width:"5%"}}/>  {/* 삭제 */}
            <col style={{width:"15%"}}/>  {/* 처리 */}
          </colgroup>
          <thead>
            <tr>
              <th>순번</th>
              <th>탈락여부</th>
              <th>이름</th>
              <th>노래 제목</th>
              <th>유튜브 URL</th>
              <th>좋아요</th>
              <th>조회</th>
              <th>생성일</th>
              <th>삭제</th>        
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video,index) => (
              <tr key={video.id}>
                <td style={{textAlign:"center"}}>{videos.length - index}</td>
                <td style={{textAlign:"center"}}>
                  <span className={`co-sign-status ${
                    video.status === "1" ? "co-ongoing-fc" : "co-upcoming-fc"
                  }`}>●</span>
                  {statusText[video.status]}
                </td>
                <td className="co-ellipsis">{video.name}</td>
                <td className="co-ellipsis">{video.title}</td>
                <td className="co-ellipsis">{video.url}</td>
                <td style={{textAlign:"center"}}>{video.likeCount}</td>
                <td style={{textAlign:"center"}}>{video.viewCount}</td>
                <td style={{textAlign:"center"}}>{formatDate(video.createdAt)}</td>
                <td style={{textAlign:"center"}}>{video.deletedFlag}</td>
                <td>
                  <button className="co-button-status co-ended-all" >수정</button>
                  <button className="co-button-status co-ended-all" >삭제</button>
                </td>
              </tr>            
            ))}

          </tbody>

        </table>
      </>
  );
}

export default AVideoList;