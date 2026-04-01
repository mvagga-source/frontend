import axiosInstance from "./axiosInstance";

// 아이돌 목록 조회 (status=active 인 참가자만)
export const getIdolsApi = (auditionId) => {
    return axiosInstance.get(`/audition/idols`, { params: { auditionId } });
};

// 전체 참가자 조회 (탈락자 포함, IdolRanking용)
export const getAllIdolsApi = (auditionId) =>
    axiosInstance.get(`/audition/allIdols`, { params: { auditionId } });

// IdolList용 — 전체 참가자 최신 회차 status 포함
export const getAllIdolsLatestApi = () =>
    axiosInstance.get(`/audition/allIdolsLatest`);

// 실시간 랭킹 조회
export const getRankingApi = (auditionId) => {
    return axiosInstance.get(`/audition/ranking`, { params: { auditionId } });
};

// 오늘 투표 여부 확인
export const getVoteStatusApi = (auditionId) => {
    return axiosInstance.get(`/vote/status`, { params: { auditionId } });
};

// 투표 제출
export const submitVoteApi = (auditionId, idolIds) => {
    return axiosInstance.post(`/vote`, { auditionId, idolIds });
};

// 회차 목록 조회 (ended + ongoing)
export const getAuditionListApi = () =>
    axiosInstance.get(`/audition/list`);
 
// 팀경연 결과 조회
export const getMatchesApi = (auditionId) =>
    axiosInstance.get(`/audition/matches`, { params: { auditionId } });

// 오늘 투표한 아이돌 ID 목록 조회
export const getVotedIdolsApi = (auditionId) =>
    axiosInstance.get(`/vote/today`, { params: { auditionId } });