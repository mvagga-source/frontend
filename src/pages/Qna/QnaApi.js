import axiosInstance from "../../api/axiosInstance";

// QNA 목록 가져오기
export const getQnaListApi = (page = 1, size = 10, searchParams = {}) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/qna/list`, {
    params: { page, size, ...searchParams }
  });
}; 