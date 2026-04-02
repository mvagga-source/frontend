
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoodsDeleteApi } from "../Goods/GoodsApi";
import { getMySalePageApi } from "./MyMainApi";
import { formatDate, formatDateTime } from "../Admin/ACommon";
import { useAuth } from "../../context/AuthContext";

import "./MyMain.css"

function MySale () {

  const navigate = useNavigate();
  const location = useLocation();

  const date = new Date();
  const today = formatDate(date);  

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);  

  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);  
  const [page, setPage] = useState();
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 상태  
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

  const getGoodsList = async (searchParams) => {
        try {
            const res = await getMySalePageApi(
            {
              ...searchParams,
              startDate : startDate || today, 
              endDate :endDate || today,
              sortDir: sortDirection, // 현재 정렬 상태 포함
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

  const GoodsDelete = async(gno) =>{

    try{
      const formData = new FormData();
      formData.append("gno", gno);

      const res = await GoodsDeleteApi(formData);

      if(res.data.success) {
        setList(prev => 
          prev.map(v => v.gno === gno
            ? { ...v, delYn : "Y" } 
            : v
          )
        );
      }

    }catch(error){
      console.error("삭제 실패 : ",error);
    }
  }

  useEffect(()=>{
    getGoodsList();
  },[]);  

  const handleSearch = () => {
    
    if(startDate > endDate || !startDate || !endDate) {
      alert("날짜 입력이 잘못되었습니다. 확인 바랍니다.");
      return;
    }
    getGoodsList(params.current);
  }  

  const handleDelete = (gno) => {
    if (!window.confirm("상품 정보를 삭제하시겠습니까?")) return;
    GoodsDelete(gno)
  }

  return (
    
    <>
    <div className="my-form-wrap">
      <input type="date" value={startDate} name="startDate" onChange={(e)=>setStartDate(e.target.value)} /> -
      <input type="date" value={endDate} name="endDate" onChange={(e)=>setEndDate(e.target.value)}/>
      <button onClick={handleSearch}>등록일자 검색</button>

      <span style={{margin:"0 10px 0 15px"}}>/</span>

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
        <col style={{width:"10%"}}/>
        <col style={{width:"10%"}}/>
      </colgroup>
      <thead>
        <tr>
          <th>순번</th>
          <th>등록일자</th>
          <th>이미지</th>          
          <th>상품명</th>          
          <th>가격</th>
          <th>재고</th>          
          <th>상태</th>
          <th>처리</th>
        </tr>
      </thead>
      <tbody>
        {isEmpty ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", height:"50px" }}>
                데이터가 없습니다.
              </td>
            </tr>
        ) :
        list.map((l, index) => (
          <tr key={l.gno}>
            <td style={{textAlign:"center"}}>{totalCount - index}</td>
            <td style={{textAlign:"center"}}>{formatDateTime(l.crdt)}</td>
            <td style={{textAlign:"center"}}><img src={l.gimg} style={{height:"90px"}}/></td>            
            <td style={{textAlign:"left"}}>{l.gname}</td>
            <td style={{textAlign:"right"}}>{Number(l.price?? 0).toLocaleString()} 원</td>
            <td style={{textAlign:"center"}}>{Number(l.stockCnt?? 0).toLocaleString()}</td>            
            <td style={{textAlign:"center"}}>{l.status}</td>
            <td>
              <button className="co-button-status co-ongoing-all"
                      onClick={()=>{
                        navigate(`/GoodsUpdate/${l.gno}`,{
                            state: {
                              from: location.pathname
                        }});
                      }}        
              >수정</button>
              <button className="co-button-status co-upcoming-all"
                      onClick={()=>{
                        handleDelete(l.gno);
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

export default MySale;