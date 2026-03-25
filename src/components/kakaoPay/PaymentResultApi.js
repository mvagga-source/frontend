import axiosInstance from "../../api/axiosInstance";

export const PaymentResultSuccessApi = ({ pg_token, tid }) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsOrders/approve?pg_token=${pg_token}&tid=${tid}`);
};

export const PaymentResultCancelApi = ({ pg_token, tid }) => {
  return axiosInstance.post(`${process.env.REACT_APP_API_URL}/goodsOrders/failCancel?pg_token=${pg_token}&tid=${tid}`);
};