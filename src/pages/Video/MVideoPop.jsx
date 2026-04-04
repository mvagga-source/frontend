import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

// Api
import { getVideoPageApi, videoViewCountApi } from "./MVideoApi";

// function
import { getYoutubeThumbnail, statusText } from './MVivdeoFunction';


function MVideoPop({ dataParams }) {

    const {
        idolStatus,
        popVideos,
        setPopVideos,
        toggleVideBookmark,
        videoViewCount,
        toggleVideoLike,
        isBookmarked,
        isLiked,
        goToProfile
    } = dataParams;     

    const sliderRef = useRef(null);
    const {user} = useAuth();
    
    // API params
    const params = useRef({
        page : 0,
        size : 10,
        sortType : "POPULAR", 
        search : "",
        searchType : "",
        deletedFlag : "N"
    });      

    // 비디오 리스트(인기순)
    useEffect(() => {

        const getPopular = async (searchParams) => {

            console.log("pop : ",searchParams);
            try{
                const res = await getVideoPageApi(searchParams);
                const data = await res.data.list;

                setPopVideos(data.slice(0, 10));
            }catch(e){
                console.error("비디오 인기순위 호출 실패",e);
            }
        };

        getPopular(params.current);

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

            {/* <div className="mv-sidebar-divider"></div> */}

            {/* 상단 스크롤 */}
            <div className="mv-container-scroll">
                <div className="mv-slider-wrapper">
                    <button className="mv-slider-btn mv-left" onClick={scrollLeft}>❮</button>
                    <div className="mv-slider" ref={sliderRef}>

                        {popVideos.map((popVideo,index) => (
                            
                            <div className="mv-scroll-card" key={popVideo.id}>
                                <div className='thumb-wrap'>
                                    <img
                                        src={getYoutubeThumbnail(popVideo.url)}
                                        onClick={() =>{
                                            videoViewCount(popVideo.id)
                                            window.open(popVideo.url, "_blank")
                                        }}
                                    />
                                    <svg className="bookmark-icon" width="22" height="22" viewBox="0 0 24 24"
                                        onClick={()=>{toggleVideBookmark(popVideo.id)}} 
                                        fill={`${isBookmarked(popVideo.id) ? "currentColor" : "none"}`} stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-4-7 4V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v16z"/>
                                    </svg>
                                </div>

                                <div className="mv-scroll-info-wrap">
                                    <div className="mv-scroll-linfo">
                                        <div className={`mv-scroll-rank ${idolStatus.includes(popVideo.idol_profile?.profileId || "") ? "mv-upcoming-bc" : "mv-ended-bc" }`}>
                                            {index + 1}
                                        </div>
                                        <div className={`mv-scroll-bookmark ${idolStatus.includes(popVideo.idol_profile?.profileId || "") ? "mv-ongoing-all" : "mv-ended-all"}`}
                                            onClick={() => goToProfile(popVideo.idol_profile?.profileId || "")}>
                                            프로필
                                        </div>                                        
                                    </div>
                                    <div className="mv-scroll-rinfo">
                                        <div className="mv-scroll-hit-like">
                                            <span><FontAwesomeIcon icon={faEye} /> {popVideo.viewCount}</span>
                                            <span onClick={()=> toggleVideoLike(popVideo.id)} style={{cursor:'pointer'}}>
                                                <FontAwesomeIcon icon={faHeart} color={isLiked(popVideo.id) ? "red" : "gray"}/>
                                                {popVideo.likeCount}
                                            </span>
                                        </div>
                                        <div className="mv-scroll-name">{popVideo.idol_profile?.name || ""}</div>
                                        <div className="mv-scroll-title ellipsis-multi">{popVideo.title}</div>
                                    </div>
                                </div>
                            </div>

                        ))}

                    </div>
                    <button className="mv-slider-btn mv-right" onClick={scrollRight}>❯</button>
                </div>
            </div>
            {/* <div className="mv-sidebar-divider"></div> */}
        </div>
    );
}

export default MVideoPop;