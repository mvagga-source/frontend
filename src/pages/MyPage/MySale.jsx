
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getGoodsListApi } from "../Goods/GoodsApi";
import { formatDate, formatDateTime } from "../Admin/ACommon";

import "./MyMain.css"

function MySale () {

  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);  
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");  
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 상태  
  const size = 10;

  const getGoodsList = async (page, searchParams) => {
        try {
            const res = await getGoodsListApi(page, size, {
                ...searchParams,
                minPrice: minPrice || 0,
                maxPrice: maxPrice || 0,
                sortDir: sortDirection // 현재 정렬 상태 포함
            });
            
            if (res.data && res.data.success) {
                console.log(res);
                const { list, maxPage, startPage, endPage, totalCount } = res.data; // AjaxResponse 구조 확인
                setList(list || []);
                setTotalPages(maxPage || 1);
                setStartPage(startPage || 1);
                setEndPage(endPage || 1);
                setTotalCount(totalCount || 0);
            }
        } catch (error) {
            console.error("상품 목록 로딩 실패:", error);
        }
  };  

  useEffect(()=>{
    getGoodsList();
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
    <div className="my-form-wrap">
        <button className="co-button-status co-ongoing-all" 
                onClick={()=>{
                  navigate("/GoodsWrite",{
                      state: {
                        from: location.pathname
                  }});
                }}
        >상품등록</button>
    </div>

    <table className="my-table">
      <colgroup>
        {/* <col style={{width:"5%"}}/> */}
        <col style={{width:"5%"}}/>
        <col style={{width:"15%"}}/>        
        <col style={{width:"15%"}}/>          
        <col style={{width:"25%"}}/>
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>                
        <col style={{width:"5%"}}/>
        <col style={{width:"5%"}}/> 
        <col style={{width:"10%"}}/>
      </colgroup>
      <thead>
        <tr>
          {/* <th>
            <input type="checkbox"
                  onChange={handleAllCheck}
                  checked={selectedIds.length === list.length}
            />
          </th> */}
          <th>순번</th>
          <th>등록일자</th>
          <th>이미지</th>          
          <th>상품명</th>          
          <th>가격</th>
          <th>재고</th>          
          <th>상태</th>
          <th>삭제</th>          
          <th>처리</th>
        </tr>
      </thead>
      <tbody>

        {list.map((l, index) => (
          <tr key={l.gno}>
            {/* 
            <td style={{textAlign:"center"}}>
              <input type="checkbox"
                    checked={selectedIds.includes(l.gono)}
                    onChange={()=>handleCheck(l.gono)}              
              />
            </td>
            */}
            <td style={{textAlign:"center"}}>{totalCount - index}</td>
            <td style={{textAlign:"center"}}>{formatDateTime(l.crdt)}</td>
            <td style={{textAlign:"center"}}><img src={l.gimg} style={{height:"90px"}}/></td>            
            <td style={{textAlign:"left"}}>{l.gname}</td>
            <td style={{textAlign:"right"}}>{Number(l.price?? 0).toLocaleString()} 원</td>
            <td style={{textAlign:"center"}}>{Number(l.stockCnt?? 0).toLocaleString()}</td>            
            <td style={{textAlign:"center"}}>{l.status}</td>
            <td style={{textAlign:"center"}}>{String(l.delYn?? "").toUpperCase()}</td>
            <td>
              <button className="co-button-status co-ongoing-all"
                      onClick={()=>{
                        navigate("/GoodsUpdate",{
                            state: {
                              from: location.pathname
                        }});
                      }}        
              >수정</button>
              <button className="co-button-status co-ongoing-all">삭제</button>
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>

    </>

  );
}

export default MySale;