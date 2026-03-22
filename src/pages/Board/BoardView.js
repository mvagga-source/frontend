import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./BoardView.module.css";
import { DelBtn, SaveBtn, MoveBtn } from "../../components/button/Button";
import BoardComment from "./boardComponent/BoardComment";
import Content from "../../components/Title/ContentComp";
import { getBoardViewApi, BoardDeleteApi, BoardLikeSaveApi } from "./BoardApi";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import BoardContent from "./boardComponent/BoardContent";

function BoardView() {
  const { bno } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  // 1. 추천/비추천 상태 관리 (null: 미선택, 'up': 추천, 'down': 비추천)
  const [postVote, setPostVote] = useState(null); 
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  
  const getBoardView = async () => {
    getBoardViewApi({ bno })
    .then((res) => {
      if (res.data.success) {
        setBoard(res.data.map.board);
        const myLike = res.data.map.myLike;
        if (myLike === 1) setPostVote('up');
        else if (myLike === -1) setPostVote('down');
        else setPostVote(null);
      }
    });
  };
  
  useEffect(() => {
    getBoardView();
  }, [bno]);

  const handleUpdate = () => {
    navigate(`/BoardUpdate/${bno}`);
  };

  const handleDelete = () => {
    if (window.confirm("삭제하시겠습니까?")) {
      const formData = new FormData();
      formData.append("bno", bno);
      BoardDeleteApi(formData).then((res) => {
        if (res.data.success) {
          alert("삭제되었습니다.");
          // replace: true를 추가하여 히스토리 스택에서 현재 페이지를 제거
          navigate("/BoardList", { replace: true });
        }
      });
    }
  };

  // 2. 버튼 클릭 시 상태를 바꿔주는 함수
  const handleBoardLike = (type) => {
    // 서버로 보낼 데이터 구성 (BoardLikeDto 구조에 맞춤)
    const voteData = {
      board: { bno: bno }, // ManyToOne 관계이므로 객체 구조
      isLike: type === 'up' ? 1 : -1
    };

    BoardLikeSaveApi(voteData).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setBoard(res.data.board);
        const myLike = res.data.myLike;
        if (myLike === 1) setPostVote('up');
        else if (myLike === -1) setPostVote('down');
        else setPostVote(null);
      }
    });
  };

  if (!board) {
    return <div>Loading...</div>; 
  }

  return (
    <Content TitleName="Board Detail">
      <div className={styles.viewContainer}>

        {/* 게시글 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>{board.btitle}</h2>
          <div className={styles.info}>
            {/* 왼쪽: 작성자 */}
            <div className={styles.infoLeft}>
              <span className={styles.author}>작성자 : {board.member?.id || "알 수 없음"}</span>
            </div>

            {/* 오른쪽: 날짜(위) + 수치(아래) */}
            <div className={styles.infoRight}>
              <div className={styles.dateRow}>
                {dayjs(board.bdate).format("YYYY-MM-DD HH:mm:ss")}
              </div>
              <div className={styles.statsRow}>
                <span>조회수 {board.bhit}</span>
                <span className={styles.divider}>|</span>
                <span style={{color:'#facc15'}}>추천 {board.likeCount || 0}</span>
                <span className={styles.divider}>|</span>
                <span style={{color:'#ff7a8a'}}>비추천 {board.dislikeCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <BoardContent content={board.bcontent} />

        {/* 추천/비추천 버튼 섹션 */}
        <div className={styles.postVoteArea}>
          <button 
            className={`${styles.postVoteBtn} ${postVote === 'up' ? styles.activeUp : ''}`}
            onClick={() => handleBoardLike('up')}
          >
            👍 추천 <span className={styles.voteCount}>{board.likeCount || 0}</span>
          </button>
          <button 
            className={`${styles.postVoteBtn} ${postVote === 'down' ? styles.activeDown : ''}`}
            onClick={() => handleBoardLike('down')}
          >
            👎 비추천 <span className={styles.voteCount}>{board.dislikeCount || 0}</span>
          </button>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.btnArea}>
          <MoveBtn onClick={() => navigate("/BoardList")}>목록으로</MoveBtn>
          {user && user.id === board.member?.id && (
            <div className={styles.rightBtns}>
              <SaveBtn onClick={handleUpdate}>수정</SaveBtn>
              <DelBtn onClick={handleDelete}>삭제</DelBtn>
            </div>
          )}
        </div>

        {/* 이전글 / 다음글 네비게이션 */}
        <div className={styles.navSection}>
          <div className={styles.navRow}>
            <span className={styles.navLabel}>이전글 ▲</span>
            {board.prevBno ? (
              <Link to={`/boardView/${board.prevBno}`} className={styles.navLink}>{board.prevTitle}</Link>
            ) : (
              <span className={styles.noNav}>이전 글이 없습니다.</span>
            )}
          </div>
          <div className={styles.navRow}>
            <span className={styles.navLabel}>다음글 ▼</span>
            {board.nextBno ? (
              <Link to={`/boardView/${board.nextBno}`} className={styles.navLink}>{board.nextTitle}</Link>
            ) : (
              <span className={styles.noNav}>다음 글이 없습니다.</span>
            )}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <BoardComment bno={board.bno}/>

      </div>
    </Content>
  );
}

export default BoardView;