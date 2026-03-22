import { useRef, useEffect, useState } from "react";
import "./MVideo.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCrown, faHeart } from '@fortawesome/free-solid-svg-icons'
import { getVideosApi, toggleVideoLikeApi,videoViewCountApi,getMyLikesApi } from "./MVideoApi";
import { toggleBookmarkApi, getMyBookmarkApi } from "../Common/BookmarkApi";

import { useAuth } from "../../context/AuthContext";

import bg from "../../assets/images/singer_bg.png";


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

    const {user} = useAuth();
    const pageType = "VIDEO"; // 페이지구분    

    const [category, setCategory] = useState("youtube");

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

    const categories = [
        { value: "LATEST", label: "최신순" },
        { value: "LIKE", label: "좋아요순" },
        { value: "VIEW", label: "조회순" },
        // { value: "POPULAR", label: "인기순" }
    ];    

    const sliderRef = useRef(null);

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

    const [bookmarks, setBookmarks] = useState([]);
    const [videos, setVideos] = useState([]);
    const [popVideos, setPopVideos] = useState([]);
    const [videosLike, setVideosLike] = useState([]);
    const [sortType, setSortType] = useState("LATEST");

    // pageable
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const pageSize = 15;

    const isBookmarked = (pageId) => {
        return bookmarks.includes(pageId);
    };

    const isLiked = (videoId) => {
        return videosLike.includes(videoId);
    }        

    const getVideos = async (sortType) => {

        if (loading || !hasNext) return;

        setLoading(true);

        try {

            // -- 비디오 전체 리스트
            const videoRes = await getVideosApi(page, pageSize, sortType);
            const vData = await videoRes.data.content;

            console.log("getVideos page ",page);
            console.log("getVideos vData ",vData);
            console.log("getVideos vData.length ",vData.length);

            if (vData.length < pageSize) {
               setHasNext(false);
            }

            if (vData.length > 0) {
                setVideos(prev => {
                    const merged = [...prev, ...vData];
                    const unique = merged.filter(
                        (item, index, self) =>
                            index === self.findIndex(v => v.id === item.id)
                    );
                    return unique;
                });
            }

            
            // -- 북마크 리스트
            const bookmarkRes = await getMyBookmarkApi(user.id, pageType);
            const pageId = bookmarkRes.data.map(b => b.pageId);
            setBookmarks(pageId);

            // -- 좋아요 리스트
            const likesRes = await getMyLikesApi(user.id);
            const videoId = likesRes.data.map(l => l.video.id);
            setVideosLike(videoId);


            setLoading(false);

        }catch (err) {
            console.error(err);
        }finally {
            setLoading(false);
        }   
    };

    useEffect(() => {
        const getPopular = async () => {

            // -- 비디오 전체 리스트(인기순)
            const PopvideoRes = await getVideosApi(0, 10,"POPULAR");
            const vpData = await PopvideoRes.data.content

            setPopVideos(prev => [...prev, ...vpData.slice(0, 10)]);
        };

        getPopular();

    }, []);

    useEffect (()=>{
        getVideos(sortType);
    },[page]);

    useEffect (()=>{
        setVideos([]);
        setPage(0);
        setHasNext(true);
    },[sortType]);

    const observerRef = useRef();

    // 스크롤 감지
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const target = entries[0];

            console.log("observer hasNext : ",hasNext);
            if (entries[0].isIntersecting && hasNext && !loading) {
                observer.unobserve(target.target);
                setPage(prev => prev + 1);
            }
        }, {
            threshold: 1.0
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }
        return () => observer.disconnect();
    }, [hasNext, loading]);    

    const toggleVideBookmark = async(pageId) => {

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

    const videoViewCount = async(videoId) => {

          try {

            // 1. UI +1
            const viewed = JSON.parse(localStorage.getItem("viewed") || "[]");

            if (!viewed.includes(videoId)) {

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
                                        onClick={() => window.open(popVideo.url, "_blank")}
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
                
                <select onChange={(e) => setSortType(e.target.value)} className="mv-select">
                {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                    {item.label}
                    </option>
                ))}
                </select>

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
                                            <li className="mv-row-status mv-ongoing-fc">{video.status === "1" ? "●":"" }</li>
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
            </div>
            {/* end main-list */}

                    {/* 스크롤 감지용 */}
                    <div ref={observerRef} style={{ height: "1px" }}>
                        {loading && <p>로딩중...</p>}
                    </div>               

        </div>
    );
}

export default MVideo;