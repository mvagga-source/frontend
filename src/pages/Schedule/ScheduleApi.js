
import axiosInstance from "../../api/axiosInstance";

// 전체 일정 가져오기
export const getEventsApi = (deletedFlag) => {
  return axiosInstance.get("/schedule/getEvents",{
    params:{
      deletedFlag: deletedFlag
    }
  });
}

// 일정 저장
export const saveEventApi = (form) => {
  return axiosInstance.post("/schedule/saveEvent", form);
}

// 일정 삭제
export const deleteEventApi = (selectedIds) => {
  return axiosInstance.delete("/schedule/deleteEvent",
    {
      data:{ids: selectedIds}
    });
}

