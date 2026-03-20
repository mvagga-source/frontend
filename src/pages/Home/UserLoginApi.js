import axiosInstance from "../../api/axiosInstance";

export const userLoginApi = (id,pw) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/login`,{id,pw});
}

export const userLogoutApi = () => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
}

export const userSessionApi = () => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/auth/userSession`);
}

// 아이디 중복확인
export const checkIdApi = (param={}) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/checkId`, param);
};

// 닉네임 중복확인
export const checkNicknameApi = (param={}) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/checkNickname`,param);
};

// 회원가입
export const userSignupApi = (pw2, formData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/signup?pw2=${encodeURIComponent(pw2)}`, formData);
};