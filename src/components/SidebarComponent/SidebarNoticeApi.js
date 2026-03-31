import axiosInstance from "../../api/axiosInstance";

// 목록 가져오기
export const getMainListApi = (searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/notice/mainList`, {
    params: { ...searchParams }
  });
};