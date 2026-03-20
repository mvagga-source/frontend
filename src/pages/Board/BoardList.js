
import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import styles from "./BoardList.module.css";
import formStyles from "./BoardView.module.css";
import { SearchBtn } from "../../components/button/Button";
import { Pagination } from "../../components/Pagination/Pagination";
import { getBoardListApi } from "./BoardApi";
import { SearchInput } from "../../components/input/Input";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
import Content from "../../components/Title/ContentComp";

function BoardList() {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const postsPerPage = 10;
    const formRef = useRef();

    // 검색 옵션 데이터
    const searchOptions = [
        { value: "", label: "전체" },
        { value: "btitle", label: "제목" },
        { value: "bcontent", label: "내용" },
        //{ value: "test", label: "test21314" }
    ];

    const getList = async (page) => {
        const formData = new FormData(formRef.current);
        const searchParams = Object.fromEntries(formData.entries());
        getBoardListApi(page, postsPerPage, searchParams)
        .then((res) => {
            if (res.data && res.data.success) {
                const { list, maxPage, startPage, endPage } = res.data;
                setList(list || []);
                setTotalPages(maxPage || 1);
                setStartPage(startPage || 1);
                setEndPage(endPage || 1);
            }
        });
    };

    const searchData = async (e) => {
        setCurrentPage(1);      //검색시 1페이지부터
        getList(currentPage);
    };

    useEffect(() => {
        getList(currentPage);
    }, [currentPage]);

    return (
        <Content TitleName="Community Board">
            <div className={formStyles.viewContainer}>
                <div className={styles.neonBoardContainer}>
                    {/* 검색 영역 */}
                    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.searchSection}>
                            <SearchSelect name="category" options={searchOptions} />
                            <SearchInput name="search" style={{minWidth:'400px'}} placeholder="검색어를 입력하세요." />
                            <SearchBtn onClick={searchData}>검색</SearchBtn>
                        </div>
                    </form>

                    <div className={styles.headerSection}>
                        <NavLink to="/BoardWrite" style={{ textDecoration: 'none' }}>
                            <SearchBtn>글쓰기</SearchBtn>
                        </NavLink>
                    </div>

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
                                    list.map((post) => (
                                        <tr key={post.bno}>
                                            <td>{post.bno}</td>
                                            <td className={styles.textStart}>
                                                <NavLink to={`/BoardView/${post.bno}`} className={styles.neonLink}>
                                                    {post.btitle}
                                                </NavLink>
                                            </td>
                                            <td>{post.member.id || ''}</td>
                                            <td>{post.bdate}</td>
                                            <td>{post.bhit}</td>
                                        </tr>
                                    ))
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
            </div>
        </Content>
    );
}

export default BoardList;