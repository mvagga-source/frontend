
import axiosInstance from "../../api/axiosInstance";

// 전체 일정 가져오기
export const getEventsApi = () => {
  return axiosInstance.get("/schedule/getEvents",{});
}



