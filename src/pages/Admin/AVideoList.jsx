
import React, { useEffect, useState } from "react";

import { getVideosApi } from "../Video/MVideoApi";
import { formatDate, formatDateTime } from "./ACommon";

function AVideoList() {

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [sortType, setSortType] = useState("LATEST");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("ALL");

  const [checkedList, setCheckedList] = useState([]);

  const pageSize = 100;

  const statusText = {
      "1": "통과",
      "0": "탈락"
  };  

  useEffect(()=>{
    setVideos([]);
    getVideos();    
  },[]);

  const getVideos = async () => {
 
          try {
            // 비디오 리스트
            const videoRes = await getVideosApi(page, pageSize, sortType, search, searchType);
            const vData = await videoRes.data.content;
            
            if (vData) {
                setVideos(prev => [...prev, ...vData]);
            }

          } catch (err) {
              console.error(err);
          }
  };

  const handleCheck = (id) => {
    setCheckedList((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // 제거
        : [...prev, id] // 추가
    );
  };

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      // 전체 선택
      const allIds = videos.map((v) => v.id);
      setCheckedList(allIds);
    } else {
      // 전체 해제
      setCheckedList([]);
    }
  };

  return (

      <>

        <table className="av-table">
          <colgroup>
            <col style={{width:"5%"}}/>                    
            <col style={{width:"5%"}}/>          
            <col style={{width:"5%"}}/>
            <col style={{width:"10%"}}/>
            <col style={{width:"25%"}}/>
            <col style={{width:"20%"}}/>
            <col style={{width:"5%"}}/>
            <col style={{width:"5%"}}/>
            <col style={{width:"5%"}}/>
          </colgroup>
          <thead>
            <tr>
              <th><input 
                    type="checkbox"
                    onChange={handleAllCheck}
                    checked={checkedList.length === videos.length}
                  />
              </th>
              <th>순번</th>
              <th>탈락여부</th>
              <th>연습생 이름</th>
              <th>노래 제목</th>
              <th>유튜브 URL</th>
              <th>좋아요</th>
              <th>조회</th>
              <th>생성일</th>            
            </tr>
          </thead>
          <tbody>
            {videos.map((video,index) => (
              <tr key={video.id}>
                <td style={{textAlign:"center"}}>
                  <input type="checkbox" 
                         checked={checkedList.includes(video.id)}
                         onChange={()=>handleCheck(video.id)}
                  />
                </td>
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
              </tr>            
            ))}

          </tbody>

        </table>
      </>
  );
}

export default AVideoList;