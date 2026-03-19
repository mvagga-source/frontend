import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./BoardView.module.css";
import { NeonBtn } from "../../components/button/Button";
import BoardComment from "./BoardComment";
import Content from "../../components/Title/ContentComp";
import { getBoardViewApi } from "./BoardApi";

function BoardView() {
  const { bno } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  // 1. 추천/비추천 상태 관리 (null: 미선택, 'up': 추천, 'down': 비추천)
  const [postVote, setPostVote] = useState(null); 
  
  const getBoardView = async () => {
    const res = await getBoardViewApi({ bno });
    if (res.data.success) {
      setBoard(res.data.board);
    }
  };
  
  useEffect(() => {
    getBoardView();
  }, [bno]);

  const handleUpdate = () => {
    navigate(`/BoardUpdate/${bno}`);
  };

  const handleDelete = () => {
    // 삭제 로직 구현
    console.log("삭제 클릭:", bno);
  };

  // 2. 버튼 클릭 시 상태를 바꿔주는 함수
  const handlePostVote = (type) => {
    // 이미 누른 버튼을 다시 누르면 취소(null), 아니면 해당 타입('up'/'down') 설정
    setPostVote(prev => (prev === type ? null : type));
    console.log(`게시글 ${bno}번에 ${type === 'up' ? '추천' : '비추천'} 클릭`);
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
            <span>작성자: {board.member?.id || "알 수 없음"}</span>
            <span>날짜: {board.bdate}</span>
            <span>조회수: {board.bhit}</span>
          </div>
        </div>

        {/* 본문 */}
        <div 
          className={styles.contentBox} 
          dangerouslySetInnerHTML={{ __html: board.bcontent }} 
        />

        {/* 추천/비추천 버튼 섹션 */}
        <div className={styles.postVoteArea}>
          <button 
            className={`${styles.postVoteBtn} ${postVote === 'up' ? styles.activeUp : ''}`}
            onClick={() => handlePostVote('up')}
          >
            👍 추천
          </button>
          <button 
            className={`${styles.postVoteBtn} ${postVote === 'down' ? styles.activeDown : ''}`}
            onClick={() => handlePostVote('down')}
          >
            👎 비추천
          </button>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.btnArea}>
          <NeonBtn onClick={() => navigate("/BoardList")}>목록으로</NeonBtn>
          <div className={styles.rightBtns}>
            <NeonBtn color="purple" onClick={handleUpdate}>수정</NeonBtn>
            <NeonBtn color="red" onClick={handleDelete}>삭제</NeonBtn>
          </div>
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