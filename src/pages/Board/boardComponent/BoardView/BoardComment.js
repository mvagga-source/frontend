import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BoardComment.module.css";
import { CancelBtn, SaveBtn } from "../../../../components/button/Button";
import { getCommentListApi, CommentWriteApi, CommentUpdateApi, CommentDeleteApi } from "../../BoardApi";
import { useAuth } from "../../../../context/AuthContext";
import BoardCommentSaveForm from "./BoardComment/BoardCommentSaveForm";
import dayjs from "dayjs";
import { useToast } from "../../../../context/ToastMsg/ToastContext";

function BoardComment({ bno }) {
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [comments, setComments] = useState([]);    //수정예정
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 답글 관련 상태
  const [editingCno, setEditingCno] = useState(null); // 수정 중인 댓글 번호
  const [editContent, setEditContent] = useState(""); // 수정 중인 내용
  const [replyingTo, setReplyingTo] = useState(null); // 답글 대상 번호cno
  const [replyContent, setReplyContent] = useState(""); // 답글 내용

  const [lastGroup, setLastGroup] = useState(0);      //마지막 번호
  const [totalCount, setTotalCount] = useState(0);    //댓글 삭제와 답글을 제외한 전체개수
  
  // 추가 상태: 더 가져올 데이터가 있는지 여부와 로딩 상태
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 1. 처음 마운트될 때 리스트 가져오기
  useEffect(() => {
    if (bno) {
      getList(0, false); // 처음 로드이므로 lastCno는 0, append는 false
      
      // 이전 글에서 작성 중이던 상태값들 초기화
      setEditingCno(null);
      setReplyingTo(null);
      setReplyContent("");
    }
  }, [bno]);

  // 댓글 리스트 가져오기 (처음 로드나 저장 후 새로 불러오기)
  const getList = async (lastCno = 0, append = true) => {
    setLoading(true);
    getCommentListApi(bno, 10, lastCno)
    .then((res) => {
      if (res.data?.success) {
        const newComments = res.data.list || [];
        const totalCount = res.data.totalCount || 0; // 댓글 전체 개수
        const serverLastGroup = res.data.lastGroup || 0; // 다음 기준 그룹
        const isLastPage = res.data.isLast; // 마지막 페이지 여부

        if (append) {
          setComments((prev) => [...prev, ...newComments]);
        } else {
          setComments(newComments);
        }

        // 2. 서버에서 받은 다음 그룹 번호와 마지막 여부 저장
        setLastGroup(serverLastGroup);
        setHasMore(!isLastPage);
        
        // (선택사항) 전체 개수 상태 업데이트
        setTotalCount(totalCount);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  // 더보기 클릭
  const handleMore = () => {
    if (loading || !hasMore) return;
    //const lastCno = comments.length > 0 ? comments[comments.length - 1].cno : 0;
    getList(lastGroup, true);
  };


  // 답글 저장 핸들러
  const handleReplySave = async (parentComment) => {
    if (!replyContent.trim()) return alert("내용을 입력하세요.");

    const formData = new URLSearchParams();
    formData.append("bno", bno);
    formData.append("ccontent", replyContent);
    // 계층형 데이터 전송 (부모의 정보를 기반으로 생성)
    formData.append("cgroup", parentComment.cgroup);
    formData.append("cstep", parentComment.cstep);
    formData.append("cindent", parentComment.cindent);

    CommentWriteApi(formData)
    .then((res) => {
      if (res.data?.success) {
        showToast("게시판 답글이 성공적으로 등록되었습니다.");
        setReplyingTo(null);
        setReplyContent("");
        const newReply = res.data.comment;

        if (newReply) {
          setComments((prev) => {
            // 새 답글이 들어갈 위치 찾기: 
            // 같은 그룹(cgroup) 내에서 본인보다 cstep이 큰 첫 번째 댓글의 인덱스를 찾기
            const targetIndex = prev.findIndex(
              (c) => c.cgroup === newReply.cgroup && c.cstep > parentComment.cstep
            );

            if (targetIndex === -1) {
              // 만약 본인이 그룹의 마지막이라면, 같은 그룹의 끝에 붙임
              const lastIndexInGroup = [...prev].reverse().findIndex(c => c.cgroup === newReply.cgroup);
              const actualIndex = lastIndexInGroup !== -1 ? prev.length - lastIndexInGroup : prev.length;
              
              const newArr = [...prev];
              newArr.splice(actualIndex, 0, newReply);
              return newArr;
            } else {
              // 중간에 끼워넣기
              const newArr = [...prev];
              newArr.splice(targetIndex, 0, newReply);
              return newArr;
            }
          });
        }
        //getList(0, false); // 새로고침
      }
    });
  };

  // 수정 저장
  const handleUpdate = async (cno) => {
    const formData = new URLSearchParams();
    formData.append("cno", cno);
    formData.append("ccontent", editContent);
    CommentUpdateApi(formData)
    .then((res) => {
      if (res.data?.success) {
        //alert("수정되었습니다.");
        showToast("게시판 댓글이 성공적으로 수정되었습니다.");
        setEditingCno(null); // 수정 모드 종료
        //더보기 방식은 길어질 경우 사용자 불편이 있을 수 있어서
        const updatedComment = res.data.comment;
        setComments((prev) =>
          prev.map((c) => (c.cno === cno ? { ...c, ...updatedComment } : c))
        );
        //getList(0, false);   // 목록 새로고침
      }
    });
  };

  // 삭제 요청 (Soft Delete: delyn를 'y'로 변경하도록 서버에 요청)
  const handleDelete = async (cno) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const formData = new URLSearchParams();
    formData.append("cno", cno);
    CommentDeleteApi(formData)
    .then((res) => {
      if (res.data?.success) {
        //alert("삭제되었습니다.");
        showToast("게시판 댓글이 삭제되었습니다.");
        //더보기 방식은 길어질 경우 사용자 불편이 있을 수 있어서
        setComments((prev) =>
          prev.map((c) => (c.cno === cno ? { ...c, delYn: 'y' } : c))
        );
        //getList(0, false);   // 목록 새로고침(적용해도 됨)
      }
    });
  };

  // 신고 페이지로 이동하는 함수
  const handleReport = (comment) => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/UserLogin", { state: { from: window.location.pathname } });
      return;
    }
    
    // 현재 페이지의 전체 경로 (예: /Community/BoardView/123)
    const currentUrl = window.location.pathname;
    
    // 신고 페이지로 이동하면서 대상 정보와 복귀 URL을 쿼리로 전달
    const params = new URLSearchParams();
    params.append("targetUrl", currentUrl);
    //params.append("targetType", "comment");
    params.append("targetIdName", "cno");
    params.append("targetId", comment.cno);
    params.append("author", comment.member?.nickname || "");

    navigate(`/Community/ReportWrite?${params.toString()}`);
  };


  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentTitle}>전체댓글 {totalCount}개</h3>
      
      {/* 댓글 작성창 */}
      <BoardCommentSaveForm bno={bno} getList={getList} />

      {/* 댓글 리스트 */}
      <ul className={styles.commentList}>
        {comments.map((c) => (
          <li key={c.cno} 
              className={`${styles.commentItem} ${c.cindent > 0 ? styles.replyItem : ""}`}
              style={{ marginLeft: `${c.cindent * 20}px` }} // 들여쓰기 적용
          >
            {/* 1. 관리자에 의한 신고 삭제 처리 (최우선) */}
            {c.reportYn === 'y' ? (
              <div className={styles.deletedWrapper}>
                <p className={styles.deletedText}>
                  🚨 운영 정책 위반으로 관리자에 의해 블라인드 처리된 댓글입니다.
                </p>
              </div>
            ) : 
            /* 2. 사용자에 의한 일반 삭제 처리 */
            c.delYn === 'y' ? (
              <div className={styles.deletedWrapper}>
                <p className={styles.deletedText}>삭제된 댓글입니다.</p>
              </div>
            ) : (
              <>
                {/* 1. 작성자 정보 */}
                <div className={styles.commentInfo}>
                  <span className={styles.commentAuthor}>{c.member?.nickname}</span>
                  <span className={styles.commentDate}>{dayjs(c.cdate).format("YYYY-MM-DD HH:mm:ss")}</span>
                </div>

                {/* 2. 내용 또는 수정창 */}
                {editingCno === c.cno ? (
                  <div className={styles.replyInputBox}>
                    <textarea 
                      value={editContent} 
                      onChange={(e) => setEditContent(e.target.value)} 
                      placeholder="댓글을 수정하세요."
                    />
                    <div className={styles.replyBtns}>
                      <CancelBtn size="xsm" square={true} bold={false} onClick={() => setEditingCno(null)}>취소</CancelBtn>
                      <SaveBtn size="xsm" square={true} bold={false} onClick={() => handleUpdate(c.cno)}>저장</SaveBtn>
                    </div>
                  </div>
                ) : (
                  <p className={styles.commentContent}>{c.ccontent}</p>
                )}

                {/* 3. 하단 액션 버튼 */}
                <div className={styles.commentFooter}>
                  <div className={styles.leftActions}>
                  <button className={styles.footerBtn} onClick={() => setReplyingTo(c.cno)}>답글</button>
                  {user && user.id === c.member?.id && (
                    <>
                      <button className={styles.footerBtn} onClick={() => {setEditingCno(c.cno);
                        setEditContent(c.ccontent);
                      }}>수정</button>
                      <button className={styles.footerBtn} onClick={() => handleDelete(c.cno)}>삭제</button>
                    </>
                  )}
                  </div>
                  {/* 신고 버튼을 오른쪽 끝으로 분리 */}
                  {user?.id !== c.member?.id && (
                    <button 
                      className={`${styles.footerBtn} ${styles.reportBtn}`} 
                      onClick={() => handleReport(c)}
                    >
                      신고
                    </button>
                  )}
                </div>
              </>
            )}

            {/* 답글 입력창 (답글 버튼 클릭 시 해당 댓글 아래에만 표시) */}
            {replyingTo === c.cno && (
              <div className={styles.replyInputBox}>
                <textarea 
                  value={replyContent} 
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 남겨보세요"
                />
                <div className={styles.replyBtns}>
                  <CancelBtn size="xsm" square={true} bold={false} onClick={() => setReplyingTo(null)}>취소</CancelBtn>
                  <SaveBtn size="xsm" square={true} bold={false} onClick={() => handleReplySave(c)}>저장</SaveBtn>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div 
          className={`${styles.moreBtnBar} ${loading ? styles.loading : ""}`} 
          onClick={handleMore}
        >
          {loading ? (
            <>
              <div className={styles.spinner}></div>
              <span className={styles.loadingText}>LOADING...</span>
            </>
          ) : (
            "더보기"
          )}
        </div>
      )}
    </div>
  );
}

export default BoardComment;