import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { SearchBar, NumberInput } from "../../components/input/Input";
import { SearchBtn } from "../../components/button/Button";
import { SearchSelectBar } from "../../components/SelectBox/SelectBox";
import Content from "../../components/Title/ContentComp";
import styles from "./GoodsList.module.css";
import PriceFilter from "./popup/PriceFilter";
import { getGoodsListApi, getGoodsBannerListApi } from "./GoodsApi";
import GoodsPagination from "../../components/Pagination/Pagination";
import GoodsBanner from "./GoodsComponent/GoodsList/GoodsBannerList";

function GoodsList() {
    const navigate = useNavigate();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 상태
    const size = 8;      //서버쪽 페이지 불러올 size
    const formRef = useRef();
    // 검색 조건을 저장할 상태 추가(검색버튼 누른 입력값만 페이징 등 사용)
    const params = useRef();
    
    const searchOptions = [
        { value: "", label: "전체" },
        { value: "gname", label: "상품명" },
        { value: "idol", label: "참가자명" },
        { value: "member", label: "판매자" },
    ];

    // 데이터를 가져오는 핵심 함수
    const getList = async (page, searchParams) => {
        getGoodsListApi(page, size, {
            ...searchParams,
            minPrice: minPrice || 0,
            maxPrice: maxPrice || 0,
            sortDir: sortDirection // 현재 정렬 상태 포함
        }).then((res) => {
            if (res.data && res.data.success) {
                const { list, maxPage, startPage, endPage, totalCount } = res.data; // AjaxResponse 구조 확인
                setList(list || []);
                setTotalPages(maxPage || 1);
                setStartPage(startPage || 1);
                setEndPage(endPage || 1);
                setTotalCount(totalCount || 0);
            }
        });
    };

    // 정렬 변경 시 1페이지로 이동하며 호출
    const handleSortChange = (dir) => {
        setSortDirection(dir);
        setCurrentPage(1);
    };

    // 페이지 변경이나 정렬 변경 시 데이터 호출
    useEffect(() => {
        getList(currentPage, params.current);
    }, [currentPage, sortDirection]);

    // 검색 버튼 클릭 시
    const searchData = async (e) => {
        const formData = new FormData(formRef.current);
        const newParams = Object.fromEntries(formData.entries());
        params.current = newParams; // 검색 조건 저장
        setCurrentPage(1);      //검색시 1페이지부터
        getList(currentPage, params.current);
    };

    return (
        // <Content TitleName="K-POP GOODS SHOP">
        <>
        {/* <h2 className={styles.pageTitle}>ACTION101 GOODS SHOP</h2> */}
            <div className={styles.wrapper}>
                <div className={styles.contentContainer}>
                    
                    {/* 1. 상단 메인 배너 - 텍스트 가독성 확보 */}
                    <GoodsBanner />

                    {/* 2. 쇼핑몰형 상세 검색 필터 (디자인 수정) */}
                    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.filterSection}>
                        <div className={styles.filterBar}>
                            <div className={styles.searchFilterGroup}>
                                {/* z-index 이슈 해결을 위해 컴포넌트를 감싸는 div 추가 가능 */}
                                <SearchSelectBar options={searchOptions} name="category"/>
                                <div className={styles.innerDivider}></div>
                                <input 
                                    name="search"
                                    type="text" 
                                    placeholder="상품명 또는 오디션참가자를 검색하세요" 
                                    className={styles.mainSearchInput}
                                />
                                {/* 가격 팝업 */}
                                <PriceFilter
                                    minPrice={minPrice}
                                    setMinPrice={setMinPrice}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                />
                                <button className={styles.inlineSearchBtn} onClick={searchData}>검색</button>
                            </div>
                        </div>
                    </div>
                    </form>

                    {/* 3. 리스트 상단 컨트롤러 */}
                    <div className={styles.listHeader}>
                        <p className={styles.totalCount}>총 <span>{totalCount}</span>개의 상품이 있습니다</p>
                        
                        <div className={styles.headerControls}>
                            {/* 정렬 옵션 */}
                            {/* 정렬 버튼 클릭 이벤트 연결 */}
                            <div className={styles.sortOptions}>
                                <button 
                                    className={sortDirection === "DESC" ? styles.activeSort : ""} 
                                    onClick={() => handleSortChange("DESC")}
                                >최신순</button>
                                {/* <div className={styles.vDivider}></div> */}
                                <button 
                                    className={sortDirection === "priceAsc" ? styles.activeSort : ""} 
                                    onClick={() => handleSortChange("priceAsc")}
                                >낮은가격순</button>
                                {/* <div className={styles.vDivider}></div> */}
                                <button 
                                    className={sortDirection === "priceDesc" ? styles.activeSort : ""} 
                                    onClick={() => handleSortChange("priceDesc")}
                                >높은가격순</button>
                            </div>
                        </div>
                    </div>

                    {/* 4. 상품 리스트 그리드 */}
                    <div className={styles.productGrid}>
                        {list && list.length > 0 ? (
                            list.map((item) => (
                                <div key={item.gno} className={styles.productCard} onClick={() => navigate(`/GoodsView/${item.gno}`)}>
                                    <div className={styles.thumbnailBox}>
                                        <img src={`${process.env.REACT_APP_IMG_URL}${item.gimg}`} alt={item.gname} />
                                        <div className={styles.cardOverlay}>VIEW DETAIL</div>
                                    </div>
                                    <div className={styles.productDesc}>
                                        {/* 만약 member.id를 보여주고 싶다면 item.member?.id 등을 사용 */}
                                        <span className={styles.groupTag}>{item.group || item.member?.nickname}</span>
                                        <h3 className={styles.productTitle}>{item.gname}</h3>
                                        <p className={styles.productPrice}>
                                            {item.price?.toLocaleString()}<span>원</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* 데이터가 없을 때 보여줄 스타일 영역 */
                            <div className={styles.noDataWrapper}>
                                <div className={styles.noDataIcon}>🔍</div>
                                <p>조회된 상품이 없습니다.</p>
                                <button onClick={() => window.location.reload()} className={styles.resetBtn}>
                                    전체보기로 돌아가기
                                </button>
                            </div>
                        )}
                    </div>
                    <GoodsPagination 
                        currentPage={currentPage} 
                        totalPages={totalPages}
                        startPage={startPage}
                        endPage={endPage}
                        onPageChange={setCurrentPage} 
                    />
                </div>
            </div>
        </>
        // </Content>
    );
}

export default GoodsList;
