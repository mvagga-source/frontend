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

      {/* 작성자 */}
      <div>
        <label>이름</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* 제목 */}
      <div>
        <label>제목</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      {/* URL */}
      <div>
        <label>영상 URL</label>
        <input
          type="text"
          name="url"
          value={form.url}
          onChange={handleChange}
        />
      </div>

      {/* 상태 */}
      <div>
        <label>상태</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="1">통과</option>
          <option value="0">탈락</option>
        </select>
      </div>

      <div className="co-button-wrap">
        <button type="submit">저장</button>
        <button type="button" onClick={onClose}>닫기</button>
      </div>

    </form>
  );
}

export default AVideoInput;