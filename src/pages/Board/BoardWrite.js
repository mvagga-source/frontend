import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BoardWriteApi } from "./BoardApi";
import styles from "./BoardWrite.module.css"; 
import TiptapEditor from "../../components/CkEditor/TiptapEditor";
import { SaveInput } from "../../components/input/Input";
import dayjs from "dayjs";

function BoardWrite() {
  const navigate = useNavigate();
  const formRef = useRef();
  const [editorData, setEditorData] = useState("");

  const handleSave = async () => {
    if (!editorData.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (window.confirm("작성하신 내용을 저장하시겠습니까?")) {
      const formData = new FormData(formRef.current);
      formData.append("bcontent", editorData);

      BoardWriteApi(formData).then((res) => {
        if (res.data.success) {
          alert("저장되었습니다.");
          navigate("/Community/BoardList");
        }
      });
    }
  };

  // 미리보기 함수
  const handlePreview = () => {
    const formData = new FormData(formRef.current);
    const previewData = {
      btitle: formData.get("btitle") || "제목 없음",
      bcontent: editorData,
      bdate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      member: { id: "작성자(미리보기)" },
      bhit: 0
    };
    // 로컬 스토리지에 임시 저장
    localStorage.setItem("board_preview", JSON.stringify(previewData));
    // 새 창 열기
    window.open("/Community/BoardPreview", "_blank", "width=1500,height=1000,scrollbars=yes");
  };

  return (
    <div className={styles.boardWriteContainer}>
      <div className={styles.contentWrapper}> 
        {/* 좌측: 타이틀 + 입력 폼 섹션 */}
        <div className={styles.formSection}>
          <h2 className={styles.pageTitle}>게시글 작성</h2> {/* 타이틀을 섹션 안으로 이동 */}
          
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.required}>*</span> 제목
              </label>
              <SaveInput 
                type="text" 
                name="btitle"
                className={styles.inputField} 
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.required}>*</span> 내용
              </label>
              <div className={styles.editorWrapper}>
                <TiptapEditor
                  onChange={(data) => setEditorData(data)} 
                />
              </div>
            </div>
          </form>
        </div>

        {/* 우측: 사이드바 (가이드 + 버튼) */}
        <div className={styles.sideSection}>
          <div className={styles.guideBox}>
            <h3>게시글 작성 가이드</h3>
            <p>커뮤니티의 건강한 문화를 위해 아래 수칙을 준수해 주세요.</p>
            <ul>
              <li>✔ 비방, 욕설, 도배글은 자제해 주세요.</li>
              <li>✔ 부적절한 제목으로 작성 시 제재될 수 있습니다.</li>
              <li>✔ 저작권에 위배되는 자료 공유는 금지됩니다.</li>
              <li>✔ [미리보기]를 통해 최종 결과물을 체크하세요.</li>
            </ul>
          </div>

          <div className={styles.btnWrapper}>
            <button type="button" className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSave}>
              저장하기
            </button>
            <div className={styles.subBtnRow}>
              <button type="button" className={`${styles.actionBtn} ${styles.previewBtn}`} onClick={handlePreview}>
                미리보기
              </button>
              <button type="button" className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={() => navigate("/Community/BoardList")}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardWrite;