
import axiosInstance from "../../api/axiosInstance";

// 전체 일정 가져오기
export const getEventApi = () => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/Calendar/getEvent`,{});
}

// 나의 북마크 아이디 정보 가져오기
export const getMyBookmarkApi = (userId) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/Calendar/getMyBookmark`,{userId});
}

// 나의 북마크 설정 또는 취소
export const toggleBookmarkApi = (eno,userId,pageType) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/Calendar/toggleBookmark`,{eno:eno,userId:userId,pageType,pageType});
}

