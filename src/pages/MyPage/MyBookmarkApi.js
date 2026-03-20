
import axiosInstance from "../../api/axiosInstance";

// 나의 북마크 정보 가져오기
export const getBookmarkPage = (page, pageSize) => {
  return axiosInstance.get("/mypage/getBookmarkPage", {
    params:{
      page,
      size: pageSize,
      sort: "id,desc",
    }
  });
}

// 나의 북마크 삭제
export const deleteBookmark = (id) => {
  return axiosInstance.delete(`/mypage/deleteBookmark/${id}`,);
}