import React, { useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { SaveBtn, MoveBtn } from "../../components/button/Button";
import { BoardWriteApi } from "./BoardApi";
// CSS Module import
import { SaveInput } from "../../components/input/Input";
import styles from "./BoardWrite.module.css"; 
import Content from "../../components/Title/ContentComp";
import TiptapEditor from "../../components/CkEditor/TiptapEditor";

function BoardWrite() {
  const navigate = useNavigate();
  const formRef = useRef();
  // 에디터 내용을 담을 상태값
  const [editorData, setEditorData] = useState("");

  const handleSave = async () => {
    if (window.confirm("작성하신 내용을 저장하시겠습니까?")) {
      const formData = new FormData(formRef.current);

      // 에디터에서 작성한 내용을 bcontent라는 이름으로 추가
      formData.append("bcontent", editorData);

      BoardWriteApi(formData).then((res) => {
        if (res.data.success) {
          alert("저장되었습니다.");
          navigate("/BoardList");
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
    <Content TitleName="Community Board Write">
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label className={styles.label}>제목</label>
            <SaveInput 
              type="text" 
              name="btitle"
              style={{width:"100%"}}
              className={styles.inputField} 
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>내용</label>
            {/* <textarea 
              name="bcontent"
              className={styles.textAreaField} 
              placeholder="내용을 입력하세요"
            ></textarea> */}
            <TiptapEditor
            style={{color:"black"}}
            onChange={(data) => setEditorData(data)} 
            />
          </div>

          <div className={styles.btnWrapper}>
            {/* 미리보기 버튼 */}
            <MoveBtn type="button" color="purple" onClick={handlePreview}>
              미리보기
            </MoveBtn>
            <SaveBtn 
              type="button" 
              className={styles.saveButton}
              onClick={handleSave}
            >
              저장하기
            </SaveBtn>
          </div>
        </form>
      </div>
    </div>
    </Content>
  );
}

export default BoardWrite;
