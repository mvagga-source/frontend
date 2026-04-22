import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySalePageApi } from "./MyMainApi"; // 판매자 전용 API 가정
import { formatDate, formatDateTime, getWeekRange, getMonthRange, getYearRange } from "../Admin/ACommon";
import { useAuth } from "../../context/AuthContext";
import "./MyMain.css";

function MySale() {
  const navigate = useNavigate();
  const date = new Date();
  const today = formatDate(date);
  const { user } = useAuth();

  // 검색 및 필터 상태
  const [dateType, setDateType] = useState("day");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [weekValue, setWeekValue] = useState("");
  const [monthValue, setMonthValue] = useState("");
  const [yearValue, setYearValue] = useState("");

  // 데이터 상태
  const [lists, setLists] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [page, setPage] = useState(1);
  const size = 10;

  const [params, setParams] = useState({
    memberId: user.id, // 판매자 ID 기준
    page: page,
    size: size,
    startDate: today,
    endDate: today,
  });

  const isEmpty = lists.length === 0;

  // 판매 내역 조회 API 호출
  const getSaleOrderList = async (searchParams) => {
    try {
      const res = await getMySalePageApi(searchParams);
      if (res.data) {
        const { list, maxPage, startPage, endPage, totalCount } = res.data;
        setLists(list || []);
        setMaxPage(maxPage || 1);
        setStartPage(startPage || 1);
        setEndPage(endPage || 1);
        setTotalCount(totalCount || 0);
      }
    } catch (e) {
      console.error("판매 데이터 불러오기 실패 :", e);
    }
  };

  const handleSearch = () => {
    if (startDate > endDate || !startDate || !endDate) {
      alert("날짜 입력이 잘못되었습니다.");
      return;
    }
    setParams(prev => ({
      ...prev,
      page: 1,
      startDate: startDate || today,
      endDate: endDate || today
    }));
  };

  useEffect(() => {
    getSaleOrderList(params);
  }, [params]);

  useEffect(() => {
    setParams(prev => ({ ...prev, page: page }));
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

        {dateType === "week" && <input type="week" value={weekValue} onChange={(e) => {
          setWeekValue(e.target.value);
          const { startDate, endDate } = getWeekRange(e.target.value);
          setStartDate(startDate); setEndDate(endDate);
        }} />}
        {dateType === "month" && <input type="month" value={monthValue} onChange={(e) => {
          setMonthValue(e.target.value);
          const { startDate, endDate } = getMonthRange(e.target.value);
          setStartDate(startDate); setEndDate(endDate);
        }} />}
        {dateType === "year" && <input type="number" value={yearValue} onChange={(e) => {
          setYearValue(e.target.value);
          const { startDate, endDate } = getYearRange(e.target.value);
          setStartDate(startDate); setEndDate(endDate);
        }} placeholder="연도" />}
        {dateType === "day" && (
          <>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> - 
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </>
        )}
        <button onClick={handleSearch}>검색</button>
      </div>

      <table className="my-table">
        <thead>
          <tr>
            <th>순번</th>
            <th>주문일시</th>
            <th>주문번호</th>
            <th>상품명</th>
            <th>구매자</th>
            <th>금액</th>
            <th>수량</th>
            <th>주문상태</th>
            <th>배송상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {lists.length === 0 ? (
            <tr><td colSpan="10" style={{ textAlign: "center", height:"50px" }}>데이터가 없습니다.</td></tr>
          ) : (
            lists.map((item, index) => (
              <tr key={item.gono} className={item.status === 'CANCEL' ? 'row-muted' : ''}>
                <td style={{textAlign:"center"}}>{totalCount - ((page - 1) * size + index)}</td>
                <td style={{textAlign:"center"}}>{formatDateTime(item.crdt)}</td>
                <td style={{textAlign:"center"}}>{item.orderId}</td>
                <td className="text-ellipsis">{item.goods.gname}</td>
                <td style={{textAlign:"center"}}>{item.member.nickname}</td>
                <td style={{textAlign:"right"}}>
                  {Number(item.totalPrice).toLocaleString()}원
                </td>
                <td style={{textAlign:"right"}}>
                  {item.cnt}
                </td>
                <td style={{textAlign:"center"}}>
                   <span className={`status-label ${item.status}`}>
                     {item.status === 'CANCEL' ? '결제취소' : '결제완료'}
                   </span>
                </td>
                <td style={{textAlign:"center"}}>
                  <span className="deliv-text">{item.delivStatus}</span>
                </td>
                <td style={{textAlign:"center"}}>
                  <button 
                    className="co-button-status co-ongoing-all"
                    onClick={() => navigate(`/GoodsOrderSale/${item.gono}`)}
                  >
                    상세
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이징 (기존 로직 동일) */}
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
    </>
  );
}

export default MySale;