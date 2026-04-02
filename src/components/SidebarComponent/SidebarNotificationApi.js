import axiosInstance from "../../api/axiosInstance";

// 1. 초기 데이터 조회 (URL: /api/notification/init/{memberId})
export const getInitApi = (memberId) => {
    return axiosInstance.get(`${process.env.REACT_APP_API_URL}/notification/init/${memberId}`);
};

// 2. 더보기 (URL: /api/notification/more/{memberId}?lastId=123)
export const getMoreApi = (memberId, lastId) => {
    return axiosInstance.get(`${process.env.REACT_APP_API_URL}/notification/more/${memberId}`, {
        params: { lastId }
    });
};

// 3. 개별 읽음 처리 (URL: /api/notification/read/{notino})
// PatchMapping이므로 patch 사용
export const getReadApi = (notino) => {
    return axiosInstance.patch(`${process.env.REACT_APP_API_URL}/notification/read/${notino}`);
};

// 4. 전체 읽음 처리
export const getReadAllApi = (memberId) => {
    return axiosInstance.patch(`${process.env.REACT_APP_API_URL}/notification/read-all/${memberId}`);
};

// 5. 알림 저장 및 실시간 전송 (URL: /api/notification/send)
export const postSendApi = (notificationData) => {
    // notificationData 예시: { memberId, nocontent, type, url }
    return axiosInstance.post(`${process.env.REACT_APP_API_URL}/notification/send`, notificationData);
};

// 6. 읽음처리
export const readBulkNotificationsApi = (notinoList) => {
    return axiosInstance.post(`${process.env.REACT_APP_API_URL}/notification/readbulk`, notinoList);
};

// 7. 개별 삭제
export const deleteNotificationApi = (notino) => {
    return axiosInstance.delete(`${process.env.REACT_APP_API_URL}/notification/delete/${notino}`);
};

// 8. 전체 삭제
export const deleteAllNotificationsApi = (memberId) => {
    return axiosInstance.delete(`${process.env.REACT_APP_API_URL}/notification/deleteall/${memberId}`);
};