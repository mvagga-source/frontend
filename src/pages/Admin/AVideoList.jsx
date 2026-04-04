
import React from "react";
import { useEffect, useState } from "react";
import { formatDate, formatDateTime } from "./ACommon";
import { deleteVideosApi, getVideoPageApi } from "../Video/MVideoApi";

function AVideoList({dataParams}) {
  
    const {
      videos,
      setVideos,
      params,
      setParams,
      openModal,
      setIsType,
  } = dataParams;  

  const statusText = {
      "1": "통과",
      "0": "탈락"
  };  

  const getVideos = async (searchParams) => {
 
    try {
      // 비디오 리스트
      const res = await getVideoPageApi(searchParams);
      const data = await res.data.list;
      
      if (data) {
          setVideos(data);
      }
    } catch (e) {
        console.error("비디오 리스트 호출 오류 : ",e);
    }
  };

  useEffect(()=>{

    getVideos(params);    

  },[params]);   

  const deleteVideos = async() => {
    try {

      // await deleteVideosApi();


      alert("삭제완료!!");

    } catch (e) {
      console.log("비디오 삭제 호출 오류 : ",e);
    }
  }

  const hendleDelete = () => {

    if (!window.confirm("선택한 항목을 삭제하시겠습니까?")) return;

    deleteVideos();
  }

  return (
      <>
        <table className="av-table">
          <colgroup>
            <col style={{width:"5%"}}/>  {/* 순번 */} 
            <col style={{width:"5%"}}/>  {/* 탈락여부 */}        
            <col style={{width:"10%"}}/>   {/* 연습생 이름 */}
            <col style={{width:"30%"}}/>  {/* 노래 제목 */}
            <col style={{width:"20%"}}/>  {/* 유튜브 URL */}
            <col style={{width:"5%"}}/>   {/* 좋아요 */}
            <col style={{width:"5%"}}/>   {/* 조회 */}
            <col style={{width:"5%"}}/>  {/* 생성일 */}
            <col style={{width:"5%"}}/>  {/* 삭제 */}
            <col style={{width:"10%"}}/>  {/* 처리 */}
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
                <td>{video.name}</td>
                <td>{video.title}</td>
                <td>{video.url}</td>
                <td style={{textAlign:"center"}}>{video.likeCount}</td>
                <td style={{textAlign:"center"}}>{video.viewCount}</td>
                <td style={{textAlign:"center"}}>{formatDate(video.createdAt)}</td>
                <td style={{textAlign:"center"}}>{video.deletedFlag}</td>
                <td className="av-tform-wrap">
                  <button type="button" className="co-button-status co-ongoing-bc" onClick={() => openModal("U",video.id)} >수정</button>
                  <button type="button" className="co-button-status co-upcoming-bc" >삭제</button>
                </td>
              </tr>            
            ))}

          </tbody>

        </table>
      </>
  );
}

export default AVideoList;