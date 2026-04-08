
import React, { useEffect, useRef, useState } from "react";
import { getMyOrderPageApi } from "./MyMainApi";
import GoodsReviewModal from "../Goods/popup/GoodsReviewModal";
import { formatDate, formatDateTime, getWeekRange, getMonthRange, getYearRange } from "../Admin/ACommon";
import { useAuth } from "../../context/AuthContext";

import "./MyMain.css";

function MyPurchase () {

  const date = new Date();
  const today = formatDate(date);  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [dateType, setDateType] = useState("day");    

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);  
  const [weekValue, setWeekValue] = useState("");
  const [monthValue, setMonthValue] = useState("");
  const [yearValue, setYearValue] = useState("");

  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [maxPage, setMaxPage] = useState(1);  
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);  
  const [page, setPage] = useState(1);
  const size = 10;

  const {user} = useAuth();
  const params = useState({
    memberId : user.id, 
    page : page,
    size: size,
    startDate:"",
    endDate:"",
  });  

  const isEmpty = list.length === 0;

  const getMyOrderList = async(searchParams) => {
    
      try {
          const res = await getMyOrderPageApi(
            {
              ...searchParams,
              startDate : startDate || today, 
              endDate :endDate || today
            }
          );

          if(res.data && res.data.success) {

            const { list, maxPage, startPage, endPage, totalCount } = res.data; // AjaxResponse 구조 확인

            // console.log("list : ",list);
            // console.log("maxPage : ",maxPage);
            // console.log("startPage : ",startPage);
            // console.log("endPage : ",endPage);
            // console.log("totalCount : ",totalCount);

            setList(list || []);
            setTotalPages(maxPage || 1);
            setStartPage(startPage || 1);
            setEndPage(endPage || 1);
            setTotalCount(totalCount || 0); 
          }
          
        } catch(e){
          console.error("데이터 불러오기 실패 :",e);
        }    
  }

  useEffect(()=>{
    getMyOrderList(params.current);
  },[]);

  const handleSearch = () => {
    
    if(startDate > endDate || !startDate || !endDate) {
      alert("날짜 입력이 잘못되었습니다. 확인 바랍니다.");
      return;
    }
    getMyOrderList(params.current);
  } 

  return (
    <>
    <div className="my-form-wrap">

      <select onChange={(e) => setDateType(e.target.value)}>
        <option value="day">일</option>
        <option value="week">주</option>
        <option value="month">월</option>
        <option value="year">년</option>
      </select>
      {dateType === "week" && <input type="week" value={weekValue} onChange={(e)=>{
        setWeekValue(e.target.value);
        const { startDate, endDate } = getWeekRange(e.target.value);
        setStartDate(startDate);
        setEndDate(endDate);          
      }} />}
      {dateType === "month" && <input type="month" value={monthValue} onChange={(e)=>{
        setMonthValue(e.target.value);
        const { startDate, endDate } = getMonthRange(e.target.value);
        setStartDate(startDate);
        setEndDate(endDate);        
      }}/>}
      {dateType === "year" && <input type="number" value={yearValue} onChange={(e)=>{
        setYearValue(e.target.value);
        const { startDate, endDate } = getYearRange(e.target.value);
        setStartDate(startDate);
        setEndDate(endDate);        
      }} placeholder="연도" />}      
      {dateType === "day" && 
        <>
          <input type="date" value={startDate} name="startDate" onChange={(e)=>setStartDate(e.target.value)} /> - 
          <input type="date" value={endDate} name="endDate" onChange={(e)=>setEndDate(e.target.value)}/>
        </>
      } 
      <button onClick={handleSearch}>검색</button>
    </div>

    <table className="my-table">
      <colgroup>
        <col style={{width:"5%"}}/>
        <col style={{width:"10%"}}/>        
        <col style={{width:"15%"}}/>          
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>                
        <col style={{width:"5%"}}/>
        <col style={{width:"5%"}}/>        
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>
      </colgroup>
      <thead>
        <tr>
          <th>순번</th>
          <th>주문일자</th>
          <th>주문번호</th>
          <th>배송지 받는분</th>          
          <th>연락처</th>
          <th>결재방식</th>          
          <th>결재상태</th>
          <th>주문수량</th>          
          <th>주문금액</th>
          <th>배송상태</th>
          <th>처리</th>          
        </tr>
      </thead>
      <tbody>

        {isEmpty ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center", height:"50px" }}>
                데이터가 없습니다.
              </td>
            </tr>
        ) : 
        list.map((l, index) => (
          <tr key={l.gono}>
            <td style={{textAlign:"center"}}>{totalCount - index}</td>
            <td style={{textAlign:"center"}}>{formatDateTime(l.crdt)}</td>            
            <td style={{textAlign:"center"}}>{l.orderId}</td>
            <td>{l.receiverName}</td>
            <td style={{textAlign:"center"}}>{l.receiverPhone}</td>
            <td>{l.paymentMethod}</td>
            <td>{l.status}</td>
            <td style={{textAlign:"center"}}>{Number(l.cnt?? 0).toLocaleString()}</td>            
            <td style={{textAlign:"right"}}>{Number(l.totalPrice?? 0).toLocaleString()} 원</td>
            <td style={{textAlign:"center"}}>{l.delivStatus}</td>
            <td>
              <button className="co-button-status co-ongoing-all" onClick={() => {
                setSelectedIds(l.gono);
                setIsModalOpen(true);
              }}>리뷰 작성하기</button>
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>

    {/* 페이징 */}
    <div className="my-pagination">

        <button className="my-next-prev__button" onClick={() => setPage(p => Math.max(p - 1, 1))}>
          이전
        </button>

        {/* 페이지 번호 */}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            className="my-pages__button active"
            key={page}
            onClick={() => setPage(page)}
            style={{
              fontWeight: page === page ? "bold" : "normal",
            }}
          >
            {page}
          </button>
        ))}

        <button className="my-next-prev__button" onClick={() => setPage(p => Math.min(p + 1, maxPage))}>
          다음
        </button>        
    </div>    

    {/* 팝업 렌더링 */}
    {isModalOpen && (
        <GoodsReviewModal 
            gono={selectedIds} // 실제로는 주문 목록에서 가져온 번호 전달
            onClose={() => setIsModalOpen(false)}
        />
    )}
    </>
  );

}

export default MyPurchase;