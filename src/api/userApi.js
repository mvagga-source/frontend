import axiosInstance from "./axiosInstance";

export const userLogin = (id,pw) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/login`,{id,pw});
}

export const userLogout = () => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
}

export const userSession = () => {
  return axiosInstance.get(`${process.env.REACT_APP_API_URL}/auth/userSession`);
}





// export const addUsers = (formData) => {
//   return axiosInstance.post(`${process.env.REACT_APP_API_URL}/member/mwrite`,formData);
// }

// 사용자 목록 조회
// export const getUsers = () => {
//   return axiosInstance.get(`${process.env.REACT_APP_API_URL}/member/mlist`);
// };

// POST /users
// export const addUser = (user) => axiosInstance.post("/users", user);

// PUT /users/:id
// export const updateUser = (id, user) => axiosInstance.put(`/users/${id}`, user);

// DELETE /users/:id
// export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);