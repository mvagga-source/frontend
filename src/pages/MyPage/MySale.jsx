
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

  const [lists, setLists] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);  
  const [page, setPage] = useState();
  const size = 10;

  const saved = JSON.parse(localStorage.getItem("mySaleDate") || "{}");
  const {user} = useAuth();
  const [params, setParams] = useState({
    memberId:user.id,
    page : page,
    size : size,
    pageType: "",
    startDate: saved.startDate || today,
    endDate: saved.endDate || today,
  });   

  const [startDate, setStartDate] = useState(saved.startDate || today);
  const [endDate, setEndDate] = useState(saved.endDate || today);    

  const isEmpty = lists.length === 0;

  const getGoodsList = async (searchParams) => {

        try {
            const res = await getMySalePageApi(searchParams);

            if (res.data) {
                const { list, maxPage, startPage, endPage, totalCount } = res.data; // AjaxResponse 구조 확인
                setLists(list || []);
                setMaxPage(maxPage || 1);
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
        setLists(prev => 
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

  const handleDelete = (gno) => {
    if (!window.confirm("상품 정보를 삭제하시겠습니까?")) return;
    GoodsDelete(gno)
  }

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

    getGoodsList(params);    

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
      <input type="date" value={startDate} name="startDate" onChange={(e)=>setStartDate(e.target.value)} /> -
      <input type="date" value={endDate} name="endDate" onChange={(e)=>setEndDate(e.target.value)}/>
      <button onClick={handleSearch}>검색</button>

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
        <col style={{width:"15%"}}/>
        <col style={{width:"10%"}}/>
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
          <th>이동</th>          
          <th>처리</th>
        </tr>
      </thead>
      <tbody>
        {isEmpty ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", height:"50px" }}>
                데이터가 없습니다.
              </td>
            </tr>
        ) :
        lists.map((list, index) => (
          <tr key={list.gno}>
            <td style={{textAlign:"center"}}>{totalCount - index}</td>
            <td style={{textAlign:"center"}}>{formatDateTime(list.crdt)}</td>
            <td style={{textAlign:"center"}}><img src={`${process.env.REACT_APP_IMG_URL}${list.gimg}`} style={{height:"90px"}}/></td>            
            <td style={{textAlign:"left"}}>{list.gname}</td>
            <td style={{textAlign:"right"}}>{Number(list.price?? 0).toLocaleString()} 원</td>
            <td style={{textAlign:"center"}}>{Number(list.stockCnt?? 0).toLocaleString()}</td>            
            <td style={{textAlign:"center"}}>{list.status}</td>
            <td style={{textAlign:"center"}}>

              <button className="co-button-status co-ongoing-all"
                onClick={()=>{
                  localStorage.setItem("mySaleDate",JSON.stringify({ startDate, endDate }));
                  navigate(`/GoodsView/${list.gno}`,{
                    state: {from: location.pathname}
                  })
                }}
              >이동</button>              
            </td>
            <td>
              <button className="co-button-status co-ongoing-all"
                      onClick={()=>{
                        localStorage.setItem("mySaleDate",JSON.stringify({ startDate, endDate }));
                        navigate(`/GoodsUpdate/${list.gno}`,{
                            state: {
                              from: location.pathname
                        }});
                      }}        
              >수정</button>
              <button className="co-button-status co-upcoming-all"
                      onClick={()=>{
                        handleDelete(list.gno);
                      }}
              >삭제</button>
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

    </>

  );
}

export default MySale;