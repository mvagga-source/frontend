
import React, { useEffect, useRef, useState } from "react";
import { getMyOrderListApi } from "./MyMainApi";
import GoodsReviewModal from "../Goods/popup/GoodsReviewModal";
import { formatDate, formatDateTime } from "../Admin/ACommon";

import "./MyMain.css";

function MyPurchase () {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);  
  const [page, setPage] = useState(1);
  const size = 10;

  const getMyOrderList = async() => {
    
      try {
          const res = await getMyOrderListApi(page, size);

          if(res.data && res.data.success) {
            console.log(res.data);
            const { list, maxPage, startPage, endPage, totalCount } = res.data; // AjaxResponse 구조 확인

            console.log("list : ",list);
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
    getMyOrderList();
  },[]);

  const handleAllCheck =(e)=>{
    if(e.target.checked) {
      const allIds = list.map((v)=>v.gono);
      setSelectedIds(allIds);
    }else{
      setSelectedIds([]);
    }
  }

  const handleCheck = (gono) => {

    setSelectedIds((prev) =>
      prev.includes(gono)
        ? prev.filter((item) => item !== gono) // 제거
        : [...prev, gono] // 추가
    );
  };  

  return (
    <>
    <div className="my-btn-wrap">
        <button className="co-button-status co-ongoing-all" onClick={() => {
          if(selectedIds.length !== 1) {
            alert("하나만 선택해서 리뷰작성이 가능합니다.");
            return;
          }
          setIsModalOpen(true);
        }}>리뷰 작성하기</button>
    </div>

    <table className="my-table">
      <colgroup>
        <col style={{width:"5%"}}/>
        <col style={{width:"5%"}}/>
        <col style={{width:"10%"}}/>        
        <col style={{width:"15%"}}/>          
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>                
        <col style={{width:"10%"}}/>
        <col style={{width:"5%"}}/>        
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>
      </colgroup>
      <thead>
        <tr>
          <th>
            {/* <input type="checkbox"
                  onChange={handleAllCheck}
                  checked={selectedIds.length === list.length}
            /> */}
          </th>
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
        </tr>
      </thead>
      <tbody>
        {list.map((l, index) => (
          <tr key={l.gono}>
            <td style={{textAlign:"center"}}>
              <input type="checkbox"
                    checked={selectedIds.includes(l.gono)}
                    onChange={()=>handleCheck(l.gono)}              
              />
            </td>
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
          </tr>
        ))}
      </tbody>
      
    </table>

    {/* 팝업 렌더링 */}
    {isModalOpen && (
        <GoodsReviewModal 
            //gno={gno}
            gono={selectedIds[0]} // 실제로는 주문 목록에서 가져온 번호 전달
            onClose={() => setIsModalOpen(false)}
        />
    )}
    </>
  );

}

export default MyPurchase;