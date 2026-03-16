import { useRef, useEffect, useState } from "react";
import "./MVideo.css";

function MVideo() {

    const members = [
        { id: 1, name: "Turner", hit:"1", url:"https://www.youtube.com/watch?v=32si5cfrCNc" },
        { id: 2, name: "Watson", hit:"10", url:"https://www.youtube.com/watch?v=CjZqVsgy95g" },
        { id: 3, name: "John Smith", hit:"21", url:"https://www.youtube.com/watch?v=BVwAVbKYYeM" },
        { id: 4, name: "Lisa Kim", hit:"31", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 5, name: "Lisa Kim", hit:"12", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 6, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 7, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 8, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 9, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 10, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 11, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 12, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 13, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 14, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
        { id: 15, name: "Lisa Kim", hit:"15", url:"https://www.youtube.com/watch?v=RKhsHGfrFmY" },
    ];

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

        // console.log("slider.scrollWidth : ",slider.scrollWidth);        
        // console.log("slider.clientWidth : ",slider.clientWidth);    
        // console.log("slider.scrollLeft : ",slider.scrollLeft);
        // console.log("maxScroll : ",maxScroll);

        if (slider.scrollLeft >= maxScroll - 10) {
            // 끝이면 처음으로 이동
            slider.scrollTo({
            left: 0,
            behavior: "smooth"
            });
        } else {
            slider.scrollBy({
            left: 1560,
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
            left: -1560,
            behavior: "smooth"
            });
        }
    };

    return(

        <div className="main-container">

            <div className="main-head">
                <div className="main-title">
                <h1>Music Video</h1>
                </div>
            </div>

            <div className="main-scroll">

                {/* <div className="sidebar-divider"></div> */}

                {/* 상단 스크롤 */}
                <div className="container-scroll">
                    <div className="slider-wrapper">
                        <button className="slider-btn left" onClick={scrollLeft}>❮</button>
                        <div className="slider" ref={sliderRef}>
                            {members.map((member,index) => (
                                <div className="scroll-card" key={member.id}>

                                    <div className="scroll-card rank">{index + 1}</div>
                                    <img
                                        src={getYoutubeThumbnail(member.url)}
                                        onClick={() => window.open(member.url, "_blank")}
                                        className="scroll-img"
                                    />

                                    {/* <div className="play-btn">▶</div> */}
{/* 
                                    <div className="scroll-info">
                                        <p style={{textAlign:"right"}}>like : 10,000, hit : 5,000</p>
                                        <p style={{textAlign:"center"}}>{member.name}</p>
                                    </div> */}
                                    <div className="progress-container">
                                        <div className="progress-bar" style={{ width: "50%" }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="slider-btn right" onClick={scrollRight}>❯</button>
                    </div>
                </div>

                {/* <div className="sidebar-divider"></div> */}

            </div>

            {/* start main-list */}
            <div className="main-list">

                <select onChange={(e)=>setCategory(e.target.value)} className="moden-select">
                {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                    {item.label}
                    </option>
                ))}
                </select>

                <div className="row-box">
                    <div className="row">
                        {members.map(member => (

                            <div className="column" key={member.id}>
                                <div className="card">
                                    <div className="img-container">
                                        <img
                                            src={getYoutubeThumbnail(member.url)}
                                            onClick={() => window.open(member.url, "_blank")}
                                        />
                                        <div className="list-play-btn">▶</div>
                                    </div>
                                    <h2>{member.name}</h2>
                                    <p>{member.hit}</p>
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