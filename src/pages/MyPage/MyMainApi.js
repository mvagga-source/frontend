
import axiosInstance from "../../api/axiosInstance";

// 나의 북마크 페이지별 정보 가져오기
export const getBookmarkPageApi = (page, pageSize) => {
  return axiosInstance.get("/mypage/getBookmarkPage", {
    params:{
      page,
      size: pageSize,
      sort: "id,desc",
    }
  });
}

// 북마크 전체 가져오기
export const getBookmarksApi = () => {
  return axiosInstance.get("/mypage/getBookmarks", {
    // params:{
    // }
  });
}

// 나의 북마크 삭제
export const deleteBookmarkApi = (id) => {
  return axiosInstance.delete(`/mypage/deleteBookmark/${id}`,);
}

// 구매내역 (리스트 가져오기)
export const getMyOrderListApi = (page = 1, size = 10) => {
  return axiosInstance.get(`/goodsOrders/getMyOrderList`, {
    params: { page, size }
  });
};

// 투표관리 (리스트 가져오기)
export const getMyVotePageApi = (page = 1, size = 10, searchParams = {}) => {
  return axiosInstance.get(`/mypage/getMyVotePage`, {
    params: { page, size, ...searchParams }
  });
};

// 나의 투표 삭제
export const deleteMyVoteApi = (id) => {
  return axiosInstance.delete(`/mypage/deleteMyVote/${id}`,);
}
