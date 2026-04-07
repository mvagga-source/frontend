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
        idolStatus,
        videos,
        setVideos,
        toggleVideBookmark,
        videoViewCount,
        toggleVideoLike,
        isBookmarked,
        isLiked,
        isPassed,
        goToProfile
    } = dataParams;      

    const [sortType, setSortType] = useState("LATEST");
    const [searchType, setSearchType] = useState("ALL")
    const [search, setSearch] = useState("")
    const [hasNext, setHasNext] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const isEmpty = videos.length === 0;

    // API params
    const [params, setParams] = useState({
        page : page,
        size : pageSize,
        sortType : "LATEST", 
        search : "",
        searchType : "",
        deletedFlag : "N"
    });        

    const getVideos = async (searchParams) => {

        try {

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
                setVideos(prev => page === 1 ? data : [...prev, ...data]);
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
        setPage(1);
        setParams(prev => ({
            ...prev,
            page : 1,
            search : search,
            searchType : searchType,
        }))
    };

    return(

        <div className="mv-list">
            
            <ul className="mv-list__filter">
                <li>
                    <select onChange={(e) => {
                        const value = e.target.value;
                        setHasNext(true);
                        setSortType(value);
                        setPage(1);
                        setParams(prev => ({
                            ...prev,
                            sortType : value,
                            page : 1,
                            search : "",
                            searchType : "",
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

            <div className="mv-list__grid">

                {isEmpty ? (
                    <div className='mv-nodata-card'>
                        조회된 데이터가 없습니다.
                    </div>
                ) :
                    videos.map(video => {

                        const passed = isPassed(video.idol_profile?.profileId || "");

                        return(

                            <div className={`mv-list-card ${passed? "mv-passed-bb" : "mv-ended-bb"}`} key={video.id}>

                                {/* 썸네일 */}
                                <div className='mv-list-card__thumb'>
                                    <img
                                        src={getYoutubeThumbnail(video.url)}
                                        onClick={() => {
                                            videoViewCount(video.id)
                                            window.open(video.url, "_blank")
                                        }}
                                        style={{
                                        filter: passed ? "none" : "grayscale(100%)"
                                        }}
                                    />
                                    <svg className="mv-card__bookmark" width="22" height="22" viewBox="0 0 24 24"
                                        onClick={()=>{toggleVideBookmark(video.id)}} 
                                        fill={`${isBookmarked(video.id) ? "currentColor" : "none"}`} stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-4-7 4V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v16z"/>
                                    </svg>
                                </div>
                                {/* 메타 정보 */}
                                <div className="mv-list-card__meta">
                                    <span>
                                        <FontAwesomeIcon icon={faEye} /> {video.viewCount}
                                    </span>
                                    <span style={{cursor:'pointer'}}>
                                        <FontAwesomeIcon icon={faHeart} color={isLiked(video.id) ? "red" : "gray"} onClick={()=> toggleVideoLike(video.id)}/> {video.likeCount}
                                    </span>
                                </div>
                                {/* 이름 */}
                                <div className="mv-list-card-name">{video.idol_profile?.name || "" }</div>
                                {/* 제목 */}
                                <div className="mv-list-card-title ellipsis-multi">{video.title}</div>
                                {/* 프로필 */}
                                <div className="mv-list-card__profile mv-ongoing-all"
                                    onClick={() => goToProfile(video.idol_profile?.profileId || "")}
                                >
                                    <span className={`${passed ? "mv-ongoing-fc":"mv-ended-fc"}`}>●</span>
                                    <span>프로필</span>
                                </div>
                            </div>

                        );
                    })}
            </div>
            
            {hasNext === true && 
                <div className="mv-list-hasnext">
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
                    
                    className="mv-list-hasnext__status mv-ended-all">더보기...</span>
                </div>
            }
        </div>
    );
}

export default MVideoList;