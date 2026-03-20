import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkIdApi, checkNicknameApi, userSignupApi } from "./UserLoginApi";
import "./UserSignUp.css";

/* 유효성 검사 함수 */
const validateId    = (v) => /^[a-z0-9]{4,20}$/.test(v);
const validatePw    = (v) => v.length >= 8;
const validateNick  = (v) => v.length >= 2 && v.length <= 12;
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const pwStrength = (v) => {
  let score = 0;
  if (v.length >= 8)                                    score++;
  if (/[a-zA-Z]/.test(v) && /[0-9]/.test(v))          score++;
  if (/[^a-zA-Z0-9]/.test(v))                          score++;
  return score;
};

const TERMS = [
  { label: "이용약관 동의",           required: true  },
  { label: "개인정보 처리방침 동의",   required: true  },
  { label: "마케팅 정보 수신 동의",    required: false },
];

export default function UserSignup() {
  const navigate = useNavigate();

  /* 입력값 */
  const [id,    setId]    = useState("");
  const [pw,    setPw]    = useState("");
  const [pw2,   setPw2]   = useState("");
  const [nick,  setNick]  = useState("");
  const [email, setEmail] = useState("");

  /* pw 보기 */
  const [showPw,  setShowPw]  = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  /* 중복확인 상태 */
  const [idOk,   setIdOk]   = useState(false);
  const [nickOk, setNickOk] = useState(false);

  /* 인라인 메시지 */
  const [idMsg,    setIdMsg]    = useState({ text: "4~20자 영문 소문자, 숫자 사용 가능", type: "info" });
  const [pwMsg,    setPwMsg]    = useState({ text: "8자 이상, 영문+숫자+특수문자 조합",  type: "info" });
  const [pw2Msg,   setPw2Msg]   = useState({ text: "",     type: ""        });
  const [nickMsg,  setNickMsg]  = useState({ text: "2~12자, 한글·영문·숫자 사용 가능",  type: "info" });
  const [emailMsg, setEmailMsg] = useState({ text: "",     type: ""        });

  /* 약관 */
  const [terms, setTerms] = useState([false, false, false]);

  const formRef = useRef(null);

  /* 가입하기 버튼 활성 조건 */
  const canSubmit =
    idOk && nickOk &&
    validatePw(pw) && pw === pw2 &&
    validateEmail(email) &&
    terms[0] && terms[1];

  /* ── 핸들러 ── */
  const handleIdChange = (v) => {
    setId(v); setIdOk(false);
    if (!v)              setIdMsg({ text: "4~20자 영문 소문자, 숫자 사용 가능", type: "info" });
    else if (!validateId(v)) setIdMsg({ text: "4~20자 영문 소문자, 숫자만 사용 가능해요", type: "error" });
    else                 setIdMsg({ text: "중복확인을 해주세요", type: "info" });
  };

  const handleCheckId = async (e) => {
    if (!validateId(id)) { setIdMsg({ text: "올바른 형식의 아이디를 입력해주세요", type: "error" }); return; }
    try {
      e.preventDefault();
      const formData = new FormData(formRef.current);
      const param = Object.fromEntries(formData.entries());
      const res = await checkIdApi(param);
      if (res.data.success) {
        setIdOk(true);
        setIdMsg({ text: "사용 가능한 아이디예요", type: "success" });
      }else{
        setIdOk(false);
        setIdMsg({ text: "이미 사용 중인 아이디이에요", type: "error" });
      }
    } catch {
      setIdOk(false);
      setIdMsg({ text: "이미 사용 중인 아이디예요", type: "error" });
    }
  };

  const handlePwChange = (v) => {
    setPw(v);
    const s = pwStrength(v);
    if (!v)    setPwMsg({ text: "8자 이상, 영문+숫자+특수문자 조합", type: "info" });
    else if (s < 2) setPwMsg({ text: "비밀번호가 너무 약해요", type: "error" });
    else if (s === 2) setPwMsg({ text: "특수문자를 추가하면 더 안전해요", type: "info" });
    else       setPwMsg({ text: "안전한 비밀번호예요", type: "success" });
    // pw2 재검사
    if (pw2) {
      setPw2Msg(v === pw2
        ? { text: "비밀번호가 일치해요", type: "success" }
        : { text: "비밀번호가 일치하지 않아요", type: "error" });
    }
  };

  const handlePw2Change = (v) => {
    setPw2(v);
    if (!v)     setPw2Msg({ text: "", type: "" });
    else if (pw === v) setPw2Msg({ text: "비밀번호가 일치해요", type: "success" });
    else        setPw2Msg({ text: "비밀번호가 일치하지 않아요", type: "error" });
  };

  const handleNickChange = (v) => {
    setNick(v); setNickOk(false);
    if (!v)               setNickMsg({ text: "2~12자, 한글·영문·숫자 사용 가능", type: "info" });
    else if (!validateNick(v)) setNickMsg({ text: "2~12자로 입력해주세요", type: "error" });
    else                  setNickMsg({ text: "중복확인을 해주세요", type: "info" });
  };

  const handleCheckNick = async (e) => {
    if (!validateNick(nick)) { setNickMsg({ text: "2~12자로 입력해주세요", type: "error" }); return; }
    try {
      e.preventDefault();
      const formData = new FormData(formRef.current);
      const param = Object.fromEntries(formData.entries());
      const res = await checkNicknameApi(param);
      if (res.data.success) {
        setNickOk(true);
        setNickMsg({ text: "사용 가능한 닉네임이에요", type: "success" });
      }else{
        setNickOk(false);
        setNickMsg({ text: "이미 사용 중인 닉네임이에요", type: "error" });
      }
    } catch {
      setNickOk(false);
      setNickMsg({ text: "이미 사용 중인 닉네임이에요", type: "error" });
    }
  };

  const handleEmailChange = (v) => {
    setEmail(v);
    if (!v)                setEmailMsg({ text: "", type: "" });
    else if (!validateEmail(v)) setEmailMsg({ text: "올바른 이메일 형식이 아니에요", type: "error" });
    else                   setEmailMsg({ text: "올바른 이메일 형식이에요", type: "success" });
  };

  const toggleTerm = (i) => {
    setTerms((prev) => prev.map((v, idx) => idx === i ? !v : v));
  };
  const toggleAll = () => {
    const allOn = terms.every((t) => t);
    setTerms([!allOn, !allOn, !allOn]);
  };

  const handleSignup = async (e) => {
    if (!canSubmit) return;
    try {
      e.preventDefault();
      const mDto = {
        id: id,
        pw: pw,
        nickname: nick,
        email: email
      };
      const res = await userSignupApi(pw2, mDto);
      if (res.data.success) {
        alert("회원가입이 완료됐어요! 로그인해주세요.");
        navigate("/UserLogin");
      }
    } catch {
      alert("회원가입 중 오류가 발생했어요. 다시 시도해주세요.");
    }
  };

  const strength = pwStrength(pw);

  return (
    <div className="us-wrap">
      <div className="us-card">

        {/* 로고 */}
        <div className="us-logo">
          <p className="us-logo-text">ACTION</p>
          <p className="us-logo-sub">AUDITION PLATFORM</p>
        </div>

        <h2 className="us-title">회원가입</h2>
        <form ref={formRef}>
        {/* 아이디 */}
        <div className="us-field">
          <label className="us-label">아이디 <span className="us-req">*</span></label>
          <div className="us-row">
            <input
              className={`us-input${!id ? "" : idOk ? " success" : !validateId(id) ? " error" : ""}`}
              type="text"
              placeholder="4~20자 영문, 숫자"
              value={id}
              onChange={(e) => handleIdChange(e.target.value)}
              name="id"
            />
            <button
              type="button"
              className={`us-check-btn${idOk ? " ok" : ""}`}
              onClick={handleCheckId}
            >
              중복확인
            </button>
          </div>
          <p className={`us-msg ${idMsg.type}`}>{idMsg.text}</p>
        </div>

        {/* 비밀번호 */}
        <div className="us-field">
          <label className="us-label">비밀번호 <span className="us-req">*</span></label>
          <div className="us-pw-wrap">
            <input
              className={`us-input${!pw ? "" : strength >= 2 ? " success" : " error"}`}
              type={showPw ? "text" : "password"}
              placeholder="8자 이상, 영문+숫자+특수문자"
              value={pw}
              onChange={(e) => handlePwChange(e.target.value)}
              name="pw"
            />
            <button className="us-pw-toggle" type="button" onClick={() => setShowPw((v) => !v)}>
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
          {/* 강도 바 */}
          <div className="us-pw-strength">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`us-pw-bar${pw && strength > i
                  ? strength === 1 ? " weak" : strength === 2 ? " mid" : " strong"
                  : ""}`}
              />
            ))}
          </div>
          <p className={`us-msg ${pwMsg.type}`}>{pwMsg.text}</p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="us-field">
          <label className="us-label">비밀번호 확인 <span className="us-req">*</span></label>
          <div className="us-pw-wrap">
            <input
              className={`us-input${!pw2 ? "" : pw === pw2 ? " success" : " error"}`}
              type={showPw2 ? "text" : "password"}
              placeholder="비밀번호를 다시 입력하세요"
              value={pw2}
              onChange={(e) => handlePw2Change(e.target.value)}
              name="pw2"
            />
            <button className="us-pw-toggle" type="button" onClick={() => setShowPw2((v) => !v)}>
              {showPw2 ? "🙈" : "👁"}
            </button>
          </div>
          <p className={`us-msg ${pw2Msg.type}`}>{pw2Msg.text}</p>
        </div>

        {/* 닉네임 */}
        <div className="us-field">
          <label className="us-label">닉네임 <span className="us-req">*</span></label>
          <div className="us-row">
            <input
              className={`us-input${!nick ? "" : nickOk ? " success" : !validateNick(nick) ? " error" : ""}`}
              type="text"
              placeholder="2~12자"
              value={nick}
              onChange={(e) => handleNickChange(e.target.value)}
              name="nickname"
            />
            <button
              type="button"
              className={`us-check-btn${nickOk ? " ok" : ""}`}
              onClick={handleCheckNick}
            >
              중복확인
            </button>
          </div>
          <p className={`us-msg ${nickMsg.type}`}>{nickMsg.text}</p>
        </div>

        {/* 이메일 */}
        <div className="us-field">
          <label className="us-label">이메일 <span className="us-req">*</span></label>
          <input
            className={`us-input${!email ? "" : validateEmail(email) ? " success" : " error"}`}
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            name="email"
          />
          <p className={`us-msg ${emailMsg.type}`}>{emailMsg.text}</p>
        </div>

        {/* 약관 */}
        <div className="us-terms-box">
          {/* 전체 동의 */}
          <div className="us-term-row us-term-all" onClick={toggleAll}>
            <div className={`us-chk${terms.every((t) => t) ? " on" : ""}`}>
              {terms.every((t) => t) && "✓"}
            </div>
            <span className="us-term-label-all">전체 동의</span>
          </div>
          <div className="us-terms-divider" />
          {/* 개별 약관 */}
          {TERMS.map((term, i) => (
            <div key={i} className="us-term-row" onClick={() => toggleTerm(i)}>
              <div className={`us-chk${terms[i] ? " on" : ""}`}>
                {terms[i] && "✓"}
              </div>
              <span className="us-term-label">
                {term.label}
                {term.required
                  ? <span className="us-term-req">필수</span>
                  : <span className="us-term-opt">선택</span>
                }
              </span>
              <span className="us-term-link">보기</span>
            </div>
          ))}
        </div>
        </form>

        <button
          className="us-btn"
          onClick={handleSignup}
          disabled={!canSubmit}
        >
          가입하기
        </button>

        <div className="us-divider">
          <span className="us-divider-line" />
          <span className="us-divider-text">또는</span>
          <span className="us-divider-line" />
        </div>

        <p className="us-link-row">
          이미 계정이 있으신가요?{" "}
          <Link to="/UserLogin" className="us-link">로그인</Link>
        </p>

      </div>
    </div>
  );
}