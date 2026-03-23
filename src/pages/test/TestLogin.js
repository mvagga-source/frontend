//import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate  } from "react-router";
import axios from 'axios';
import { TestBtn, CancelBtn } from "../../components/button/Button";

function TestLogin() {
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
      <TestBtn type="submit">Login</TestBtn>
      </form>
      <TestBtn type="button" onClick={undefined}>이벤트없게</TestBtn>
      <TestBtn type="button" onClick={()=>alert("저장입니다.")}>Test입니다.</TestBtn>
      <TestBtn type="button" Style="background-color: red" >저장입니다.</TestBtn>
      <TestBtn type="button" variant="danger"/>
      <CancelBtn onClick={()=>alert("취소입니다.")}/>
    </div>
  );
}

export default TestLogin;