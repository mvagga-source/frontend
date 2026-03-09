import { useNavigate  } from "react-router";
import axios from 'axios';
import { SaveBtn } from "../../components/button/Button";

function UserLogin() {
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
        
      const formData = new FormData(e.currentTarget);

      try {
        const response = await axios.post("/auth/login", formData);

        if (response.data.success) {
          navigate("/");
        }
      } catch (err) {
        console.error("Login Error", err);
        alert(err.message);
      }
    };

  return (
    <div>
      <form onSubmit={handleLogin}>
      <input placeholder="아이디를 입력하세요" name="memberId" />
      <input placeholder="비밀번호를 입력하세요" name="pw" type="password" />
      <SaveBtn type="submit">Login</SaveBtn>
      </form>
    </div>
  );
}

export default UserLogin;