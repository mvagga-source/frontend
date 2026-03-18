
import axiosInstance from "../../api/axiosInstance";

// 나의 북마크 정보 가져오기
export const getBookmarkPageApi = (page, pageSize) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/Mypage/getBookmarkPage?page=${page}&size=${pageSize}&sort=id,desc`,{});
}

// 나의 북마크 삭제
export const deleteMyBookmarkApi = (id) => {

  return axiosInstance.delete(`${process.env.REACT_APP_API_URL}/Mypage/deleteMyBookmark/${id}`,);
}