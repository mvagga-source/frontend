import axiosInstance from "../../api/axiosInstance";

// Video 전체 가져오기
export const getVideosApi = (page, pageSize, sortType) => {
  return axiosInstance.get("/video/getVideos", {
    params:{
      page : page,
      size: pageSize,
      sortType :sortType 
    }
  });
}

// Video My like 가져오기
export const getMyLikesApi = (memberId) => {
  return axiosInstance.get("/video/getMyLikes", {
    params:{
      memberId:memberId
    }
  });
}

export const toggleVideoLikeApi = (memberId, videoId) => {
  return axiosInstance.post("/video/toggleVideoLike", {
    memberId,
    videoId
  });
}

export const videoViewCountApi = (videoId) => {
  return axiosInstance.post("/video/videoViewCount", {
    videoId
  });
}
