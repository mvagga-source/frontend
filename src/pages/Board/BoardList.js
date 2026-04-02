import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styles from "./BoardList.module.css";
import { Pagination } from "../../components/Pagination/Pagination";
import { getBoardListApi } from "./BoardApi";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";

function BoardList() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [sortDirection, setSortDirection] = useState("DESC");

    const [size, setSize] = useState(10);
    const formRef = useRef();
    const params = useRef();

    const searchOptions = [
        { value: "", label: "전체" },
        { value: "btitle", label: "제목" },
        { value: "bcontent", label: "내용" },
        { value: "nickname", label: "작성자" },
    ];

    const sortOptions = [
        { value: "DESC", label: "최신순" },
        { value: "ASC", label: "오래된순" },
        { value: "bhit", label: "조회순" },
    ];

    const sizeOptions = [
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
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

    //페이지 불러오는 양 조절
    const handleSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setSize(newSize);
        setCurrentPage(1); // 사이즈 변경 시 1페이지로 리셋
    };

    // URL 파라미터 파싱을 위한 로직
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get("category");
        const search = queryParams.get("search");

        if (category && search) {
            // URL에 검색 조건이 있으면 해당 조건으로 ref 업데이트
            params.current = { category, search };
            getList(1, params.current);
            console.log(new URLSearchParams(location.search).get("category") || "");
        } else {
            // 일반 접속 시 기존 로직
            getList(currentPage, params.current);
        }
    }, [location.search]); // URL 변경 감지

    useEffect(() => {
        getList(currentPage, params.current);
    }, [currentPage, sortDirection, size]);

    return (
        <div className={styles.neonBoardContainer}>
            {loading && <LoadingScreen />}

            {/* 1. 타이틀 섹션 */}
            <div className={styles.titleSection}>
                <h2>자유게시판</h2>
            </div>

            {/* 2. 가이드 섹션 (이전 스타일 유지) */}
            <div className={styles.topGuideSection}>
                <div className={styles.guideTitle}>
                    <h3>게시판 가이드</h3>
                    <p>자유롭게 의견을 나누는 공간입니다.</p>
                </div>
                <ul className={styles.guideList}>
                    <li>✔ 비방 및 욕설 금지</li>
                    <li>✔ 도배/스팸 게시글 삭제</li>
                    <li>✔ 타인 저작권 보호</li>
                </ul>
            </div>

            {/* 3. 검색 섹션 (안정적인 레이아웃) */}
            <form ref={formRef} onSubmit={(e) => e.preventDefault()} key={location.search}>
            <div className={styles.searchSection}>
                <div className={styles.searchForm}>
                    <div className={styles.searchGroup}>
                        <SearchSelect 
                            name="category"
                            options={searchOptions} 
                            defaultValue={new URLSearchParams(location.search).get("category") || ""}
                        />
                        <div className={styles.searchInputWrapper}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#00f2ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input 
                                name="search"
                                type="text"
                                placeholder="검색어를 입력하세요"
                                className={styles.mainInput}
                                defaultValue={new URLSearchParams(location.search).get("search") || ""}
                            />
                        </div>
                        <button type="button" className={styles.searchBtn} onClick={searchData}>검색</button>
                    </div>
                </div>
            </div>

            {/* 4. 리스트 정보 (총 건수 & 정렬) */}
            <div className={styles.listInfo}>
                <span className={styles.countText}>
                    총 <span className={styles.highlight}>{totalCount}</span>건
                </span>
                <div>
                <span style={{ marginRight: '10px' }}>
                <SearchSelect 
                    name="sortDir" 
                    options={sortOptions} 
                    value={sortDirection}
                    onChange={handleSortChange}
                />
                </span>
                <SearchSelect 
                    name="size" 
                    options={sizeOptions}
                    value={size}
                    onChange={handleSizeChange}
                />
                </div>
            </div>
            </form>

            {/* 5. 테이블 영역 */}
            <div className={styles.tableWrapper}>
                <table className={styles.neonTable}>
                    <thead>
                        <tr>
                            <th style={{ width: '8%' }}>번호</th>
                            <th style={{ width: '45%' }}>제목</th>
                            <th>작성자</th>
                            <th>날짜</th>
                            <th>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length > 0 ? (
                            list.map((board, index) => (
                                <tr key={board.bno}>
                                    <td>{sortDirection === "ASC" 
                                        ? (currentPage - 1) * size + index + 1  // 오래된 순: 1, 2, 3... 순차적 증가
                                        : totalCount - (currentPage - 1) * size - index // 최신순: 100, 99, 98... 순차적 감소
                                    }</td>
                                    <td className={styles.textStart}>
                                        <NavLink to={`/Community/BoardView/${board.bno}`} className={styles.neonLink}>
                                            {board.btitle}
                                        </NavLink>
                                    </td>
                                    <td>{board.member.nickname}</td>
                                    <td>{dayjs(board.bdate).format("YYYY-MM-DD")}</td>
                                    <td>{board.bhit}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className={styles.noData}>등록된 게시글이 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 6. 하단 영역 (페이지네이션 + 글쓰기 버튼) */}
            <div className={styles.bottomSection}>
                <div className={styles.paginationFlexBox}>
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages}
                        startPage={startPage}
                        endPage={endPage}
                        onPageChange={setCurrentPage} 
                    />
                </div>
                {user?.id && (
                    <button type="button" className={styles.writeBtn} onClick={() => navigate("/Community/BoardWrite")}>
                        새 글 작성
                    </button>
                )}
            </div>
        </div>
    );
}

export default BoardList;