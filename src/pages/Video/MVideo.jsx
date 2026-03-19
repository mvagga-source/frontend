import { useRef, useEffect, useState } from "react";
import "./MVideo.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCrown, faHeart } from '@fortawesome/free-solid-svg-icons'
import bg from "../../assets/images/singer_bg.png";


function MVideo() {

    const members = [
        { id: 1, name: "25번 연습생", title:"Love You Like A Love Song - Selena...", status:"1", hit:"1", url:"https://www.youtube.com/watch?v=32si5cfrCNc" },
        { id: 2, name: "5번 연습생", title:"Love You Like A Love Song - Selena...", status:"1", hit:"10", url:"https://www.youtube.com/watch?v=CjZqVsgy95g" },
        { id: 3, name: "101번 연습생", title:"Love You Like A Love Song - Selena...", status:"0", hit:"21", url:"https://www.youtube.com/watch?v=BVwAVbKYYeM" },
        { id: 4, name: "85번 연습생", title:"에스파 'Pink Hoodie' (Official Audio)", status:"1", hit:"31", url:"https://www.youtube.com/watch?v=ekr2nIex040" },
        { id: 5, name: "26번 연습생",title:"Love You Like A Love Song - Selena...", status:"0", hit:"12", url:"https://www.youtube.com/watch?v=jWQx2f-CErU" },
        { id: 6, name: "1번 연습생",title:"Love You Like A Love Song - Selena...", status:"1", hit:"15", url:"https://www.youtube.com/watch?v=q6_CfyZgF-s" },
        { id: 7, name: "78번 연습생",title:"Love You Like A Love Song - Selena...", status:"0", hit:"15", url:"https://www.youtube.com/watch?v=ekr2nIex040" },
        { id: 8, name: "88번 연습생",title:"Love You Like A Love Song - Selena...", status:"0", hit:"15", url:"https://www.youtube.com/watch?v=mrV8kK5t0V8" },
        { id: 9, name: "91번 연습생",title:"Love You Like A Love Song - Selena...", status:"1", hit:"15", url:"https://www.youtube.com/watch?v=U-itOp4PgBs" },
        { id: 10, name: "56번 연습생",title:"Love You Like A Love Song - Selena...", status:"1", hit:"15", url:"https://www.youtube.com/watch?v=jWQx2f-CErU" },
        { id: 11, name: "35번 연습생",title:"Love You Like A Love Song - Selena...", status:"0", hit:"15", url:"https://www.youtube.com/watch?v=jWQx2f-CErU" }
    ];

    const statusText = {
        "1": "오디션 통과",
        "0": "오디션 탈락"
    };

    const statusSign = {
        "1": "●",
        "0": ""
    };    

    const categories = [
        { value: "date", label: "최신순" },
        { value: "like", label: "인기순" },
        { value: "hit", label: "조회순" }
    ];

    const [category, setCategory] = useState("youtube");

    function convertYoutube(url){
        const id = url.split("v=")[1];
        return `https://www.youtube.com/embed/${id}`;
    }

    function getYoutubeThumbnail(url){
        const id = url.split("v=")[1];
        return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }

    const sliderRef = useRef(null);
    const {play,setPlay} = useState(false);

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

                            {members.map((member,index) => (
                                
                                <div className="mv-scroll-card" key={member.id}>
                                    <img
                                        src={getYoutubeThumbnail(member.url)}
                                        onClick={() => window.open(member.url, "_blank")}
                                    />

                                    <div className="mv-scroll-info-body">
                                        <div className="mv-scroll-rank">
                                            <div className={`${member.status === "1" ? "mv-ongoing-bb" : "mv-ended-bb" }`}>
                                                <div className={`${member.status === "1" ? "mv-ongoing-fc" : "mv-ended-fc" }`}>{index + 1}</div>
                                                <div className={`mv-scroll-status ${member.status === "1" ? "mv-ongoing-fc" : "mv-upcoming-fc" }`}>
                                                    {statusText[member.status]}
                                                </div>
                                            </div>
                                            <div className="mv-scroll-status mv-ended-all">
                                                북마크
                                            </div>
                                        </div>
                                        <div className="mv-scroll-info">
                                            <div className="mv-scroll-hit-like">
                                                <span><FontAwesomeIcon icon={faEye} /> 55</span>
                                                <span><FontAwesomeIcon icon={faHeart} /> 101</span>
                                                {/* <FontAwesomeIcon icon={faCrown} /> */}
                                            </div>
                                            <div className="mv-scroll-name">{member.name}</div>
                                            <div className="mv-scroll-title">{member.title}</div>
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
                
                <select onChange={(e)=>setCategory(e.target.value)} className="mv-select">
                {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                    {item.label}
                    </option>
                ))}
                </select>

                <div className="mv-row-box">
                    <div className="mv-row">
                        {members.map(member => (

                            <div className="mv-column" key={member.id}>
                                <div className="mv-card">
                                    <div className={`mv-info-box ${member.status === "1" ? "mv-passed-bb" : "mv-ended-bb" }`}>
                                        
                                        <img
                                            src={getYoutubeThumbnail(member.url)}
                                            onClick={() => window.open(member.url, "_blank")}
                                        />
                                        <div className="mv-row-hitlike">
                                            <span><FontAwesomeIcon icon={faEye} /> 55</span>
                                            <span><FontAwesomeIcon icon={faHeart} /> 101</span>
                                            {/* <FontAwesomeIcon icon={faCrown} /> */}
                                        </div>
                                        <div className="mv-row-info-name">{member.name}</div>
                                        <div className="mv-row-info-title">{member.title}</div>
                                        <ul>
                                            <li className="mv-row-status mv-ongoing-fc">{statusSign[member.status]}</li>
                                            <li></li>
                                            <li className="mv-row-status mv-ended-all">북마크</li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* end main-list */}
           
        </div>
    );
}

export default MVideo;