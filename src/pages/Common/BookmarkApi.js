import axiosInstance from "../../api/axiosInstance";

// 북마크 토글 (post방식 - react : params 사용불가, spring : requestBody 사용가능)
export const toggleBookmarkApi = (memberId,pageId,pageType) => {

    //console.log("toggleBookmarkApi params : ",memberId,pageId,pageType);

    return axiosInstance.post(`bookmark/toggleBookmark`,{
            memberId,
            pageId,
            pageType,    
    });
}


