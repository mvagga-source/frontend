import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

// Api
import { toggleBookmarkApi } from "../Common/BookmarkApi";
import { getMyPageBookmarskApi } from '../MyPage/MyMainApi';
import { getMyLikesApi, getVideoApi, getVideoPageApi, toggleVideoLikeApi, videoViewCountApi } from "./MVideoApi";

// function
import { getYoutubeThumbnail, statusText, sorts, searchTypes } from './MVivdeoFunction';
import { useAuth } from "../../context/AuthContext";
import MVideoPop from "./MVideoPop";

import bg from "../../assets/images/singer_bg.png";
import "./MVideo.css";


function MVideo() {

    // 외부 파라메터
    const { pageId } = useParams();        
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuth();

    const pageType = "VIDEO"; // 페이지구분        

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

    const videoProps = {
        popVideos,
        setPopVideos,
        toggleVideBookmark,
        videoViewCount,
        toggleVideoLike,
        isBookmarked,
        isLiked
    };    

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

                

                <MVideoPop
                    dataParams={videoProps}
                />

          

                <div className="mv-sidebar-divider"></div>

            </div>

    );
}

export default MVideo;