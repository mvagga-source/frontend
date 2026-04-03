
import axiosInstance from "../../api/axiosInstance";



// 페이지별 나의 북마크 (리스트 가져오기)
export const getMyPageBookmarskApi = (searchParams = {}) => {

    return axiosInstance.get("mypage/getMyPageBookmarks",{
            params:{
                ...searchParams                
            }
    });
}

// 나의북마크 (리스트 가져오기)
export const getMyBookmarkPageApi = (searchParams = {}) => {

    return axiosInstance.get("mypage/getMyBookmarkPage",{
            params:{
                ...searchParams
            }
    });
}

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

// 나의 북마크 삭제
export const deleteBookmarkApi = (id) => {
  return axiosInstance.delete(`/mypage/deleteBookmark/${id}`,);
}

// 구매내역 (리스트 가져오기)
export const getMyOrderPageApi = (searchParams={}) => {
  return axiosInstance.get(`/mypage/getMyOrderPage`, {
    params: { ...searchParams }
  });
};

// 판매내역 (리스트 가져오기)
export const getMySalePageApi = (searchParams={}) => {
  return axiosInstance.get(`/mypage/getMySalePage`, {
    params: { ...searchParams }
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
