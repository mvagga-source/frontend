import { useState } from "react";
import { saveVideoApi } from "../Video/MVideoApi";

function AVideoToggle({ dataParams, onClose }) {

  const {
    idolProfile,
    setVideos,
    video,
  } = dataParams;    

  const [form, setForm] = useState(()=>{
    return video ? {...video} : {
      id : "",
      profileId : "",
      title: "",    
      url: "",
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveVideo = async () => {
 
    try {
      // 비디오 저장
      const res = await saveVideoApi(form);
      const data = res.data;

      if (data) {
        if (video.id) {
          // 수정
          setVideos(prev => prev.map(v => v.id === video.id ? data : v));
          onClose();
        }else{
          // 등록
          setVideos(prev => [data, ...prev]);    
        }
      }
    } catch (err) {
        console.error(err);
    }

    // 입력폼 초기화
    setForm({
        id : "",
        profileId : "",            
        title: "",    
        url: "",
    });
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    saveVideo();
  };  

  return (
    <form onSubmit={handleSubmit} className="av-finput">

      {/* 아이돌 선택 */}
      <div className="co-info-row">
        <span className="co-info-label">아이돌</span>
        <span className="co-info-val">
          <select name="profileId" value={form.profileId} onChange={handleChange}>
            {idolProfile.map(idol => (
              <option value={idol.value}>{idol.label}</option>  
            ))}
          </select>
        </span>
      </div>

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

      {/* URL */}
      <div className="co-info-row">
        <span className="co-info-label">영상 URL</span>
        <span className="co-info-val">
          <input
            type="text"
            name="url"
            value={form.url}
            onChange={handleChange}
          />
        </span>
      </div>

      <div className="co-button-row">
        <button type="submit" className="co-button-status co-ongoing-bc">저장</button>
        <button type="button" className="co-button-status co-ended-bc" onClick={onClose}>닫기</button>
      </div>

    </form>
  );
}

export default AVideoToggle;