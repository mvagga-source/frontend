import axios from "axios";

let logoutHandler = null;
let navigateFn = null;
export const setLogoutHandler = (fn) => {
  logoutHandler = fn;
};
export const setNavigate = (fn) => {
  navigateFn = fn;
};
//React + Spring 세션 로그인

// 기본 URL, 타임아웃 등 설정
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Spring Boot 기본 API URL
  withCredentials:true //브라우저가 쿠키(세션) 자동 전송
});

// 요청 인터셉터 (예: 토큰 자동 첨부)
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token"); // 예시: 토큰 저장
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터 (예: 공통 에러 처리)
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === false) {
      if(response.data.code === "401") {    //App.js에 AuthProvider
        if (logoutHandler) {
          logoutHandler(); // AuthContext의 logout 실행됨
          //window.location.href = "/UserLogin";
          // 원래 있던 페이지 경로를 state에 담아서 이동
          navigateFn("/UserLogin", { state: { from: window.location.pathname } });
        }
      }
      alert(response.data.message);    //유효성체크 BaCdException에러들 alert띄우기
    }
    return response;
  },
  error => {
    console.error("API 에러 발생:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      //navigate("/UserLogin");
      const url = error.config?.url || "";
      // vote/status는 비로그인 허용 → 리다이렉트 제외
      if (!url.includes("/vote/status")) {
          window.location.href = "/UserLogin";
      } if (logoutHandler) {
        logoutHandler(); // AuthContext의 logout 실행됨
        window.location.href = "/UserLogin";
      }
    } else if (!error.response || error.response?.status === 500) {
      // 서버 오류
      //navigate("/500");
      //window.location.href = "/500";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;