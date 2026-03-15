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