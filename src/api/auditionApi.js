import axiosInstance from "./axiosInstance";

// 아이돌 목록 조회 (status=active 인 참가자만)
export const getIdolsApi = (auditionId) => {
    return axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/audition/idols`,
        { params: { auditionId } }
    );
};