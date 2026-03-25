import axiosInstance from "./axiosInstance";

// 아이돌 목록 조회 (status=active 인 참가자만)
export const getIdolsApi = (auditionId) => {
    return axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/audition/idols`,
        { params: { auditionId } }
    );
};

// 실시간 랭킹 조회
export const getRankingApi = (auditionId) => {
    return axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/audition/ranking`,
        { params: { auditionId } }
    );
};

// 오늘 투표 여부 확인
export const getVoteStatusApi = (auditionId) => {
    return axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/vote/status`,
        { params: { auditionId } }
    );
};

// 투표 제출
export const submitVoteApi = (auditionId, idolIds) => {
    return axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/vote`,
        { auditionId, idolIds }
    );
};