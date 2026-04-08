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
        popVideos,
        setPopVideos,
        toggleVideBookmark,
        videoViewCount,
        toggleVideoLike,
        isBookmarked,
        isLiked,
        isPassed,
        goToProfile
    } = dataParams;     

    const sliderRef = useRef(null);
    const {user} = useAuth();
    
    // API params
    const params = useRef({
        page : 1,
        size : 15,
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

                setPopVideos(data.slice(0, 15));
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

        <div className="mv-slider">

            {/* <div className="mv-sidebar-divider"></div> */}

            {/* 상단 스크롤 */}
            <div className="mv-slider__wrapper">
                <div className="mv-slider-wrapper">
                    
                    <button className="mv-slider__btn mv-slider__btn--left" onClick={scrollLeft}>❮</button>
                    <div className="mv-slider__track" ref={sliderRef}>

                        {popVideos.map((popVideo,index) => {
                            
                            const passed = isPassed(popVideo.idol_profile?.profileId || "");

                            return(

                                <div className="mv-slider-card" key={popVideo.id}>
                                    {/* 썸네일 */}
                                    <div className='mv-slider-card__thumb'>
                                        <img
                                            src={getYoutubeThumbnail(popVideo.url)}
                                            onClick={() =>{
                                                videoViewCount(popVideo.id)
                                                window.open(popVideo.url, "_blank")
                                            }}
                                        />
                                        <svg className="mv-card__bookmark" width="22" height="22" viewBox="0 0 24 24"
                                            onClick={()=>{toggleVideBookmark(popVideo.id)}} 
                                            fill={`${isBookmarked(popVideo.id) ? "currentColor" : "none"}`} stroke="currentColor" strokeWidth="2">
                                            <path d="M19 21l-7-4-7 4V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v16z"/>
                                        </svg>
                                    </div>

                                    {/* 정보 */}
                                    <div className="mv-slider-card__info">
                                        <div className="mv-slider-card__left">
                                            <div className="mv-slider-card__rank">
                                                {index + 1}
                                            </div>
                                            <div className="mv-slider-card__profile mv-ongoing-fc"
                                                onClick={() => goToProfile(popVideo.idol_profile?.profileId || "")}>
                                                <span className={`${passed ? "mv-ongoing-fc":"mv-ended-fc"}`}>●</span>
                                                <span>프로필</span>
                                            </div>                                        
                                        </div>
                                        <div className="mv-slider-card__right">
                                            {/* 메타 */}
                                            <div className="mv-slider-card__meta">
                                                <span><FontAwesomeIcon icon={faEye} /> {popVideo.viewCount}</span>
                                                <span onClick={()=> toggleVideoLike(popVideo.id)} style={{cursor:'pointer'}}>
                                                    <FontAwesomeIcon icon={faHeart} color={isLiked(popVideo.id) ? "red" : "gray"}/>
                                                    {popVideo.likeCount}
                                                </span>
                                            </div>                                  
                                            <div className="mv-slider-card__name">{popVideo.idol_profile?.name || ""}</div>
                                            <div className="mv-slider-card__title ellipsis-multi">{popVideo.title}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                    <button className="mv-slider__btn mv-slider__btn--right" onClick={scrollRight}>❯</button>
                </div>
            </div>
            {/* <div className="mv-sidebar-divider"></div> */}
        </div>
    );
}

export default MVideoPop;