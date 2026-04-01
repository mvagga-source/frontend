import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./BoardListN.module.css";
import { Pagination } from "../../../components/Pagination/Pagination";
import { getBoardListApi } from "../BoardApi";
import { SearchSelect } from "../../../components/SelectBox/SelectBox";
import { useAuth } from "../../../context/AuthContext";
import dayjs from "dayjs";
import LoadingScreen from "../../../components/LoadingBar/LoadingBar";

function BoardListN() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortDirection, setSortDirection] = useState("DESC");

    const size = 10;
    const formRef = useRef();
    // 검색 조건을 저장할 상태 추가(검색버튼 누른 입력값만 페이징 등 사용)
    const params = useRef();

    const SortOptions = [
        { value: "DESC", label: "최신순" },
        { value: "bhit", label: "조회순" },
    ];

    // 검색 옵션 데이터
    const searchOptions = [
        { value: "", label: "전체" },
        { value: "btitle", label: "제목" },
        { value: "bcontent", label: "내용" },
        //{ value: "test", label: "test21314" }
    ];

    const getList = async (page, searchParams) => {
        setLoading(true);
        searchParams = { ...searchParams, sortDir: sortDirection };
        getBoardListApi(page, size, searchParams)
            .then((res) => {
                if (res.data?.success) {
                    const { list, maxPage, startPage, endPage, totalCount } = res.data;
                    setList(list || []);
                    setTotalPages(maxPage || 1);
                    setStartPage(startPage || 1);
                    setEndPage(endPage || 1);
                    setTotalCount(totalCount || 0);
                }
            })
            .finally(() => setLoading(false));
    };

    const searchData = () => {
        const formData = new FormData(formRef.current);
        params.current = Object.fromEntries(formData.entries());
        setCurrentPage(1);
        getList(1, params.current);
    };

    // 2. 정렬 변경 핸들러: 정렬이 바뀌면 페이지를 1로 되돌림
    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortDirection(newSort);
        setCurrentPage(1); // 정렬 변경 시 1페이지로 이동
    };

    useEffect(() => {
        getList(currentPage, params.current);
    }, [currentPage, sortDirection]);

    return (
        <div className={styles.container}>
            {loading && <LoadingScreen />}

            {/* 좌측 메인 리스트 */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2>자유 게시판</h2>
                        <span className={styles.countText}>
                            총 <span className={styles.highlight}>{totalCount}</span>건
                        </span>
                    </div>
                    <SearchSelect name="sortDirection" options={SortOptions} value={sortDirection} style={{ fontSize: '12px', height: "37px", padding: "8px 40px 10px 15px" }} onChange={(e) => setSortDirection(e.target.value)}/>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th style={{ width: "70px" }}>날짜</th>
                                <th>조회</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ? (
                                list.map((item, idx) => (
                                    <tr key={item.bno}>
                                        <td className={styles.textCenter}>{totalCount - (currentPage - 1) * size - idx}</td>
                                        <td className={styles.titleCell}>
                                            <NavLink to={`/Community/BoardView/${item.bno}`}>{item.btitle}</NavLink>
                                        </td>
                                        <td className={styles.textCenter}>{item.member.nickname}</td>
                                        <td className={styles.textCenter}>{dayjs(item.bdate).format("YYYY.MM.DD")}</td>
                                        <td className={styles.textCenter}>{item.bhit}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className={styles.noData}>게시글이 존재하지 않습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* 페이징 */}
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    startPage={startPage}
                    endPage={endPage}
                    onPageChange={setCurrentPage} 
                />
            </div>

            {/* 우측 사이드 섹션 */}
            <div className={styles.sideContent}>
                {user?.id && (
                    <button className={styles.writeButton} onClick={() => navigate("/Community/BoardWrite")}>
                        새 글 작성
                    </button>
                )}

                <div className={styles.guideBox}>
                    <h3>게시판 가이드</h3>
                    <p>자유롭게 의견을 나누는 공간입니다.</p>
                    <ul>
                        <li>✔ 비방 및 욕설 금지</li>
                        <li>✔ 도배/스팸 게시글 삭제</li>
                        <li>✔ 타인 저작권 보호</li>
                    </ul>
                </div>

                <div className={styles.searchCard}>
                    <form ref={formRef} onSubmit={(e) => { e.preventDefault(); }}>
                        {/* 우측 사이드 검색 셀렉트 */}
                        <div className={styles.sideSelectWrapper}>
                            <SearchSelect 
                                name="category" 
                                options={searchOptions} 
                                className={styles.fullWidthSelect} // 클래스 추가
                            />
                        </div>
                        
                        <div className={styles.searchInputWrapper}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#00f2ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input name="search" type="text" placeholder="검색어 입력" className={styles.sideInput} />
                        </div>
                        
                        <button type="button" className={styles.searchBtn} onClick={searchData}>검색</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BoardListN;