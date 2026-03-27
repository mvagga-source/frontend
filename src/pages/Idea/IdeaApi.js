import axiosInstance from "../../api/axiosInstance";

// 아이디어 목록 가져오기
export const getIdeaListApi = (lastIdeano = 0) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/idea/list`, {
    params: {lastIdeano: lastIdeano }
  });
};

// 아이디어 등록
export const IdeaWriteApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/idea/save`,param);
}
