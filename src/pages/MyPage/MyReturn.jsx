
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Form } from "react-router-dom";
import { getGoodsReturnListApi, GoodsReturnDeleteApi } from "../Goods/GoodsApi";
import { formatDate, formatDateTime } from "../Admin/ACommon";
import { useAuth } from "../../context/AuthContext";

import "./MyMain.css"

function MyReturn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const date = new Date();
  const today = formatDate(date);

  // 상태 관리
  const [lists, setLists] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [page, setPage] = useState(1);
  const size = 10;

  const saved = JSON.parse(localStorage.getItem("myReturnDate") || "{}");

  const [startDate, setStartDate] = useState(saved.startDate || today);
  const [endDate, setEndDate] = useState(saved.endDate || today);

  const [params, setParams] = useState({
    memberId: user.id,
    page: 1,
    size: size,
    startDate: saved.startDate || today,
    endDate: saved.endDate || today,
  });

  const isEmpty = lists.length === 0;

  // 데이터 로딩 함수
  const getReturnList = async (searchParams) => {
    getGoodsReturnListApi(searchParams).then(res => {
      if (res.data) {
        const { list, maxPage, startPage, endPage, totalCount } = res.data;
        setLists(list || []);
        setMaxPage(maxPage || 1);
        setStartPage(startPage || 1);
        setEndPage(endPage || 1);
        setTotalCount(totalCount || 0);
      }
    });
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    if (startDate > endDate || !startDate || !endDate) {
      alert("날짜 입력이 잘못되었습니다. 확인 바랍니다.");
      return;
    }
    setParams(prev => ({
      ...prev,
      page: 1,
      startDate: startDate,
      endDate: endDate
    }));
  };

  // 취소(삭제) 처리 함수 추가
  const handleCancelReturn = async (rno, currentStatus) => {
    // '접수' 상태일 때만 취소가 가능하도록 방어 로직
    if (currentStatus !== "접수") {
      alert("접수 완료된 이후에는 취소가 불가능합니다. 고객센터에 문의해주세요.");
      return;
    }
    
    if (!window.confirm("반품/교환 신청을 취소하시겠습니까?")) return;
    const formData = new FormData();
    formData.append("rno", rno);
    GoodsReturnDeleteApi(formData).then(res => {
      if (res.data.success) {
        alert("취소되었습니다.");
        getReturnList(params);
      }
    });
  };

  useEffect(() => {
    getReturnList(params);
  }, [params]);

  // 페이지 변경 시 params 업데이트
  useEffect(() => {
    setParams(prev => ({ ...prev, page: page }));
  }, [page]);

  return (
    <>
      <div className="my-form-wrap">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> -
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={handleSearch}>검색</button>
      </div>

      <table className="my-table">
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>순번</th>
            <th>신청일자</th>
            <th>구분</th>
            <th>상품명(수량)</th>
            <th>사유</th>
            <th>환불예정금액</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", height: "50px" }}>
                신청 내역이 없습니다.
              </td>
            </tr>
          ) : (
            lists.map((item, index) => (
              <tr key={item.rno}>
                <td style={{ textAlign: "center" }}>{totalCount - ((page - 1) * size) - index}</td>
                <td style={{ textAlign: "center" }}>{formatDateTime(item.crdt)}</td>
                <td style={{ textAlign: "center" }}>
                   <span className={item.returnType === '교환' ? 'status-exchange' : 'status-return'}>
                    {item.returnType}
                   </span>
                </td>
                <td style={{ textAlign: "left" }}>
                  {/* order.goods.gname 구조에 접근 */}
                  {item.order?.goods?.gname} ({item.returnCnt}개)
                </td>
                <td style={{ textAlign: "center" }}>{item.returnReason}</td>
                <td style={{ textAlign: "right" }}>
                  {item.returnType === '반품' ? `${Number(item.refundPrice || 0).toLocaleString()}원` : '-'}
                </td>
                <td style={{ textAlign: "center" }}>
                  <strong>{item.returnStatus}</strong>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button 
                    className="my-status_btn my-upcoming-all"
                    onClick={() => handleCancelReturn(item.rno, item.returnStatus)}
                  >
                    취소
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이징 로직 동일 */}
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

export default MyReturn;