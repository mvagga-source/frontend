import React, { useEffect, useState } from "react";
import styles from "./BoardView.module.css"; // 기존 상세페이지 CSS 재사용
import Content from "../../components/Title/ContentComp";
import dayjs from "dayjs";
import BoardContent from "./boardComponent/BoardContent";

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
            {/* 왼쪽: 작성자 */}
            <div className={styles.infoLeft}>
              <span className={styles.author}>작성자 : {board.member?.id || "알 수 없음"}</span>
            </div>

            {/* 오른쪽: 날짜(위) + 수치(아래) */}
            <div className={styles.infoRight}>
              <div className={styles.dateRow}>
                {dayjs().format("YYYY-MM-DD HH:mm:ss")}
              </div>
              <div className={styles.statsRow}>
                <span>조회수 {board.bhit}</span>
                <span className={styles.divider}>|</span>
                <span style={{color:'#facc15'}}>추천 0</span>
                <span className={styles.divider}>|</span>
                <span style={{color:'#ff7a8a'}}>비추천 0</span>
              </div>
            </div>
          </div>
        </div>

        {/* 핵심: dangerouslySetInnerHTML와 contentBox 클래스 적용 */}
        <BoardContent content={board.bcontent} />
        
        <div style={{ textAlign: 'center', color: '#71717a', marginTop: '50px' }}>
          --- 미리보기 모드에서는 댓글과 버튼이 비활성화됩니다 ---
        </div>
      </div>
    </Content>
  );
}

export default BoardPreview;