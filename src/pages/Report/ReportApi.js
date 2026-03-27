import axiosInstance from "../../api/axiosInstance";

// 신고 목록 가져오기
export const getReportListApi = (lastRepono = 0) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/report/list`, {
    params: {lastRepono: lastRepono }
  });
};

// 신고 등록
export const ReportWriteApi = (param) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/report/save`,param);
}
