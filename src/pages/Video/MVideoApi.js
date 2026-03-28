import axiosInstance from "../../api/axiosInstance";

// Video 전체 가져오기
export const getVideosApi = (page, pageSize, sortType,search, searchType, deletedFlag) => {
  return axiosInstance.get("/video/getVideos", {
    params:{
      page : page,
      size: pageSize,
      sortType :sortType, 
      search : search,
      searchType : searchType,
      deletedFlag : deletedFlag
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

  // console.log("saveVideoApi : ",form);
  return axiosInstance.post("/video/saveVideo", form);
}

export const deleteVideosApi = (selectedIds) => {
  return axiosInstance.delete("/video/deleteVideo",
    {
      data:{ids: selectedIds}
    });
}
