import React, { useRef,useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SaveBtn, MoveBtn } from "../../components/button/Button";
import { getBoardDetailApi, BoardUpdateApi } from "./BoardApi";
// CSS Module import
import { SaveInput } from "../../components/input/Input";
import styles from "./BoardWrite.module.css"; 
import Content from "../../components/Title/ContentComp";
import TiptapEditor from "../../components/CkEditor/TiptapEditor";

function BoardUpdate() {
  const { bno } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const formRef = useRef();
  // 에디터 내용을 담을 상태값
  const [editorData, setEditorData] = useState("");

  const getBoard = async () => {
    getBoardDetailApi({ bno })
    .then((res) => {
      if (res.data.success) {
        setBoard(res.data.board);
        setEditorData(res.data.board.bcontent);
      }
    });
  };

  useEffect(() => {
    getBoard();
  }, []);

  const handleUpdate = async () => {
    if (window.confirm("작성하신 내용을 수정하시겠습니까?")) {
      const formData = new FormData(formRef.current);
      formData.append("bno", bno);
      // 에디터에서 작성한 내용을 bcontent라는 이름으로 추가
      formData.append("bcontent", editorData);

      BoardUpdateApi(formData).then((res) => {
        if (res.data.success) {
          alert("수정되었습니다.");
          navigate("/BoardView/"+bno);
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
      bdate: new Date().toLocaleDateString(),
      member: { id: "작성자(미리보기)" },
      bhit: 0
    };
    // 로컬 스토리지에 임시 저장
    localStorage.setItem("board_preview", JSON.stringify(previewData));
    
    // 새 창 열기 (Route는 아래 2번 단계에서 설정)
    window.open("/BoardPreview", "_blank", "width=1100,height=900,scrollbars=yes");
  }

  return (
    <Content TitleName="Board Update">
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.required}>*</span>
              제목
            </label>
            <SaveInput 
              type="text" 
              name="btitle"
              style={{width:"100%"}}
              className={styles.inputField} 
              placeholder="제목을 입력하세요"
              defaultValue={board?.btitle || ""}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.required}>*</span>
              내용
            </label>
            {board ? (
              <TiptapEditor
                style={{color:"black"}}
                content={board?.bcontent || ""}
                onChange={(data) => setEditorData(data)} 
              />
              ) : (
              <div>로딩 중...</div>
            )}
          </div>

          <div className={styles.btnWrapper}>
            {/* 미리보기 버튼 */}
            <MoveBtn type="button" color="purple" onClick={handlePreview}>
              미리보기
            </MoveBtn>
            <SaveBtn 
              type="button" 
              className={styles.saveButton}
              onClick={handleUpdate}
            >
              수정하기
            </SaveBtn>
          </div>
        </form>
      </div>
    </div>
    </Content>
  );
}

export default BoardUpdate;
