
import React from "react";
import { useEffect, useState } from "react";
import { formatDate, formatDateTime } from "./ACommon";
import { deleteVideosApi, getVideoPageApi, getIdolStatusApi } from "../Video/MVideoApi";

function AVideoList({dataParams}) {

  const {
    setVideo,      
    videos,
    setVideos,
    params,
    setParams,
    openModal,
  } = dataParams;  

  const statusText = {
      "1": "통과",
      "0": "탈락"
  };  

  const [idolStatus, SetIdolStatus] = useState([]);

  const getVideos = async (searchParams) => {
 
    try {
      // 비디오 리스트
      const res = await getVideoPageApi(searchParams);
      const data = await res.data.list;
      console.log("AVideoList : ",data);
      if (data) {
          setVideos(data);
      }

      // 아이돌 진출 상태
      const idolRes = await getIdolStatusApi({});
      if (idolRes.data.success) {
          const data = await idolRes.data.data.map(i=> i.IDOL_PROFILE_ID);
          console.log(data)
          SetIdolStatus(data);
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
          {["5%", "5%", "10%", "30%", "20%", "5%", "5%", "5%", "5%", "10%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
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
                  <span className={`co-sign-status 
                    ${idolStatus.includes(video.idol_profile?.profileId || "") ? "co-ongoing-fc" : "co-upcoming-fc"}`}>●</span>
                </td>
                <td>{video.idol_profile?.name || "" }</td>
                <td>{video.title}</td>
                <td>{video.url}</td>
                <td style={{textAlign:"center"}}>{video.likeCount}</td>
                <td style={{textAlign:"center"}}>{video.viewCount}</td>
                <td style={{textAlign:"center"}}>{formatDate(video.createdAt)}</td>
                <td style={{textAlign:"center"}}>{video.deletedFlag}</td>
                <td className="av-tform-wrap">
                  <button type="button" className="co-button-status co-ongoing-bc" 
                          onClick={() => {
                            setVideo(video);
                            openModal("U");
                          }} >수정</button>
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