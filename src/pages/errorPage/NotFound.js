import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
      <h2>길을 잃으셨나요?</h2>
      <p>요청하신 페이지를 찾을 수 없습니다. 주소가 정확한지 확인해주세요.</p>
      <button 
        onClick={() => navigate('/')}
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;