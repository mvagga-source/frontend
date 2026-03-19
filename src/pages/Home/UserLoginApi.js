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
export const checkIdApi = (id) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/auth/checkId?id=${id}`);
};

// 닉네임 중복확인
export const checkNicknameApi = (nickname) => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/auth/checkNickname?nickname=${nickname}`);
};

// 회원가입
export const userSignupApi = (formData) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/signup`, formData);
};