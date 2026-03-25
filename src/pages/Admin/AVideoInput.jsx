import { useState } from "react";

function AVideoInput({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    name: "",
    url: "",
    status: "1",
    createdAt: "",
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
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>비디오 등록</h2>

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

      {/* 작성자 */}
      <div>
        <label>작성자</label>
        <input
          type="text"
          name="name"
          value={form.name}
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
          <option value="1">진행중</option>
          <option value="2">예정</option>
        </select>
      </div>

      {/* 날짜 */}
      <div>
        <label>등록일</label>
        <input
          type="date"
          name="createdAt"
          value={form.createdAt}
          onChange={handleChange}
        />
      </div>

      <button type="submit">등록</button>
      <button type="button" onClick={onClose}>닫기</button>
    </form>
  );
}

export default AVideoInput;