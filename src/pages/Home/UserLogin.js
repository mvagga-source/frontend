import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../api/userApi";

function UserLogin() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const res = await userLogin(
      username,
      password
    );

    login(res.data);

    navigate("/");
  };

  return (
    <div>
      <input onChange={e => setUsername(e.target.value)} placeholder="아이디" />
      <input type="password" onChange={e => setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default UserLogin;