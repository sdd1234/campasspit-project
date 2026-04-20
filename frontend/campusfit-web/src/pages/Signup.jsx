import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    serviceAgree: false,
    privacyAgree: false,
    marketingAgree: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!form.serviceAgree || !form.privacyAgree) {
      setError("필수 약관에 동의해주세요.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        email: form.email,
        password: form.password,
        name: form.name,
        serviceAgree: form.serviceAgree,
        privacyAgree: form.privacyAgree,
        marketingAgree: form.marketingAgree,
      });
      setSuccess("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "회원가입 실패: 입력 정보를 확인하세요.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Campus Fit</h1>
        <h2>회원가입</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@campus.ac.kr"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              maxLength={20}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">비밀번호 (8자 이상)</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={handleChange}
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="field-check">
            <label>
              <input
                type="checkbox"
                name="serviceAgree"
                checked={form.serviceAgree}
                onChange={handleChange}
                required
              />
              서비스 이용약관 동의 (필수)
            </label>
          </div>

          <div className="field-check">
            <label>
              <input
                type="checkbox"
                name="privacyAgree"
                checked={form.privacyAgree}
                onChange={handleChange}
                required
              />
              개인정보 처리방침 동의 (필수)
            </label>
          </div>

          <div className="field-check">
            <label>
              <input
                type="checkbox"
                name="marketingAgree"
                checked={form.marketingAgree}
                onChange={handleChange}
              />
              마케팅 수신 동의 (선택)
            </label>
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="auth-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
