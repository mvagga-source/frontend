import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';
import "./IdolProfile.css";
import axios from "axios"; 
import { IdolViewVoteApi, getIdolProfileApi } from "./idolApi";
import axiosInstance from "../../api/axiosInstance";
import { getAuditionListApi, getRankingApi, getAllIdolsApi } from "../../api/auditionApi";
import { getVideoPageApi } from "../Video/MVideoApi";
import { getYoutubeThumbnail } from "../Video/MVivdeoFunction";
import Content from "../../components/Title/ContentComp";

// 임시 데이터 (스토리보드 및 손그림 기반)
const API_URL = process.env.REACT_APP_API_URL;
const IDOL_DATA = {
  profile: {
    name: "로딩 중...", // {name} 에러 수정: 초기 텍스트로 변경
    nameEn: "NAKAMARU AJU",
    birth: "2008/01/21",
    height: 170,
    mbti: "ESFJ",
    hobby: "동영상 편집, 계획 세우기",
    keyword: "NICE",
    // mainImgUrl: "https://via.placeholder.com/150x200", 
    votes: { rank: "-", current: 0 },
  },
  photos: [
    { id: 1, url: "/default_profile.png", desc: "컨셉 포토 1" }, // 외부 링크 대신 내부 경로로!
    { id: 2, url: "/default_profile.png", desc: "컨셉 포토 2" },
    { id: 3, url: "/default_profile.png", desc: "연습실 셀카" },
    { id: 4, url: "/default_profile.png", desc: "무대 비하인드" },
  ],
  videos: [
    { id: 1, title: "추천 카메라", thumb: "/default_profile.png" },
    { id: 2, title: "1 MIN PR", thumb: "/default_profile.png" },
    { id: 3, title: "연습 직캠 영상", thumb: "/default_profile.png" },
    { id: 4, title: "비하인드 & 인터뷰", thumb: "/default_profile.png" },
  ],
};


/* --- [채팅방] 컴포넌트 --- */
/* --- [방명록] 컴포넌트 --- */
function GuestBook({ idolId , user }) { // 부모(IdolDetail)로부터 아이돌 ID를 받습니다.
  const [messages, setMessages] = useState([]);
  const [inputName, setInputName] = useState("");
  const [inputMsg, setInputMsg] = useState("");

  // 1. 페이지 로드 시 해당 아이돌의 방명록 목록 가져오기
  useEffect(() => {
    const fetchMessages = async () => {
      if (!idolId) return;
      try {
        const response = await axiosInstance.get(`http://localhost:8181/api/guestbook/${idolId}`);
        setMessages(response.data);
        
        setInputMsg("");
      } catch (error) {
        console.error("방명록 로딩 실패:", error);
      }
    };
    if (idolId) fetchMessages();
  }, [idolId]);

  // 1. 금지어 리스트 (여기에 원하는 단어를 추가하세요)
  const forbiddenWords = ["바보", "멍청이", "돼지", "뚱땡", "죽어", "ㅅㅂ", "시발", "나가"];


  // 2. 방명록 남기기 (DB 저장)
  const handleSubmit = async () => {
    if (!user || !user.nickname) {
    alert("로그인이 필요한 서비스입니다!");
    return;
  }
  // 2. 내용 확인
    if (!inputMsg.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }
    // 2. 욕설 체크 로직
    // inputMsg 안에 forbiddenWords 중 하나라도 포함되어 있는지 확인
    const hasBadWord = forbiddenWords.some(word => inputMsg.includes(word));

    if (hasBadWord) {
      alert("부적절한 표현이 포함되어 있습니다. 예쁜 말을 사용해주세요! 😊");
      return; // 여기서 함수를 종료시켜 서버로 보내지 않음
    }


    const newPost = {
      profileId: idolId,  // 백엔드 DTO의 profileId와 매칭
      writer: user.nickname,  // 백엔드 DTO의 writer와 매칭
      content: inputMsg,  // 백엔드 DTO의 content와 매칭
    };

    try {
      const response = await axiosInstance.post(`http://localhost:8181/api/guestbook/add`, newPost);
      
      // 서버에서 필터링되어 저장된 최신 데이터를 리스트 최상단에 추가
      setMessages(prev => [response.data, ...prev]);
      
      // 입력창 초기화
      
      setInputMsg("");
      alert("응원이 성공적으로 등록되었습니다! 💙");
    } catch (error) {
      console.error("전송 에러:", error);
      alert("전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="id-guestbook">
      <h4 className="id-chat-title">응원 방명록</h4>
      <div className="id-gb-list">
        {messages.map((m, index) => (
          <div key={m.id || index} className="id-gb-card">
          <div className="id-gb-header">
            {/* 백엔드 DTO의 필드명인 writer와 content를 정확히 사용하세요 */}
            <span className="id-gb-user">{m.writer || "익명"}</span>
            <span className="id-gb-date">
              {m.createAt ? new Date(m.createAt).toLocaleDateString() : "방금 전"}
            </span>
          </div>
          <p className="id-gb-msg">{m.content}</p>
        </div>
              
        ))}
      </div>
      <div className="id-gb-form">
        <div className="id-gb-user-info">
          {user ? (
            <span className="id-gb-current-user"><strong>{user.nickname} </strong>님, 응원 메세지를 남겨보세요!</span>
          ) : (
            <span className="id-gb-login-plez">로그인이 필요합니다</span>
          )}
        </div>
        <textarea 
          placeholder={user ? "따뜻한 응원을 남겨주세요" : "로그인 후 작성이 가능합니다"} 
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)} 
          disabled={!user} // 로그인 안 하면 입력 못 하게 막음
        />
        <button onClick={handleSubmit}>남기기</button>
      </div>
    </div>
  );
}

/* --- [메인 페이지] --- */
export default function IdolDetail() {

  const navigate = useNavigate();
  const { id } = useParams(); 
  const loc = useLocation();

  const [finalVotes, SetFinalVotes] = useState(0);

  // 1. state에서 데이터를 먼저 꺼냅니다 (idol 변수 참조 금지!)
  const stateData = loc.state || {};
  const displayRank = stateData.rank || "-";
  //const finalVotes = Number(idol[4] ?? 0);
  //const finalVotes = stateData.finalVotes || 0;

  // 2. [★가장 중요] 그 다음에 idol 상태를 선언합니다.
  const [idol, setIdol] = useState(IDOL_DATA); 
  const [loading, setLoading] = useState(true);

  // 3. 로그는 반드시 위 선언들이 다 끝난 "다음에" 찍으세요.
  console.log("넘겨받은 순위:", displayRank);
  console.log("현재 아이돌 상태:", idol);

  // ✅ 안전하게 수정 (user가 있을 때만 role을 읽고 소문자로 변환)
  const { user } = useAuth();

// ✅ 아래 로그를 추가해서 브라우저 콘솔(F12)을 확인해보세요!
  console.log("현재 로그인한 유저 정보:", user);
  console.log("유저의 권한(role):", user?.role);
  // 콘솔에서 'role' 대신 어떤 이름으로 데이터가 들어오는지 확인 필수!
console.log("실제 유저 데이터 구조:", user);

  const userRole = user?.role?.toLowerCase();

  // 2. tempFiles: 업로드 대기 중인 파일 (스크린샷에 있던 변수)
  const [tempFiles, setTempFiles] = useState([]);

  // 3. handleTempDelete: 취소 버튼 클릭 시 실행될 함수
  const handleTempDelete = () => {
    setTempFiles([]); // 임시 파일 목록 비우기
    const fileInput = document.getElementById("tempUpload");
    if (fileInput) fileInput.value = "";
  };


  // 1. 사진 삭제 기능 (실제 서버 연동)
  const handleImageDelete = async () => {
    if (!window.confirm("정말 프로필 사진을 삭제하시겠습니까?")) return;

    try {
      // 서버의 삭제 API 호출 (경로는 프로젝트 API 명세에 맞춰 확인 필요)
      await axiosInstance.delete(`http://localhost:8181/api/idolProfile/deleteImage/${id}`);
      
      alert("사진이 삭제되었습니다.");
      
      // 화면에서 이미지 제거 (상태 업데이트)
      setIdol(prev => ({
        ...prev,
        profile: { ...prev.profile, mainImgUrl: null }
      }));
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("사진 삭제 중 오류가 발생했습니다.");
    }
  };

  // 2. 사진 등록 기능 (업로드 후 즉시 반영)
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("idolProfileId", id);

  try {
    const response = await axiosInstance.post(
      "http://localhost:8181/api/idolProfile/uploadImage",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // 서버가 단순히 파일명 문자열(예: "1.jpg")만 보낸다고 가정할 때
    const newFileName = response.data; 
    alert("사진이 등록되었습니다!");

    // ✅ 캐시 방지를 위해 뒤에 ?t=시간값을 붙여줍니다.
   setTimeout(() => {
      window.location.reload(); // 가장 확실한 방법은 페이지 전체 새로고침입니다.
    }, 500);

  } catch (error) {
    console.error("업로드 실패:", error);
    alert("사진 업로드에 실패했습니다.");
  }
};

  
  useEffect(() => {
    if (!id) return;
  const fetchIdolData = async () => {
    try {
      setLoading(true);
      const response = await getIdolProfileApi(id); 
      // 1. 서버가 보내준 생 데이터를 눈으로 직접 확인 (매우 중요!)
      console.log("=== 서버 응답 형태 확인 ===");
      console.log(response.data); 
      console.log("지금 idol 상태의 photos 내용:", idol.photos);
      // 서버에서 Map.put("profile", ...)과 Map.put("mediaList", ...)로 보낸 데이터를 꺼냅니다.
      const { profile, mediaList } = response.data;
      const dbData = profile || response.data.idolProfile || response.data;
      
      
      // IdolProfile.js 이미지 렌더링 부분
      const isValidFileName = (fileName) => {
        if (!fileName) return false;
        // 한글이 포함되어 있는지 체크하는 정규식
        const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        return !koreanRegex.test(fileName);
      };
      // 3. 데이터가 있고, 그 안에 이름(name) 필드가 있는지 체크
      if (dbData && (dbData.name || dbData.idolName)) { 
        setIdol(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: dbData.name || dbData.idolName,
            nameEn: dbData.nameEn || prev.profile.nameEn,
            birth: dbData.birth || prev.profile.birth,
            height: dbData.height || prev.profile.height,
            mbti: dbData.mbti || prev.profile.mbti,
            hobby: dbData.hobby || prev.profile.hobby,
            keyword: dbData.keyword || prev.profile.keyword,
            mainImgUrl: dbData.mainImgUrl || prev.profile.mainImgUrl,
            // votes: { 
            //   rank: displayRank !== "-" ? displayRank : (dbData.idolId || dbData.id || id),
            //   current: (finalVotes !== 0) ? finalVotes : (dbData.voteCount || dbData.votes || finalVotes)
            // },
          },
         photos: mediaList ? mediaList.map(m => ({
              // 서버가 보내주는 실제 데이터 구조를 console.log(mediaList)로 꼭 확인하세요!
              id: m.mediaId || m.MEDIAID || m.id || m.ID,
              url: m.url || m.URL || m.fileName || m.FILENAME, 
              desc: m.description || m.DESCRIPTION || ""
          })) : [],
          
        }));
        console.log("✅ 상태 업데이트 성공!");
      } 
      else {
        console.error("❌ 서버에서 빈 데이터를 보냈습니다. DB를 확인하세요.");
      }

      // 비디오 정보 불러오기 start  ===========================================================
      const res = await getVideoPageApi(
            {
              page : 1,
              size : 4,
              sortType : "LATEST", 
              search : dbData.name || dbData.idolName,
              searchType : "NAME",
              deletedFlag : "N"
            }
      );

      const videoData = await res.data.list;
      console.log("videoData : ",videoData);
      setIdol(prev => ({
        ...prev,
        // videos: [
        //   { id: 1, title: "추천 카메라", thumb: "/default_profile.png" },
        //   { id: 2, title: "1 MIN PR", thumb: "/default_profile.png" },
        //   { id: 3, title: "연습 직캠 영상", thumb: "/default_profile.png" },
        //   { id: 4, title: "비하인드 & 인터뷰", thumb: "/default_profile.png" },
        // ]
        videos: videoData ? videoData.map(v => ({
              id: v.id || "",
              title: v.title || "",
              thumb: v.url || ""
        })) : [],
      }));

      // 비디오 정보 불러오기 end ===========================================================

      // 랭킹 정보 불러오기 start ===========================================================
      const ALres =  await getAuditionListApi()
      const ALdata = ALres.data;
      const activeRound = ALdata[ALdata.length -1];

      const RKres = await getRankingApi(activeRound.auditionId);
      const RKdata = RKres.data;

      console.log("RKdata : ", RKdata);

      // 초기화
      setIdol(prev => ({
        ...prev,
        votes: 
            { 
              round : activeRound.auditionId,
              rank: 0, 
              finalVotes: 0 
            }
      }));

      // 일치하는 랭킹 정보 
      RKdata.forEach((idol, i) => {
        if (idol[1] === dbData.name) {
          console.log("i, value :", i, ",", idol[1], ",", idol[4]);

          setIdol(prev => ({
            ...prev,
            votes: 
                { 
                    round : activeRound.auditionId,
                    rank: i + 1, 
                    finalVotes: idol[4] 
                }
          }));
        }
      });

    } catch (err) {
      console.error("❌ API 호출 자체 실패:", err);
    } finally {
      setLoading(false);
    }
  };

fetchIdolData();
}, [id])

  if (loading) return <div style={{color: 'white', padding: '20px'}}>데이터 연결 중...</div>;

  return (
    <div className="id-wrap">
      <div className="id-back-bar">
        <button className="id-back-btn" onClick={() => navigate(-1)}>
          ← 참가자 목록으로 돌아가기
        </button>
      </div>

      <div className="id-top-content">
        <div className="id-left-area">
          <div className="id-profile-section">
            <div className="id-p-img">
              <img 
                // key를 주면 주소가 바뀔 때 이미지를 아예 새로 갈아 끼웁니다.
                key={idol.profile.mainImgUrl || 'default'} 
                src={idol.profile.mainImgUrl && idol.profile.mainImgUrl !== "default_profile.png"
                ? `http://localhost:8181/profile/${idol.profile.mainImgUrl.replace(/^\//, "")}`
                : "/default_profile.png"
              }
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null; // 무한 루프 방지
                  e.target.src = "/default_profile.png";
                }}
              />
            </div>

            <div className="id-p-info">
              {/* ✅ 이름과 버튼을 감싸는 행 */}
              <div className="id-p-name-row">
                {/* 왼쪽: 국문/영문 이름 묶음 */}
                <div className="id-name-group">
                  <h2>{idol.profile.name}</h2>
                  <span>{idol.profile.nameEn}</span>
                </div>

                {/* 오른쪽: 공유 버튼 묶음 */}
                <div className="id-p-share">
                  <button>𝕏</button> 
                  <button>공유</button>
                </div>
              </div>
              <table className="id-info-table">
                <tbody>
                  {[
                    ["생년월일", idol.profile.birth],
                    ["키", `${idol.profile.height}cm`],
                    ["MBTI", idol.profile.mbti],
                    ["취미", idol.profile.hobby],
                    ["나를 나타내는 키워드", idol.profile.keyword],
                  ].map(([label, val]) => (
                    <tr key={label}>
                      <th>{label}</th>
                      <td>{val}</td>
                    </tr>
                  ))}

{/* 
                  
                  {user && (
                    <tr>
                      <td colSpan="2">
                        <div className="id-btn-row">
                          <label htmlFor="tempUpload" className="id-btn-upload">
                            <span className="id-btn-icon">📁</span> 사진 등록
                          </label>
                          <input 
                            type="file" 
                            id="tempUpload" 
                            style={{ display: 'none' }} 
                            onChange={handleImageUpload} 
                          />
                          {idol.profile.mainImgUrl && (
                            <button onClick={handleImageDelete} className="id-btn-delete">
                              <span>🗑️</span> 사진 삭제
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
)} */}

                  </tbody>
              </table>
            </div>
          </div>

          <div className="id-photo-section">
            <h4 className="id-sec-title">사진</h4>
            <div className="id-photo-grid">
                {idol.photos.length > 0 ? (
                  idol.photos.map((p) => (
                    <div key={p.id} className="id-photo-item">
                      <img 
                        /* 1. 경로 확인: 서버에서 '1.jpg'라고 온다면 /images/1.jpg가 되어야 함 */
                        src={p.url.startsWith('http') ? p.url : `http://localhost:8181/images/${p.url.replace(/^\//, "")}`} 
                        alt={p.desc} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "/default_profile.png"; // 실패 시 대체 이미지
                        }}
                      />
                      {p.desc && <div className="id-photo-overlay">{p.desc}</div>}
                    </div>
                  ))
                ) : (
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>등록된 사진이 없습니다.</p>
                )}
              </div>
          </div>
        </div>

        <div className="id-side-bar">
          
          
          <div className="id-vote-card">
            <div className="id-v-stat">
              <strong>{idol.votes.rank ? `${idol.votes.round} 차`: ""}</strong>
            </div>
            <div className="id-v-stat">
              {/* <strong>{displayRank !== "-" ? displayRank : idol.profile.votes.rank}위</strong> */}
              <strong>{idol.votes.rank ? idol.votes.rank : "탈락"}</strong>
              <span>현재 순위</span>
            </div>
            <div className="id-v-stat">
              {/* <strong>{finalVotes.toLocaleString()}</strong> */}
              <strong>{idol.votes.finalVotes ? idol.votes.finalVotes : 0}</strong>
              <span>득표수</span>
            </div>
          </div>

          <button 
            className="id-btn-sub" 
            onClick={() => window.location.href = '/Audition/vote'}
          >
            투표 하러가기
          </button>


          <button className="id-btn-sub">굿즈 보러가기</button>


          <button 
          className="id-btn-sponsor" 
          onClick={() => navigate(`/support/${id}`)}
        >
          후원하기
        </button>

          <GuestBook idolId={id} user={user} />

          <div className="id-calendar-room">
            <h4 className="id-chat-title">아이돌 스케줄</h4>
            <div className="id-calendar-box">
              <p>2026. 03</p>
              <small>스케줄 로딩 중...</small>
            </div>
          </div>
        </div>
      </div>

      <div className="id-bottom-content">
        <h4 className="id-sec-title">관련 영상 및 사진</h4>
        <div className="id-video-grid">
          {idol.videos.length === 0 ?
            (
              <div className="id-video-item">
                <div className="id-v-thumb" style={{cursor:"pointer"}}>
                  <img />
                  <div className="id-v-play">▶</div>
                </div>
                <div className="id-v-body">
                  <p>준비된 영상이 없습니다.(모금에 참여하세요~)</p>
                </div>
              </div>
            ) 
          : 
          idol.videos.map(v => (
            <div key={v.id} className="id-video-item">
              <div className="id-v-thumb" style={{cursor:"pointer"}}>
                <img src={getYoutubeThumbnail(v.thumb)} alt={v.title} />
                <div className="id-v-play" onClick={() =>{window.open(v.thumb, "_blank")}}>▶</div>
              </div>
              <div className="id-v-body">
                <p>{v.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}