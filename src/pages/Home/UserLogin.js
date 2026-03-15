import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { userLoginApi } from "./UserLoginApi";
import "./UserLogin.css";

function UserLogin() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async () => {

    try {
      const res = await userLoginApi(id,pw);  
      login(res.data);

      navigate("/");
    } catch (error) {
      alert("아이디 또는 비밀번호가 불일치 합니다.")
    }

  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <input type="text" onChange={(e)=>setId(e.target.value)} placeholder="아이디" />
        <input type="password" onChange={(e)=>setPw(e.target.value)} placeholder="비밀번호" />

        <button onClick={handleLogin}>로그인</button>
      </div>
    </div>
  );
}

export default UserLogin;