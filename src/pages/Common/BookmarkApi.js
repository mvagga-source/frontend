import axiosInstance from "../../api/axiosInstance";

// 나의 북마크 정보 가져오기 (get방식 - react : params 사용, spring : requestBody 사용불가)
export const getMyBookmarkApi = (memberId,pageType) => {

    //console.log("getMyBookmarkApi params : ",memberId,pageType);

    return axiosInstance.get("bookmark/getMyBookmark",{
            params:{
                memberId: memberId,
                pageType: pageType,    
            }
    });
}

// 북마크 토글 (post방식 - react : params 사용불가, spring : requestBody 사용가능)
export const toggleBookmarkApi = (memberId,pageId,pageType) => {

    //console.log("toggleBookmarkApi params : ",memberId,pageId,pageType);

    return axiosInstance.post(`bookmark/toggleBookmark`,{
            memberId,
            pageId,
            pageType,    
    });
}

// 나의 북마크 페이지별 정보 가져오기
export const getBookmarkPageApi = (page, pageSize) => {
  return axiosInstance.get("/mypage/getBookmarkPage", {
    params:{
      page,
      size: pageSize,
      sort: "id,desc",
    }
  });
}

// 북마크 전체 가져오기
export const getBookmarksApi = () => {
  return axiosInstance.get("/mypage/getBookmarks", {
    // params:{
    // }
  });
}


// 나의 북마크 삭제
export const deleteBookmarkApi = (id) => {
  return axiosInstance.delete(`/mypage/deleteBookmark/${id}`,);
}

