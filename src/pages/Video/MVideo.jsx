import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Content from "../../components/Title/ContentComp";

// Api
import { toggleBookmarkApi } from "../Common/BookmarkApi";
import { getMyPageBookmarskApi } from '../MyPage/MyMainApi';
import { getIdolStatusApi, toggleVideoLikeApi, videoViewCountApi } from "./MVideoApi";

// function
import { useAuth } from "../../context/AuthContext";
import MVideoPop from "./MVideoPop";
import MVideoList from "./MVideoList";
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
    const [idolStatus, SetIdolStatus] = useState([]);

    const isBookmarked = (pageId) => {
        return bookmarks.includes(pageId);
    };

    const isLiked = (videoId) => {
        return videosLike.includes(videoId);
    }

    // API params
    const params = useRef({
        memberId : user.id,
        pageType : pageType
    });     

    useEffect(()=>{

        const getIdolStatus = async () => {
            try {
            // 아이돌 진출 상태
                const res = await getIdolStatusApi({});
                if (res.data.success) {
                    const data = await res.data.data.map(i=> i.IDOL_PROFILE_ID);
                    console.log(data)
                    SetIdolStatus(data);
                }
            } catch (e) {
                console.error("비디오 리스트 호출 오류 : ",e);
            }
        }

        getIdolStatus();
    },[]);

    useEffect(()=>{

        // 나의 북마크 리스트
        const getMyPageBookmarsk = async (searchParams) => {
            try{
                const bookmarkRes = await getMyPageBookmarskApi(searchParams);
                const pageId = await bookmarkRes.data.map(b => b.pageId);
                setBookmarks(pageId);
            }catch(e){
                console.error("북마크 정보 호출 오류",e);
            }
        };

        getMyPageBookmarsk(params.current);

    },[params.current]);

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
            const data = await res.data;
            if (data) {
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

    const goToProfile = (profileId) => {
        navigate(`/Audition/profile/${profileId}`);
    };    

    const commonProps = {
        idolStatus,
        toggleVideBookmark,
        videoViewCount,
        toggleVideoLike,
        isBookmarked,
        isLiked,
        goToProfile,
    };

    // 인기 슬라이드 props 프러퍼티
    const videoPopProps = {
        ...commonProps,
        popVideos,
        setPopVideos,
    };
    
    // 인기 슬라이드 props 프러퍼티
    const videoListProps = {
        ...commonProps,
        videos,
        setVideos,
    };

    return(
        
        <Content TitleName="비디오">

            <div className="mv-sidebar-divider"></div>
            <MVideoPop
                dataParams={videoPopProps}
            />
            <div className="mv-sidebar-divider"></div>

            <MVideoList
                dataParams={videoListProps}
            />                

        </Content>
    );
}

export default MVideo;