
import React, { useEffect, useState } from "react";
import { formatDate, formatDateTime } from "./ACommon";

import { getVideoPageApi, deleteVideosApi } from "../Video/MVideoApi";

import AVideoList from "./AVideoList";
import AVideoInput from "./AVideoInput";

import "./AVideo.css";
import "./ACommon.css";


function AVideo() {

  const [isModalOpen, setIsModalOpen] = useState(false);

    // I : Insert, U : Update
    const [isType, setIsType] = useState("I");

  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState([]);  
  const [page, setPage] = useState(0);
  const [sortType, setSortType] = useState("LATEST");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("ALL");

  const [selectedIds, setSelectedIds] = useState([]);
  
  const pageSize = 100;  

  useEffect(()=>{
    setVideos([]);
    getVideos();    
  },[]);

  const getVideos = async () => {
 
    try {
      // 비디오 리스트
      const videoRes = await getVideoPageApi(page, pageSize, sortType, search, searchType,"");
      const vData = await videoRes.data.content;
      
      if (vData) {
          setVideos(prev => [...prev, ...vData]);
      }
    } catch (err) {
        console.error(err);
    }
  };

  const deleteVideos = async() => {
    try {
      await deleteVideosApi(selectedIds);

      //setVideos(prev => prev.filter(v => !selectedIds.includes(v.id))); // 리스트 제거

      setVideos(prev =>
          prev.map(v => selectedIds.includes(v.id) ? { ...v, deletedFlag:"Y" } : v)
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

    const video = videos.find(v => v.id === selectedIds[0]);
    setVideo(video);
    setIsModalOpen(true);
    setIsType("U");
  }

  const hendleDelete = () => {

    if (selectedIds.length === 0){
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    if (!window.confirm("선택한 항목을 삭제하시겠습니까?")) return;

    deleteVideos();
  }

  return (

      <div className="av-main-list">

        <div className="av-do-wrap">
          <button className="co-button-status co-ended-all" onClick={() => {setIsModalOpen(true); setIsType("I");}}>등록</button>
          <button className="co-button-status co-ended-all" onClick={() => hendleUpdate()}>수정</button>
          <button className="co-button-status co-ended-all" onClick={() => hendleDelete()}>삭제</button>
        </div>

        <AVideoList 
          videos={videos}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />

        {/* 입력창 */}
        {isModalOpen && (
          <div className="co-modal-overlay">
              <div className="co-modal-item">
                  <div className="co-modal-row">
                    <span className="co-modal-title">{isType === "I" ? "비디오 등록" : "비디오 수정"}</span> 
                    <button className="co-close" onClick={() => setIsModalOpen(false)}>✕</button>
                  </div>
                  <div className="co-modal-detail">
                      <AVideoInput 
                        video={video}
                        setVideos={setVideos} 
                        onClose={() => setIsModalOpen(false)} />
                  </div>
              </div>
          </div>

        )}

      </div>
  );
}

export default AVideo;