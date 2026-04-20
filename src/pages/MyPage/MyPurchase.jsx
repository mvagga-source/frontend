
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrderPageApi } from "./MyMainApi";
import GoodsReviewModal from "../Goods/popup/GoodsReviewModal";
import { formatDate, formatDateTime, getWeekRange, getMonthRange, getYearRange } from "../Admin/ACommon";
import { useAuth } from "../../context/AuthContext";
import { GoodsOrderCancelApi } from "../Goods/GoodsApi";

import "./MyMain.css";

function MyPurchase () {

  const date = new Date();
  const today = formatDate(date);  
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [dateType, setDateType] = useState("day");    

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);  
  const [weekValue, setWeekValue] = useState("");
  const [monthValue, setMonthValue] = useState("");
  const [yearValue, setYearValue] = useState("");

  const [lists, setLists] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [maxPage, setMaxPage] = useState(1);  
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);  
  const [page, setPage] = useState(1);
  const size = 10;

  const {user} = useAuth();
  const [params, setParams] = useState({
    memberId:user.id,
    page : page,
    size : size,
    pageType: "",
    startDate: today,
    endDate: today,
  });    

  const isEmpty = lists.length === 0;

  const getMyOrderList = async(searchParams) => {
    
      try {
          const res = await getMyOrderPageApi(searchParams);

          if(res.data) {

            const { list, maxPage, startPage, endPage, totalCount } = res.data; // AjaxResponse 구조 확인

            setLists(list || []);
            setMaxPage(maxPage || 1);
            setStartPage(startPage || 1);
            setEndPage(endPage || 1);
            setTotalCount(totalCount || 0); 
          }
          
        } catch(e){
          console.error("데이터 불러오기 실패 :",e);
        }    
  }

  // 검색 버튼
  const handleSearch = () => {
    
    if(startDate > endDate || !startDate || !endDate) {
      alert("날짜 입력이 잘못되었습니다. 확인 바랍니다.");
      return;
    }

    setParams(prev => ({
      ...prev,
      page : 1,
      startDate : startDate || today, 
      endDate :endDate || today
    }));
  } 

  useEffect(() => {

    getMyOrderList(params);    

  }, [params]);

  useEffect(() => {

    setParams(prev => ({
      ...prev,
      page: page,
    }));
  }, [page]);

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
        <col style={{width:"12%"}}/>          
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>
        <col style={{width:"6%"}}/>                
        <col style={{width:"5%"}}/>
        <col style={{width:"5%"}}/>        
        <col style={{width:"10%"}}/>
        <col style={{width:"6%"}}/>
        <col style={{width:"8%"}}/>
        <col style={{width:"8%"}}/>
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
          <th>리뷰작성</th>          
          <th>처리</th>
        </tr>
      </thead>
      <tbody>

        {isEmpty ? (
            <tr>
              <td colSpan="12" style={{ textAlign: "center", height:"50px" }}>
                데이터가 없습니다.
              </td>
            </tr>
        ) : 
        lists.map((list, index) => (
          <tr key={list.gono}>
            <td style={{textAlign:"center"}}>{totalCount - ((page -1) * size + index)}</td>
            <td style={{textAlign:"center"}}>{formatDateTime(list.crdt)}</td>            
            <td style={{textAlign:"center"}}>{list.orderId}</td>
            <td>{list.receiverName}</td>
            <td style={{textAlign:"center"}}>{list.receiverPhone}</td>
            <td>{list.paymentMethod}</td>
            <td>{list.status}</td>
            <td style={{textAlign:"center"}}>{Number(list.cnt?? 0).toLocaleString()}</td>            
            <td style={{textAlign:"right"}}>{Number(list.totalPrice?? 0).toLocaleString()} 원</td>
            <td style={{textAlign:"center"}}>{list.delivStatus}</td>
            <td>
              <button className="co-button-status co-ongoing-all" onClick={() => {
                setSelectedIds(list.gono);
                setIsModalOpen(true);
              }}>리뷰 작성</button>
            </td>
            <td>
              {/* 상태별 취소/반품 버튼 제어 */}
              {list.delivStatus === "배송대기" ? (
                // 배송대기일 때: 결제취소 버튼
                <button 
                  className="co-button-status co-ongoing-all" 
                  style={{ backgroundColor: "#ff4d4d", color: "#fff" }} // 취소 느낌의 색상
                  onClick={() => {
                    if(window.confirm("결제를 취소하시겠습니까?")) {
                      const formData = new FormData();
                      formData.append("gono", list.gono);
                      // 결제 취소 API 연동 또는 관련 페이지 이동
                      GoodsOrderCancelApi(formData).then((res) => {
                        console.log(res);
                        if (res.data.success) {
                          alert("결제가 취소되었습니다.");
                        }
                      });
                    }
                  }}
                >
                  결제취소
                </button>
              ) : list.delivStatus === "배송완료" ? (
                // 배송완료일 때: 기존 반품 버튼
                <button className="co-button-status co-ongoing-all" onClick={() => {
                  navigate(`/GoodsReturn/${list.gono}`)
                }}>
                  반품처리
                </button>
              ) : (
                // 배송중 등 기타 상태일 때
                <button className="co-button-status co-ongoing-all">
                <span style={{ fontSize: "12px", color: "#888" }}>변경불가</span>
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>

    {/* 페이징 */}
    <div className="my-pagination">

        <button className={`my-next-prev__button ${page > 1 ? "active" : "" }`}
              onClick={() => setPage(p => Math.max(p - 1, 1))}>
          이전
        </button>

        {/* 페이지 번호 */}
        {
        Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((p) => (
            <button
                  className={`my-pages__button ${p === page ? "active" : ""}`}
                  key={p}
                  disabled={p === page}
                  onClick={() => setPage(p)}
            >
              {p}
            </button>
        ))}

        <button className={`my-next-prev__button ${page < maxPage ? "active" : "" }`}
                onClick={() => setPage(p => Math.min(p + 1, maxPage))}>
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