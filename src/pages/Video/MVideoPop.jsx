import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

// Api
import { toggleBookmarkApi } from "../Common/BookmarkApi";
import { getVideoPageApi, videoViewCountApi } from "./MVideoApi";

// function
import { getYoutubeThumbnail, statusText } from './MVivdeoFunction';
import "./MVideo.css";


function MVideo({ dataParams }) {

    const {
        popVideos,
        setPopVideos,
        toggleVideBookmark,
        videoViewCount,
        toggleVideoLike,
        isBookmarked,
        isLiked
    } = dataParams;     

    const sliderRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuth();
    
    const params = useRef({
        page : 0,
        size : 10,
        sort : "POPULAR", 
        search : "",
        searchType : "",
        deletedFlag : "N"
    });      

    // 비디오 리스트(인기순)
    useEffect(() => {

        const getPopular = async (searchParams) => {

            const res = await getVideoPageApi(searchParams);
            const data = await res.data.list;

            setPopVideos(prev => [...prev, ...data.slice(0, 10)]);
        };

        getPopular();

    }, [params.current]);

    const scrollLeft = () => {

        const slider = sliderRef.current;
        const maxScroll = slider.scrollWidth - slider.clientWidth;

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

    return(

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
        </div>
    );
}

export default MVideo;