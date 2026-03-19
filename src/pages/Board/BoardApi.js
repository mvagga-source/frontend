import axiosInstance from "../../api/axiosInstance";

// 게시글 목록 가져오기
export const getBoardListApi = (page = 1, size = 10, searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/board/blist`, {
    params: { page, size, ...searchParams }
  });
};

//게시글 상세조회
export const getBoardViewApi = (searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/board/bview`, {
    params: { ...searchParams }
  });
};

//게시글쓰기
export const BoardWriteApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/board/bwrite`,param);
}

// 댓글 목록 가져오기 (더보기/무한스크롤용)
export const getCommentListApi = (bno, size = 10, lastCno = 0) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/comment/list`, {
    params: { bno, size, lastCno }
  });
};

// 댓글 등록하기 (필요시 추가)
export const CommentWriteApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/comment/save`, commentData);
};