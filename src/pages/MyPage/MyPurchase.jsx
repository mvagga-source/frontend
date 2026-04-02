
import React, { useEffect, useRef, useState } from "react";
import { getMyOrderPageApi } from "./MyMainApi";
import GoodsReviewModal from "../Goods/popup/GoodsReviewModal";
import { formatDate, formatDateTime } from "../Admin/ACommon";
import { useAuth } from "../../context/AuthContext";

import "./MyMain.css";

function MyPurchase () {

  const date = new Date();
  const today = formatDate(date);  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);  
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);  
  const [page, setPage] = useState(0);
  const size = 10;

  const {user} = useAuth();
  const params = useRef({
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
      <input type="date" value={startDate} name="startDate" onChange={(e)=>setStartDate(e.target.value)} /> -
      <input type="date" value={endDate} name="endDate" onChange={(e)=>setEndDate(e.target.value)}/>
      <button onClick={handleSearch}>검색</button>
    </div>

    <table className="my-table">
      <colgroup>
        {/* <col style={{width:"5%"}}/> */}
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
          <th>작업</th>          
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