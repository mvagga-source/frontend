import { useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function SupportSuccess() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pgToken = urlParams.get("pg_token");
    const tid = localStorage.getItem("tid");
    const supportId = localStorage.getItem("supportId");

    if (pgToken && tid) {
      // 서버의 approve 주소로 승인 요청 전송
      axiosInstance.get(`/support/pay/approve?pg_token=${pgToken}&tid=${tid}`)
        .then(() => {
          alert("후원이 완료되었습니다! 당신의 응원이 큰 힘이 됩니다.");
          window.location.href = `/support/${supportId}`; // 다시 프로젝트 페이지로
        })
        .catch(err => {
          console.error(err);
          alert("결제 승인 중 오류가 발생했습니다.");
        });
    }
  }, []);

  return <div>결제 승인 처리 중입니다...</div>;
}