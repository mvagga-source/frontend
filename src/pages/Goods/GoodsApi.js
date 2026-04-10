import axiosInstance from "../../api/axiosInstance";

// 목록 가져오기
export const getGoodsListApi = (page = 1, size = 10, searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goods/list`, {
    params: { page, size, ...searchParams }
  });
};

// 배너 목록 가져오기
export const getGoodsBannerListApi = (page = 1, size = 10, searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goods/bannerList`, {
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
export const GoodsReviewLikeSaveApi = (param = {}) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReviewLike/save`, param);
};

// 굿즈 리뷰 댓글 목록 가져오기 (더보기/무한스크롤용)
export const getReviewListApi = (gno, size = 10, lastCno = 0, sortDir = "DESC", lastLikeCnt, lastRating) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goodsReview/list`, {
    params: { gno, size, lastCno, sortDir, lastLikeCnt, lastRating }
  });
};

//굿즈리뷰상세
export const getGoodsReviewDetailApi = (gono) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goodsReview/detail`, {
    params: { gono:gono }
  });
};

// 굿즈 리뷰 댓글 등록하기
export const ReviewWriteApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReview/save`, commentData);
};

// 굿즈 리뷰 댓글 수정하기
export const ReviewUpdateApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReview/update`, commentData); 
};

// 굿즈 리뷰 댓글 삭제하기
export const ReviewDeleteApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReview/delete`, commentData);
};

// 굿즈 리뷰 답글 등록하기
export const ReviewReplyApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReview/reply`, commentData);
};

// 카카오 페이 결제준비
export const GoodsOrderApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsOrders/ready`, commentData);
};

// 주문 상세 조회
export const getOrderDetailApi = (gono) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goodsOrders/detail`, {
    params: { gono: gono }
  });
};

//카카오페이 결제 후 결제취소처리
export const GoodsOrderCancelApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsOrders/cancel`, commentData);
};

//반품처리
export const GoodsReturnApi = (commentData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsReturn/save`, commentData);
};

//반품리스트
export const getGoodsReturnListApi = (params) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/goodsReturn/list`, {
    params: params
  });
};

// 반품 신청 취소 (삭제)
export const GoodsReturnDeleteApi = (rno) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/goodsReturn/delete/${rno}`);
};