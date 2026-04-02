
import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getMyVotePageApi, deleteMyVoteApi } from "./MyMainApi";
import { formatDate, formatDateTime } from "../Admin/ACommon";
import { useAuth } from "../../context/AuthContext";

function MyVote () {

  const date = new Date();
  const today = formatDate(date);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [currentPage, setCurrentPage] = useState(1);
  const [grouped,setGrouped] = useState([]);
  const size = 10;

  const isEmpty = Object.keys(grouped).length === 0;

  const {user} = useAuth();

  const params = useRef({
    startDate:"",
    endDate:"",
  });

  const getMyVotePage = async(page, searchParams) => {
    
      try {
          const res = await getMyVotePageApi(page, size, 
            {
              ...searchParams,
              startDate : startDate || today, 
              endDate :endDate || today
            }
          );

          if(res.data && res.data.success) {

            // console.log("getMyVotePageApi : ",res.data.data); 

            setGrouped(res.data.data.reduce((acc, cur) => {

                const date = cur.VOTE_DATE;
                const voitId = cur.VOTEID;   
                const round = cur.AUDITION_ID;

                if (!acc[date]) acc[date] = {};
                if (!acc[date][voitId]) acc[date][voitId] = [];
                if (!acc[date][voitId][round]) acc[date][voitId][round] = [];                

                acc[date][voitId][round].push(cur);

                return acc;
              }, {})              
            );
          }
         } catch(e){
          console.error("데이터 불러오기 실패 :",e);
        }    
  }

  const delteMyVote = async(date, voteId) => {

    console.log("date : ",date);
    console.log("voteId : ",voteId);
    
      try {
          const res = await deleteMyVoteApi(voteId);

          if(res.data.success) {
            setGrouped(prevGrouped =>{
              const newGrouped = {...prevGrouped};
              delete newGrouped[date];
              return newGrouped;
            });

            alert("삭제 되었습니다. 투표하기에서 재투표 가능 합니다.");
          }
         } catch(e){
          console.error("데이터 삭제 실패 :",e);
        }    
  }  

  useEffect(()=>{
      setCurrentPage(1);
      getMyVotePage(currentPage, params.current);
  },[]);

  const handleSearch = () => {
    if(startDate > endDate || !startDate || !endDate) {
      alert("날짜 입력이 잘못되었습니다. 확인 바랍니다.");
      return;
    }
    setCurrentPage(1);
    getMyVotePage(currentPage, params.current);
  }

  const handleDelte = (date, voteId) => {

    if(formatDate(date) != today) {
      alert("당일 투표만 삭제 가능합니다.");
      return;
    }

    if (!window.confirm("투표 내용을 삭제 하시겠습니까?")) return;

    delteMyVote(date, voteId);
  }

  // 참가자 프로필 이동  
  const navigate = useNavigate();
  const goToProfile = (profileId) => {
    navigate(`/Audition/profile/${profileId}`);
  };

  return (
    <>
    <div className="my-form-wrap">
      <input type="date" value={startDate} name="startDate" onChange={(e)=>setStartDate(e.target.value)} /> -
      <input type="date" value={endDate} name="endDate" onChange={(e)=>setEndDate(e.target.value)}/>
      <button onClick={handleSearch}>검색</button>
    </div>

    <div className=""></div>

    <table className="my-table">
      <colgroup>
        <col style={{width:"5%"}}/>
        <col style={{width:"15%"}}/>        
        <col style={{width:"80%"}}/>          
        {/* <col style={{width:"10%"}}/> */}
      </colgroup>
      <thead>
        <tr>
          <th>순번</th>
          <th>투표일자</th>
          <th>투표내용</th>          
          {/* <th>처리</th> */}
        </tr>
      </thead>
      <tbody>

        {isEmpty ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", height:"50px" }}>
                데이터가 없습니다.
              </td>
            </tr>

        ) : 
          
          Object.keys(grouped).map((date,index) => (
            <tr key={date}>
              <td style={{textAlign:"center"}}>{Object.keys(grouped).length - index} </td>
              <td style={{textAlign:"center"}}>{formatDateTime(date)}</td>

                {Object.keys(grouped[date]).map((voteId) => (
                  
                  <td key={voteId}>

                  {Object.keys(grouped[date][voteId]).map((round) => (
                      <div key={round} className="my-idol-wrap">
                        <div className="my-iodl-round">{round}차 경연</div>
                        {grouped[date][voteId][round].map(idol => ( 

                            <ul className={`av-card ${idol.STATUS === "eliminated" ? "voted-dim" : "voted-selected"}`} 
                                onClick={() => goToProfile(idol.PROFILEID)}
                            >
                              <li>
                                <img 
                                  key={idol.PROFILEID}
                                  src={`${process.env.REACT_APP_API_URL.replace(/\/api$/, "")}/upload/action profile/${idol.MAIN_IMG_URL}`}
                                  style={{
                                          filter: idol.STATUS === "eliminated" ? "grayscale(100%)" : "none"
                                        }}
                                />
                              </li>
                              <li>
                                {idol.NAME}
                              </li>
                            </ul>
                        ))}

                        <div className="my-iodl-round">
                          {formatDate(date) === today &&
                            <button className="co-button-status co-upcoming-all"
                                    onClick={()=> handleDelte(date, voteId)}
                            >삭제</button>
                          }
                        </div>
                      </div>
                    ))}
                  </td>
                ))}              

            </tr>
          ))
      }

      </tbody>
      
    </table>

    </>
  );
}

export default MyVote;