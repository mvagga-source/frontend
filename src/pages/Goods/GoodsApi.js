import axiosInstance from "../../api/axiosInstance";

// 게시글 목록 가져오기
export const getGoodsListApi = (page = 1, size = 10, searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goods/blist`, {
    params: { page, size, ...searchParams }
  });
};

//게시글 상세조회
export const getGoodsViewApi = (searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goods/view`, {
    params: { ...searchParams }
  });
};

//게시글 상세(조회수X)
export const getGoodsDetailApi = (searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goods/detail`, {
    params: { ...searchParams }
  });
};

//게시글쓰기
export const GoodsWriteApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goods/save`,param);
}

//게시글수정
export const GoodsUpdateApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goods/update`,param);
}

//게시글삭제
export const GoodsDeleteApi = (param = {}) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goods/delete`, param);
}

//게시글 추천,비추천
export const GoodsLikeSaveApi = (param = {}) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodslike/save`, param);
};

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

// 댓글 수정하기 (필요시 추가)
export const CommentUpdateApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/comment/update`, commentData);
};

// 댓글 삭제하기 (필요시 추가)
export const CommentDeleteApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/comment/delete`, commentData);
};