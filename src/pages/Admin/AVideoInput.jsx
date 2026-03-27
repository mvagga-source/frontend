import { useState } from "react";
import { saveVideoApi } from "../Video/MVideoApi";

function AVideoInput({ video, setVideos, onClose }) {

  const [form, setForm] = useState(()=>{
    return video ? {...video} : {
      name: "",
      title: "",    
      url: "",
      status: "1",
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
    saveVideo();
  };

  const saveVideo = async () => {
 
          try {
            // 비디오 저장
            const videoRes = await saveVideoApi(form);

            if (video && video.id) {
              setVideos(prev =>
                prev.map(v => v.id === video.id ? videoRes.data : v)
              );

              onClose();
              
            }else{
              setVideos(prev => [videoRes.data, ...prev]);
            }
            
          } catch (err) {
              console.error(err);
          }

          // 입력폼 초기화
          setForm({
              name: "",
              title: "",    
              url: "",
              status: "1",
          });
  };  

  return (
    <form onSubmit={handleSubmit} className="av-finput">

      {/* 제목 */}
      {/* <div className="co-info-row">
        <span className="co-info-label">제목</span>
        <span className="co-info-val">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </span>
      </div> */}

      {/* 작성자 */}
      <div className="co-info-row">
        <span className="co-info-label">이름</span>
        <span className="co-info-val">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
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

      {/* 상태 */}
      <div className="co-info-row">
        <span className="co-info-label">상태</span>
        <span className="co-info-val">
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="1">통과</option>
            <option value="0">탈락</option>
          </select>
        </span>
      </div>

      <div className="co-button-row">
        <button type="submit" className="co-button-status co-ongoing-bc">저장</button>
        <button type="button" className="co-button-status co-ended-bc" onClick={onClose}>닫기</button>
      </div>

    </form>
  );
}

export default AVideoInput;