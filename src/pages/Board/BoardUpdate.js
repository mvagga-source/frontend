import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoardDetailApi, BoardUpdateApi } from "./BoardApi";
import styles from "./BoardWrite.module.css"; 
import TiptapEditor from "../../components/CkEditor/TiptapEditor";
import dayjs from "dayjs";

function BoardUpdate() {
  const { bno } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const formRef = useRef();
  const [editorData, setEditorData] = useState("");

  const getBoard = async () => {
    getBoardDetailApi({ bno })
    .then((res) => {
      if (res.data.success) {
        setBoard(res.data.board);
        // 에디터에서 작성한 내용을 bcontent라는 이름으로 추가
        setEditorData(res.data.board.bcontent);
      }
    });
  };

  useEffect(() => {
    getBoard();
  }, []);

  const handleUpdate = async () => {
    if (!editorData.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (window.confirm("작성하신 내용을 수정하시겠습니까?")) {
      const formData = new FormData(formRef.current);
      formData.append("bno", bno);
      formData.append("bcontent", editorData);

      BoardUpdateApi(formData).then((res) => {
        if (res.data.success) {
          alert("수정되었습니다.");
          navigate("/Community/BoardView/" + bno);
        }
      });
    }
  };

  // [추가] 미리보기 함수
  const handlePreview = () => {
    const formData = new FormData(formRef.current);
    const previewData = {
      btitle: formData.get("btitle") || "제목 없음",
      bcontent: editorData,
      bdate: board?.bdate || dayjs().format("YYYY-MM-DD HH:mm:ss"),
      member: { id: board?.member?.id || "작성자" },
      bhit: board?.bhit || 0
    };
    // 로컬 스토리지에 임시 저장
    localStorage.setItem("board_preview", JSON.stringify(previewData));
    // 새 창 열기
    window.open("/Community/BoardPreview", "_blank", "width=1500,height=1000,scrollbars=yes");
  };

  if (!board) return <div style={{color: "white", padding: "20px"}}>데이터를 불러오는 중입니다...</div>;

  return (
    <div className={styles.boardWriteContainer}>
      <div className={styles.contentWrapper}>
        {/* 좌측: 타이틀 + 수정 폼 섹션 */}
        <div className={styles.formSection}>
          <h2 className={styles.pageTitle}>게시글 수정</h2> {/* 타이틀 클래스명을 pageTitle로 통일 */}
          
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.required}>*</span> 제목
              </label>
              <input 
                type="text" 
                name="btitle"
                className={styles.inputField} 
                placeholder="제목을 입력하세요"
                defaultValue={board?.btitle || ""}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.required}>*</span> 내용
              </label>
              <div className={styles.editorWrapper}>
                <TiptapEditor
                  content={board?.bcontent || ""}
                  onChange={(data) => setEditorData(data)} 
                />
              </div>
            </div>
          </form>
        </div>

        {/* 우측: 사이드바 (가이드 + 버튼) */}
        <div className={styles.sideSection}>
          <div className={styles.guideBox}>
            <h3>게시글 수정 가이드</h3>
            <p>내용을 수정할 때 아래 사항을 확인해 주세요.</p>
            <ul>
              <li>✔ 수정 후에도 커뮤니티 운영 수칙이 적용됩니다.</li>
              <li>✔ 부적절한 제목으로 수정 시 제재될 수 있습니다.</li>
              <li>✔ 저작권에 위배되는 자료 공유는 금지됩니다.</li>
              <li>✔ [미리보기]를 통해 최종 결과물을 체크하세요.</li>
            </ul>
          </div>

          <div className={styles.btnWrapper}>
            <button type="button" className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleUpdate}>
              수정완료
            </button>
            <div className={styles.subBtnRow}>
              <button type="button" className={`${styles.actionBtn} ${styles.previewBtn}`} onClick={handlePreview}>
                미리보기
              </button>
              <button type="button" className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={() => navigate(-1)}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardUpdate;