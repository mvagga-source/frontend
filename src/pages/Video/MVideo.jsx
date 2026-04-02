import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

// Api
import { toggleBookmarkApi } from "../Common/BookmarkApi";
import { getMyPageBookmarskApi } from '../MyPage/MyMainApi';
import { getMyLikesApi, getVideoApi, getVideosApi, toggleVideoLikeApi, videoViewCountApi } from "./MVideoApi";

import bg from "../../assets/images/singer_bg.png";
import { useAuth } from "../../context/AuthContext";
import "./MVideo.css";


function MVideo() {

    // const members = [
    //     { id: 1, name: "25번 연습생", title:"Love You Like A Love Song - Selena...", status:"1", hit:"1", url:"https://www.youtube.com/watch?v=32si5cfrCNc" },
    //     { id: 2, name: "5번 연습생", title:"Love You Like A Love Song - Selena...", status:"1", hit:"10", url:"https://www.youtube.com/watch?v=CjZqVsgy95g" },
    //     { id: 3, name: "101번 연습생", title:"Love You Like A Love Song - Selena...", status:"0", hit:"21", url:"https://www.youtube.com/watch?v=BVwAVbKYYeM" },
    //     { id: 4, name: "85번 연습생", title:"에스파 'Pink Hoodie' (Official Audio)", status:"1", hit:"31", url:"https://www.youtube.com/watch?v=ekr2nIex040" },
    //     { id: 5, name: "26번 연습생",title:"Love You Like A Love Song - Selena...", status:"0", hit:"12", url:"https://www.youtube.com/watch?v=jWQx2f-CErU" },
    //     { id: 6, name: "1번 연습생",title:"Love You Like A Love Song - Selena...", status:"1", hit:"15", url:"https://www.youtube.com/watch?v=q6_CfyZgF-s" },
    //     { id: 7, name: "78번 연습생",title:"Love You Like A Love Song - Selena...", status:"0", hit:"15", url:"https://www.youtube.com/watch?v=ekr2nIex040" },
    //     { id: 8, name: "88번 연습생",title:"Love You Like A Love Song - Selena...", status:"0", hit:"15", url:"https://www.youtube.com/watch?v=mrV8kK5t0V8" },
    //     { id: 9, name: "91번 연습생",title:"Love You Like A Love Song - Selena...", status:"1", hit:"15", url:"https://www.youtube.com/watch?v=U-itOp4PgBs" },
    //     { id: 10, name: "56번 연습생",title:"Love You Like A Love Song - Selena...", status:"1", hit:"15", url:"https://www.youtube.com/watch?v=jWQx2f-CErU" },
    //     { id: 11, name: "35번 연습생",title:"Love You Like A Love Song - Selena...", status:"0", hit:"15", url:"https://www.youtube.com/watch?v=jWQx2f-CErU" }
    // ];

    const navigate = useNavigate();
    const location = useLocation();

    // const initialState = [];
    const {user} = useAuth();
    const pageType = "VIDEO"; // 페이지구분    

    function convertYoutube(url){
        const id = url.split("v=")[1];
        return `https://www.youtube.com/embed/${id}`;
    }

    function getYoutubeThumbnail(url){
        const id = url.split("v=")[1];
        return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }

    const statusText = {
        "1": "오디션 통과",
        "0": "오디션 탈락"
    };

    const sorts = [
        { value: "LATEST", label: "최신순" },
        { value: "LIKE", label: "좋아요순" },
        { value: "VIEW", label: "조회순" },
        { value: "POPULAR", label: "인기순" }
    ];    

    const searchTypes = [
        { value: "ALL", label: "전체" },
        { value: "NAME", label: "이름" },
        { value: "TITLE", label: "제목" },
    ];        

    const sliderRef = useRef(null);

    const [bookmarks, setBookmarks] = useState([]);
    const [videos, setVideos] = useState([]);
    const [popVideos, setPopVideos] = useState([]);
    const [videosLike, setVideosLike] = useState([]);
    const [sortType, setSortType] = useState("LATEST");
    const [search, setSearch] = useState("")
    const [searchType, setSearchType] = useState("ALL")

    // pageable
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const pageSize = 10;

    const isBookmarked = (pageId) => {
        return bookmarks.includes(pageId);
    };

    const isLiked = (videoId) => {
        return videosLike.includes(videoId);
    }        

    // 외부 파라메터
    const { pageId } = useParams();    

    const getVideos = async (sortType, currentPage) => {

        if (currentPage === 0 || pageId){
            setVideos([]);
        }

        try {

            if (pageId) {
                const videoRes = await getVideoApi(pageId);
                setVideos([videoRes.data]);

                setHasNext(false); // 더이상 자료 없음
            } else {

                // 비디오 리스트
                const videoRes = await getVideosApi(currentPage, pageSize, sortType, search, searchType,"N");
                const vData = await videoRes.data.content;
                
                if (vData) {
                    setVideos(prev => [...prev, ...vData]);
                }

                if (!vData || vData.length < pageSize) {
                    setHasNext(false); // 더이상 자료 없음
                }                
            }
            
        }catch (err) {
            console.error(err);
        }
    };

    useEffect (()=>{
        console.log("1. useEffect sortType ");
        setHasNext(true);        
        setVideos([]);
        setPage(0);

        getVideos(sortType, 0);
    },[sortType]);

    useEffect (()=>{
        if (page === 0) return;

        getVideos(sortType, page);
    },[page]);


    // 비디오 리스트(인기순)
    useEffect(() => {
        const getPopular = async () => {

            const PopvideoRes = await getVideosApi(0, 10,"POPULAR");
            const vpData = await PopvideoRes.data.content

            setPopVideos(prev => [...prev, ...vpData.slice(0, 10)]);
        };

        getPopular();
    }, []);

    // 나의 북마크 리스트
    const getMyBookmark = async () => {
        const bookmarkRes = await getMyPageBookmarskApi(user.id, pageType);
        const pageId = bookmarkRes.data.data.map(b => b.pageId);
        setBookmarks(pageId);
    };    
    useEffect(() => {
        if (!user?.id) return;        
        getMyBookmark();
    }, [user?.id]);

    // 나의 좋아요 리스트
    const getMyLikes = async () => {
        const likesRes = await getMyLikesApi(user.id);
        const videoId = likesRes.data.map(l => l.video.id);
        setVideosLike(videoId);
    };
    
    useEffect(() => {
        if (!user?.id) return;
        getMyLikes();    
    }, [user?.id]);    

    // 북마크 토글
    const toggleVideBookmark = async(pageId) => {

        if (!user?.id){
            if (window.confirm("로그인후 사용가능 합니다. 로그인 하시겠습니까?")){
                navigate("/UserLogin",{
                    state: {
                        from: location.pathname,
                    }                    
                });
            }
            return;
        }            

        try {
        const res = await toggleBookmarkApi(user.id, pageId, pageType);
        if (res.data) {
            // 추가됨
            setBookmarks(prev => [...prev, pageId]);
            alert("북마크에 등록되었습니다.\n\n'마이페이지'에서 확인 가능합니다.")
        } else {
            // 삭제됨
            setBookmarks(prev => prev.filter(id => id !== pageId));
                alert("북마크 등록이 취소 되었습니다.");
        }
        }catch (err) {
        console.error(err);
        }        
    }

    // 좋아요 처리
    const toggleVideoLike = async(videoId) => {

          try {
            const res = await toggleVideoLikeApi(user.id, videoId);

            if (res.data.liked) {
                setVideosLike(prev => [...prev, videoId]);
            } else {
                setVideosLike(prev => prev.filter(id => id !== videoId));
            }            

            // 상단
            setPopVideos(prev =>
                prev.map(v =>
                v.id === videoId
                    ? { ...v, likeCount: res.data.likeCount }
                    : v
                )
            );                 

            //하단 
            setVideos(prev =>
                prev.map(v =>
                v.id === videoId
                    ? { ...v, likeCount: res.data.likeCount }
                    : v
                )
            );

          }catch (err) {
            console.error(err);
          }        
    }    

    // 조회수 처리
    const videoViewCount = async(videoId) => {

          try {

            // 1. UI +1
            const viewed = JSON.parse(localStorage.getItem("viewed") || "[]");

            // localStorage에 값이 있으면 중복 카운트 안되게 처리
            if (!viewed.includes(videoId)) {

                setPopVideos(prev =>
                    prev.map(v =>
                        v.id === videoId
                        ? { ...v, viewCount: v.viewCount + 1 }
                        : v
                ));

                setVideos(prev =>
                prev.map(v =>
                    v.id === videoId
                    ? { ...v, viewCount: v.viewCount + 1 }
                    : v
                ));

                await videoViewCountApi(videoId); // DB count +1

                localStorage.setItem("viewed", JSON.stringify([...viewed, videoId]));
            }

          }catch (err) {
            console.error(err);
          }      
    }

    const scrollLeft = () => {

        const slider = sliderRef.current;
        console.log("slider : ",slider);
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        console.log("slider.scrollWidth : ",slider.scrollWidth);        
        console.log("slider.clientWidth : ",slider.clientWidth);    
        console.log("slider.scrollLeft : ",slider.scrollLeft);
        console.log("maxScroll : ",maxScroll);

        if (slider.scrollLeft >= maxScroll - 10) {
            // 끝이면 처음으로 이동
            slider.scrollTo({
            left: 0,
            behavior: "smooth"
            });
        } else {
            slider.scrollBy({
            left: 1530,
            behavior: "smooth"
            });
        }
    };

    const scrollRight = () => {
        
        const slider = sliderRef.current;

        if (slider.scrollLeft <= 0) {
            // 처음이면 끝으로 이동
            slider.scrollTo({
            left: slider.scrollWidth,
            behavior: "smooth"
            });
        } else {
            slider.scrollBy({
            left: -1530,
            behavior: "smooth"
            });
        }
    };    

    const handleSearch = (e) => {
        if(e.key != "Enter") {
            return;
        }

        setHasNext(true);        
        setVideos([]);
        setPage(0);

        getVideos(sortType, 0);
    }

    return(

        <div className="mv-main-container">

                <div className="mv-main-head" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "auto 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "70% 0"
            }}>
                    <div className="mv-main-title">
                        <h1>Video</h1>
                    </div>
                </div>

                <div className="mv-main-scroll">

                    <div className="mv-sidebar-divider"></div>

                    {/* 상단 스크롤 */}
                    <div className="mv-container-scroll">
                        <div className="mv-slider-wrapper">
                            <button className="mv-slider-btn mv-left" onClick={scrollLeft}>❮</button>
                            <div className="mv-slider" ref={sliderRef}>

                                {popVideos.map((popVideo,index) => (
                                    
                                    <div className="mv-scroll-card" key={popVideo.id}>
                                        <img
                                            src={getYoutubeThumbnail(popVideo.url)}
                                            onClick={() =>{
                                                videoViewCount(popVideo.id)
                                                window.open(popVideo.url, "_blank")
                                            }}
                                            style={{
                                                filter: popVideo.status === "1" ? "none" : "grayscale(100%)"
                                            }}
                                        />

                                        <div className="mv-scroll-info-body">
                                            <div className="mv-scroll-rank">
                                                <div className={`${popVideo.status === "1" ? "mv-ongoing-bc" : "mv-ended-bc" }`}>
                                                    <div className={`${popVideo.status === "1" ? "mv-ongoing-fc" : "mv-ended-fc" }`}>{index + 1}</div>
                                                    <div className={`mv-scroll-status ${popVideo.status === "1" ? "mv-ongoing-fc" : "mv-upcoming-fc" }`}>
                                                        {statusText[popVideo.status]}
                                                    </div>
                                                </div>
                                                <div className={`mv-scroll-status ${isBookmarked(popVideo.id) ? "mv-ongoing-all" : "mv-ended-all"}`}
                                                    onClick={()=>{toggleVideBookmark(popVideo.id)}} style={{cursor:'pointer'}}
                                                >
                                                    북마크
                                                </div>

                                            </div>
                                            <div className="mv-scroll-info">
                                                <div className="mv-scroll-hit-like">
                                                    <span><FontAwesomeIcon icon={faEye} /> {popVideo.viewCount}</span>
                                                    <span onClick={()=> toggleVideoLike(popVideo.id)} style={{cursor:'pointer'}}>
                                                        <FontAwesomeIcon icon={faHeart} color={isLiked(popVideo.id) ? "red" : "gray"}/>
                                                        {popVideo.likeCount}
                                                    </span>
                                                    {/* <FontAwesomeIcon icon={faCrown} /> */}
                                                </div>
                                                <div className="mv-scroll-name">{popVideo.name}</div>
                                                <div className="mv-scroll-title ellipsis-multi">{popVideo.title}</div>
                                            </div>
                                        </div>
                                    </div>

                                ))}

                            </div>
                            <button className="mv-slider-btn mv-right" onClick={scrollRight}>❯</button>
                        </div>
                    </div>

                    {/* <div className="sidebar-divider"></div> */}

                </div>

                <div className="mv-sidebar-divider"></div>

                {/* start main-list */}
                <div className="mv-main-list">
                    
                    <ul className="mv-form">
                        <li>
                            <select onChange={(e) => setSortType(e.target.value)} className="mv-select">
                            {sorts.map((item) => (
                                <option key={item.value} value={item.value}>
                                {item.label}
                                </option>
                            ))}
                            </select>
                        </li>
                        <li></li>
                        <li>
                            <select onChange={(e) => setSearchType(e.target.value)} className="mv-select">
                            {searchTypes.map((item) => (
                                <option key={item.value} value={item.value}>
                                {item.label}
                                </option>
                            ))}
                            </select>
                            <input type="text" class="mv-input" onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch} />

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
                            <span onClick={(()=>{setPage(prev => prev + 1)})}
                                className="mv-hasnext-status mv-ended-all">더보기</span>
                        </div>
                    }

                    {pageId &&
                        <div className="mv-hasnext">
                            <Link to="/MyMain">
                                <span className="mv-hasnext-status mv-ended-all">이전 화면으로</span>
                            </Link>
                        </div>                
                    }
                </div>
                {/* end main-list */}

            </div>

    );
}

export default MVideo;