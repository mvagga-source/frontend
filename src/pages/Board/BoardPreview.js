import React, { useEffect, useState } from "react";
import styles from "./BoardView.module.css"; // 기존 상세페이지 CSS 재사용
import Content from "../../components/Title/ContentComp";

function BoardPreview() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("board_preview");
    if (data) {
      setBoard(JSON.parse(data));
    }
  }, []);

  if (!board) return <div>미리보기 데이터를 불러오는 중...</div>;

  return (
    <Content TitleName="Board Preview (미리보기 모드)">
      <div className={styles.viewContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>{board.btitle}</h2>
          <div className={styles.info}>
            <span>작성자: {board.member.id}</span>
            <span>날짜: {board.bdate}</span>
            <span>조회수: 0</span>
          </div>
        </div>

        {/* 핵심: dangerouslySetInnerHTML와 contentBox 클래스 적용 */}
        <div 
          className={styles.contentBox} 
          dangerouslySetInnerHTML={{ __html: board.bcontent }} 
        />
        
        <div style={{ textAlign: 'center', color: '#71717a', marginTop: '50px' }}>
          --- 미리보기 모드에서는 댓글과 버튼이 비활성화됩니다 ---
        </div>
      </div>
    </Content>
  );
}

export default BoardPreview;