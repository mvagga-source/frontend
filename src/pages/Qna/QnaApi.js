import axiosInstance from "../../api/axiosInstance";

// QNA 목록 가져오기
export const getQnaListApi = (lastQno = 0) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/qna/list`, {
    params: {lastQno: lastQno }
  });
};

//QNA 상세보기
export const getQnaViewApi = (qno) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/qna/view`,{
    params: { qno: qno }
  });
}


//QNA 쓰기
export const QnaWriteApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/qna/save`,param);
}

//QNA 수정
export const QnaUpdateApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/qna/update`,param);
}


//QNA 삭제
export const QnaDeleteApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/qna/delete`,param);
}
