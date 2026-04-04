import axiosInstance from "../../api/axiosInstance";

// Video 전체 가져오기
export const getVideoPageApi = (searchParams={}) => {
  return axiosInstance.get("/video/getVideoPage", {
    params:{
      ...searchParams
    }
  });
}

// Video 한건 가져오기
export const getVideoApi = (pageId) => {
  return axiosInstance.get("/video/getVideo", {
    params:{
      pageId:pageId
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

export const saveVideoApi = (form) => {
  return axiosInstance.post("/video/saveVideo", form);
}

export const deleteVideosApi = (selectedIds) => {
  return axiosInstance.delete("/video/deleteVideo",
    {
      data:{ids: selectedIds}
    });
}

// Video 전체 가져오기
export const getIdolStatusApi = (searchParams={}) => {
  return axiosInstance.get("/video/getIdolStatus", );
}