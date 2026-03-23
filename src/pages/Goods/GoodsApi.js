import axiosInstance from "../../api/axiosInstance";

// 목록 가져오기
export const getGoodsListApi = (page = 1, size = 10, searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goods/list`, {
    params: { page, size, ...searchParams }
  });
};

//상세조회
export const getGoodsViewApi = (searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goods/view`, {
    params: { ...searchParams }
  });
};

//상세
export const getGoodsDetailApi = (searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goods/detail`, {
    params: { ...searchParams }
  });
};

//쓰기
export const GoodsWriteApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goods/save`,param);
}

//수정
export const GoodsUpdateApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goods/update`,param);
}

//삭제
export const GoodsDeleteApi = (param = {}) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goods/delete`, param);
}

//굿즈 도움되요
export const GoodsLikeSaveApi = (param = {}) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodslike/save`, param);
};

// 굿즈 리뷰 댓글 목록 가져오기 (더보기/무한스크롤용)
export const getCommentListApi = (bno, size = 10, lastCno = 0) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goodsReview/list`, {
    params: { bno, size, lastCno }
  });
};

// 굿즈 리뷰 댓글 등록하기
export const CommentWriteApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReview/save`, commentData);
};

// 굿즈 리뷰 댓글 수정하기
export const CommentUpdateApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReview/update`, commentData);
};

// 굿즈 리뷰 댓글 삭제하기
export const CommentDeleteApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReview/delete`, commentData);
};