import axiosInstance from "../../api/axiosInstance";
//임시 test
export const IdolViewVoteApi = (auditionId, idolProfileId) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/idolProfile/idolViewVote`,{
    params: {auditionId: auditionId, idolProfileId: idolProfileId}
  });
}

// 개인프로필 api
export const getIdolProfileApi = (idolProfileId) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/idolProfile/getIdolProfile`,{
    params: {idolProfileId: idolProfileId}
  });
}