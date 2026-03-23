
import React, { useEffect, useRef, useState } from "react";
import "./MySale.css"

function MySale () {

  return (

      <div className="ms-main-list">
        
          <ul className="bk-card-row-title">
            <li style={{width:"5%"}}>순번</li>
            <li style={{width:"10%"}}>생성 일자</li>            
            <li style={{width:"15%"}}>북마크 화면</li>
            <li style={{width:"20%"}}>이름</li>            
            <li style={{width:"40%"}}>제목</li>
            <li style={{width:"10%"}}></li>
          </ul> 

      </div>
  );
}

export default MySale;