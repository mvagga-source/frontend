
import React, { useEffect, useState } from "react";
import { getIdolSelectBoxApi } from "../Audition/idolApi";

import AVideoList from "./AVideoList";
import AVideoToggle from "./AVideoToggle";

import "./AVideo.css";
import "./ACommon.css";

function AVideo() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isType, setIsType] = useState("I");
  const titleMap = {
    I: "비디오 등록",
    U: "비디오 수정",
  };

  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState([]);  
  const [page, setPage] = useState(0);
  const [sortType, setSortType] = useState("LATEST");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("ALL");
  const [idolProfile, setIdolProfile] = useState([]);
  const pageSize = 100;  

  // API params
  const [params, setParams] = useState({
      page : page,
      size : pageSize,
      sortType : sortType, 
      search : search,
      searchType : searchType,
      deletedFlag : "N"
  });    

  const openModal = (type) => {
    if(type === "I") setVideo([]);
    setIsType(type);
    setIsModalOpen(true);
  };  

  useEffect(() => {
    try{
      getIdolSelectBoxApi({}).then((res) => {
          if (res.data.success) {
              const data = res.data.data.map(i => ({
                  value: i.profileId, 
                  label: i.name       
              }));
              setIdolProfile([{ value: "", label: "== 아이돌 선택 ==" }, ...data]);
          }
      });

    }catch(e){
      console.error("아이돌 프로필 정보 호출",e);
    }

  },[]);  

  const videoListProps = {
    setVideo,
    videos,
    setVideos,
    params,
    setParams,
    openModal,
  };  

  const videoToggleProps = {
    idolProfile,
    setVideos,
    video,
  }

  return (

      <div className="av-main-list">

        <div className="av-form-wrap">
          <button type="button" className="co-button-status co-ongoing-bc" 
            onClick={() => openModal("I")}
          >
              등록
          </button>
        </div>

        <AVideoList 
          dataParams={videoListProps}
        />

        {/* 입력창 */}
        {isModalOpen && (
          <div className="co-modal-overlay">
              <div className="co-modal-item">
                  <div className="co-modal-row">
                    <span className="co-modal-title">{titleMap[isType]}</span> 
                    <button className="co-close" onClick={() => setIsModalOpen(false)}>✕</button>
                  </div>
                  <div className="co-modal-detail">
                      <AVideoToggle
                        dataParams={videoToggleProps}
                        onClose={() => setIsModalOpen(false)} />
                  </div>
              </div>
          </div>

        )}

      </div>
  );
}

export default AVideo;