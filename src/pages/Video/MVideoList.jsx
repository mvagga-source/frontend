import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

// Api
import { getVideoPageApi } from "./MVideoApi";

// function
import { getYoutubeThumbnail, statusText, sorts, searchTypes } from './MVivdeoFunction';

function MVideoList({ dataParams }) {

    const {
        videos,
        setVideos,
        toggleVideBookmark,
        videoViewCount,
        toggleVideoLike,
        isBookmarked,
        isLiked
    } = dataParams;      

    const [sortType, setSortType] = useState("LATEST");
    const [searchType, setSearchType] = useState("ALL")
    const [search, setSearch] = useState("")
    const [hasNext, setHasNext] = useState(true);
    const [page, setPage] = useState(0);
    const pageSize = 10;

    // API params
    const [params, setParams] = useState({
        page : 0,
        size : pageSize,
        sortType : "LATEST", 
        search : "",
        searchType : "",
        deletedFlag : "N"
    });        

    const getVideos = async (searchParams) => {

        try {

            console.log("searchParams : ",searchParams);

            // 비디오 리스트
            const res = await getVideoPageApi(searchParams);
            const data = await res.data.list;

            // 더이상 불러올 자료 없음
            if (!Array.isArray(data)) {
                setHasNext(false)
                return;
            }
            if (data.length < pageSize) setHasNext(false);
            
            // [기존 데이터] + [새 데이터]
            if (data) {
                setVideos(prev => page === 0 ? data : [...prev, ...data]);
            }

        }catch (e) {
            console.error("비디오 리스트 정보 호출 오류",e);
        }
    };

    useEffect(()=>{
        if(hasNext) getVideos(params);
    },[params]);

    const handleSearch = (e) => {
        setHasNext(true);
        setPage(0);
        setParams(prev => ({
            ...prev,
            page : 0,
            search : search,
            searchType : searchType,
        }))
    };

    return(

        <div className="mv-main-list">
            
            <ul className="mv-form">
                <li>
                    <select onChange={(e) => {
                        const value = e.target.value;
                        setHasNext(true);
                        setSortType(value);
                        setPage(0);
                        setParams(prev => ({
                            ...prev,
                            sortType : value,
                            page : 0,
                            search : search,
                        }))
                    }} >

                    {sorts.map((item) => (
                        <option key={item.value} value={item.value}>
                        {item.label}
                        </option>
                    ))}
                    </select>

                    <select onChange={(e) => setSearchType(e.target.value)}>
                    {searchTypes.map((item) => (
                        <option key={item.value} value={item.value}>
                        {item.label}
                        </option>
                    ))}
                    </select>

                    <input type="text" onChange={(e) => setSearch(e.target.value)}/>

                    <button onClick={handleSearch}>검색</button>
                </li>
            </ul>

            <div className="mv-row-box">
                <div className="mv-row">
                    {videos.map(video => (

                        <div className="mv-column" key={video.id}>
                            <div className="mv-card">
                                <div className={`mv-info-box ${video.status === "1" ? "mv-passed-bb" : "mv-ended-bb" }`}>
                                    <img
                                        src={getYoutubeThumbnail(video.url)}
                                        onClick={() => {
                                            videoViewCount(video.id)
                                            window.open(video.url, "_blank")
                                        }}
                                        style={{
                                        filter: video.status === "1" ? "none" : "grayscale(100%)"
                                        }}
                                    />
                                    <div className="mv-row-hitlike">
                                        <span><FontAwesomeIcon icon={faEye} /> {video.viewCount}</span>
                                        <span onClick={()=> toggleVideoLike(video.id)} style={{cursor:'pointer'}}>
                                            <FontAwesomeIcon icon={faHeart} color={isLiked(video.id) ? "red" : "gray"}/>
                                            {video.likeCount}
                                        </span>
                                        {/* <FontAwesomeIcon icon={faCrown} /> */}
                                    </div>
                                    <div className="mv-row-info-name">{video.name}</div>
                                    <div className="mv-row-info-title ellipsis-multi">{video.title}</div>
                                    <ul>
                                        <li>
                                            {video.status === "1" ? 
                                                <span className="mv-row-status mv-ongoing-fc">●</span>
                                                :
                                                <span className="mv-row-status mv-upcoming-fc">●</span>
                                            }
                                        </li>
                                        <li></li>
                                        <li className={`mv-row-status ${isBookmarked(video.id) ? "mv-ongoing-all" : "mv-ended-all"} `}
                                            onClick={()=>{toggleVideBookmark(video.id)}} style={{cursor:'pointer'}}
                                        >
                                            북마크
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            
            {hasNext === true && 
                <div className="mv-hasnext">
                    <span onClick={(()=>{
                        setPage(prev => {
                            const nextPage = prev + 1;
                            setParams(prev => ({
                                ...prev,
                                sortType : sortType,
                                page : nextPage,
                            }))                            
                            return nextPage;
                        });
                    })}
                    
                    className="mv-hasnext-status mv-ended-all">더보기...</span>
                </div>
            }

            {/* {pageId &&
                <div className="mv-hasnext">
                    <Link to="/MyMain">
                        <span className="mv-hasnext-status mv-ended-all">이전 화면으로</span>
                    </Link>
                </div>                
            } */}
        </div>
    );
}

export default MVideoList;