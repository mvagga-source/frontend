
import React, { useEffect, useRef, useState } from "react";
import { getMyVotePageApi } from "./MyMainApi";
import { formatDate, formatDateTime } from "../Admin/ACommon";

function MyVote () {

  const [page, setPage] = useState(1);
  const [grouped,setGrouped] = useState([]);
  const size = 10;  

  const getMyVotePage = async() => {
    
      try {
          const res = await getMyVotePageApi(page, size);

          if(res.data && res.data.success) {

            console.log("getMyVotePageApi : ",res.data.data);

            setGrouped(res.data.data.reduce((acc, cur) => {
                if (!acc[cur.VOTE_DATE]) {
                  acc[cur.VOTE_DATE] = [];
                }
                acc[cur.VOTE_DATE].push(cur);
                  return acc;
              }, {})
            );

            console.log("grouped : ",grouped);
          }
         } catch(e){
          console.error("데이터 불러오기 실패 :",e);
        }    
  }

  useEffect(()=>{
    getMyVotePage();
  },[]);

  return (
    <>
    <div className="my-form-wrap">
    </div>

    <table className="my-table">
      <colgroup>
        <col style={{width:"5%"}}/>
        <col style={{width:"15%"}}/>        
        <col style={{width:"70%"}}/>          
        <col style={{width:"10%"}}/>
      </colgroup>
      <thead>
        <tr>
          <th>순번</th>
          <th>투표일자</th>
          <th>투표내용</th>          
          <th>처리</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(grouped).map(([date, idols], index) => (
          <tr key={date}>
            <td style={{textAlign:"center"}}>{Object.entries(grouped).length - index} </td>
            <td style={{textAlign:"center"}}>{formatDateTime(date)}</td>
            <td className="my-idol-wrap">
             {idols.map((idol) => (
                <ul className="my-ongoing-all">
                  <li>
                    <img 
                      key={idol.IDOL_ID}
                      src={`http://localhost:8181/upload/${idol.MAIN_IMG_URL}`}
                      alt=""
                    />
                  </li>
                  <li>
                    {idol.NAME}
                  </li>
                </ul>                
             ))}
            </td>
            <td style={{textAlign:"center"}}>
              <button className="co-button-status co-upcoming-all"
                      onClick={()=>{

                      }}
              >삭제</button>
            </td>
          </tr>

        ))}

      </tbody>
      
    </table>

    </>
  );
}

export default MyVote;