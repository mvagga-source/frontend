import React, { useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { NeonBtn } from "../../components/button/Button";
import { BoardWriteApi } from "./BoardApi";
// CSS Module import
import { SearchInput } from "../../components/input/Input";
import { SearchSelect } from "../../components/SelectBox/SelectBox";
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

  return (
    <Content TitleName="Community Board Write">
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label className={styles.label}>제목</label>
            <SearchInput 
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
            <NeonBtn 
              type="button" 
              className={styles.saveButton}
              onClick={handleSave}
            >
              저장하기
            </NeonBtn>
          </div>
        </form>
      </div>
    </div>
    </Content>
  );
}

export default BoardWrite;