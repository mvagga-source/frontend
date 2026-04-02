   
   export function convertYoutube(url){
        const id = url.split("v=")[1];
        return `https://www.youtube.com/embed/${id}`;
    }

    export function getYoutubeThumbnail(url){
        const id = url.split("v=")[1];
        return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }

    export const statusText = {
        "1": "오디션 통과",
        "0": "오디션 탈락"
    };

    export const sorts = [
        { value: "LATEST", label: "최신순" },
        { value: "LIKE", label: "좋아요순" },
        { value: "VIEW", label: "조회순" },
        { value: "POPULAR", label: "인기순" }
    ];    

    export const searchTypes = [
        { value: "ALL", label: "전체" },
        { value: "NAME", label: "이름" },
        { value: "TITLE", label: "제목" },
    ];        