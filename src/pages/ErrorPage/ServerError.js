import React from 'react';

const ServerError = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#333' }}>
      <h1 style={{ fontSize: '72px', margin: '0', color: '#dc3545' }}>500</h1>
      <h2>500 시스템에 문제가 발생했습니다</h2>
      <p>서버 내부 오류로 인해 일시적으로 서비스 이용이 어렵습니다.<br/>잠시 후 다시 시도해주세요.</p>
      <button 
        onClick={() => window.location.reload()}
        style={{ padding: '10px 20px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '5px' }}
      >
        새로고침
      </button>
    </div>
  );
};

export default ServerError;