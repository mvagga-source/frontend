import axiosInstance from "../../api/axiosInstance";

// 1. 초기 데이터 조회 (URL: /api/notification/init/{memberId})
export const getInitApi = (memberId) => {
    return axiosInstance.get(`${process.env.REACT_APP_API_URL}/notification/init/${memberId}`);
};

// 2. SSE 구독 URL 반환 (EventSource는 axios를 쓰지 않음)
export const getSubscribeUrl = (memberId) => {
    return `${process.env.REACT_APP_API_URL}/notification/subscribe/${memberId}`;
};

// 3. 더보기 (URL: /api/notification/more/{memberId}?lastId=123)
export const getMoreApi = (memberId, lastId) => {
    return axiosInstance.get(`${process.env.REACT_APP_API_URL}/notification/more/${memberId}`, {
        params: { lastId }
    });
};

// 4. 개별 읽음 처리 (URL: /api/notification/read/{notino})
// PatchMapping이므로 patch 사용
export const getReadApi = (notino) => {
    return axiosInstance.patch(`${process.env.REACT_APP_API_URL}/notification/read/${notino}`);
};

// 5. 전체 읽음 처리
export const getReadAllApi = (memberId) => {
    return axiosInstance.patch(`${process.env.REACT_APP_API_URL}/notification/read-all/${memberId}`);
};

// 6. 알림 저장 및 실시간 전송 (URL: /api/notification/send)
export const postSendApi = (notificationData) => {
    // notificationData 예시: { memberId, nocontent, type, url }
    return axiosInstance.post(`${process.env.REACT_APP_API_URL}/notification/send`, notificationData);
};