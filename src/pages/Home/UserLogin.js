import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userLoginApi } from "./UserLoginApi";
import "./UserLogin.css";

export default function UserLogin() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const location = useLocation();
  const state = location.state;

  const [id,      setId]      = useState("");
  const [pw,      setPw]      = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [errMsg,  setErrMsg]  = useState("");

  const handleLogin = async () => {
    setErrMsg("");
    if (!id.trim() || !pw) {
      setErrMsg("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    try {
      const res = await userLoginApi(id.trim(), pw);
      login(res.data);
      navigate(state?.from || "/");
    } catch {
      setErrMsg("아이디 또는 비밀번호가 일치하지 않아요.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="ul-wrap">
      <div className="ul-card">

        {/* 로고 */}
        <div className="ul-logo">
          <p className="ul-logo-text">ACTION</p>
          <p className="ul-logo-sub">AUDITION PLATFORM</p>
        </div>

        <h2 className="ul-title">로그인</h2>

        {/* 에러 박스 */}
        {errMsg && (
          <div className="ul-error-box">{errMsg}</div>
        )}

        {/* 아이디 */}
        <div className="ul-field">
          <label className="ul-label">아이디</label>
          <input
            className="ul-input"
            type="text"
            placeholder="아이디를 입력하세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 비밀번호 */}
        <div className="ul-field">
          <label className="ul-label">비밀번호</label>
          <div className="ul-pw-wrap">
            <input
              className="ul-input"
              type={showPw ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ul-pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              type="button"
              aria-label="비밀번호 보기"
            >
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <button className="ul-btn" onClick={handleLogin}>
          로그인
        </button>

        <div className="ul-divider">
          <span className="ul-divider-line" />
          <span className="ul-divider-text">또는</span>
          <span className="ul-divider-line" />
        </div>

        <p className="ul-link-row">
          아직 계정이 없으신가요?{" "}
          <Link to="/UserSignUp" className="ul-link">회원가입</Link>
        </p>

      </div>
    </div>
  );
}