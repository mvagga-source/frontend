import React from 'react';
import { useParams, useNavigate } from "react-router-dom";

// 클릭해서 들어왔을 때 보여줄 "상세 화면"입니다.
export default function IdolDetail() {
  const { id } = useParams(); // 주소창에 있는 id(숫자)를 가져와요.
  const navigate = useNavigate();

  return (
    <div style={{ padding: "50px", color: "white", textAlign: "center" }}>
      <h1>참가자 상세 정보</h1>
      <p style={{ fontSize: "24px" }}>현재 선택한 참가자 번호는 {id}번입니다.</p>
      
      <button 
        onClick={() => navigate(-1)} 
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        뒤로가기
      </button>
    </div>
  );
}