
import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import styles from "./BoardList.module.css";
import formStyles from "./BoardView.module.css";
import { SearchBtn, MoveBtn } from "../../components/button/Button";
import { Pagination } from "../../components/Pagination/Pagination";
import { getBoardListApi } from "./BoardApi";
import { SearchInput } from "../../components/input/Input";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import Content from "../../components/Title/ContentComp";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

function BoardList() {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const size = 10;     //서버쪽 페이지 불러올 size
    const formRef = useRef();
    const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
    const [sortDirection, setSortDirection] = useState("DESC");   //정렬 임시로 고정

    // 검색 조건을 저장할 상태 추가(검색버튼 누른 입력값만 페이징 등 사용)
    const params = useRef();

    // 검색 옵션 데이터
    const searchOptions = [
        { value: "", label: "전체" },
        { value: "btitle", label: "제목" },
        { value: "bcontent", label: "내용" },
        //{ value: "test", label: "test21314" }
    ];

    const getList = async (page, searchParams) => {
        getBoardListApi(page, size, searchParams)
        .then((res) => {
            if (res.data && res.data.success) {
                const { list, maxPage, startPage, endPage, totalCount } = res.data;
                setList(list || []);
                setTotalPages(maxPage || 1);
                setStartPage(startPage || 1);
                setEndPage(endPage || 1);
                setTotalCount(totalCount || 0);
            }
        });
    };

    const searchData = async (e) => {
        const formData = new FormData(formRef.current);
        const newParams = Object.fromEntries(formData.entries());
        params.current = newParams; // 검색 조건 저장
        setCurrentPage(1);      //검색시 1페이지부터
        getList(currentPage, params.current);
    };

    useEffect(() => {
        getList(currentPage, params.current);
    }, [currentPage]);

    return (
        // <Content TitleName="Community Board">
            // <div className={formStyles.viewContainer}>
                <div className={styles.neonBoardContainer}>
                    {/* 검색 영역 */}
                    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.searchSection}>
                            <SearchSelect name="category" options={searchOptions} />
                            <SearchInput name="search" style={{minWidth:'400px'}} placeholder="검색어를 입력하세요." />
                            <SearchBtn onClick={searchData}>검색</SearchBtn>
                        </div>
                    </form>
                    {user && user.id && (
                        <div className={styles.headerSection}>
                            <NavLink to="/BoardWrite" style={{ textDecoration: 'none' }}>
                                <MoveBtn>글쓰기</MoveBtn>
                            </NavLink>
                        </div>
                    )}

                    {/* 테이블 영역 */}
                    <div className={styles.tableWrapper}>
                        <table className={styles.neonTable}>
                            <thead>
                                <tr>
                                    <th style={{ width: '8%' }}>번호</th>
                                    <th style={{ width: '35%' }}>제목</th>
                                    <th>작성자</th>
                                    <th>날짜</th>
                                    <th>조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length > 0 ? (
                                    list.map((board, index) => {
                                        // 내림차순 순번 계산: 전체개수 - (현재페이지-1)*페이지당개수 - 현재인덱스
                                        const rowNum = sortDirection === "DESC" 
                                        ? totalCount - (currentPage - 1) * size - index // 내림차순
                                        : (currentPage - 1) * size + index + 1;           // 오름차순
                                        return (<tr key={board.bno}>
                                            <td>{rowNum}</td>
                                            <td className={styles.textStart}>
                                                <NavLink to={`/BoardView/${board.bno}`} className={styles.neonLink}>
                                                    {board.btitle}
                                                </NavLink>
                                            </td>
                                            <td>{board.member.id || ''}</td>
                                            <td>{dayjs(board.bdate).format("YYYY-MM-DD")}</td>
                                            <td>{board.bhit}</td>
                                        </tr>)
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={styles.noData}>등록된 게시글이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages}
                        startPage={startPage}
                        endPage={endPage}
                        onPageChange={setCurrentPage} 
                    />
                </div>
            // </div>
        // </Content>
    );
}

export default BoardList;