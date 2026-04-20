import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, resetPassword } from "../api/auth";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [resetForm, setResetForm] = useState({
    email: "",
    newPassword: "",
    confirm: "",
  });
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      const data = res.data?.data ?? res.data;
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "로그인 실패: 이메일 또는 비밀번호를 확인하세요.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChange = (e) => {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (resetForm.newPassword.length < 8) {
      setResetError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (resetForm.newPassword !== resetForm.confirm) {
      setResetError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(resetForm.email, resetForm.newPassword);
      setResetSuccess("비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.");
      setResetForm({ email: "", newPassword: "", confirm: "" });
      setTimeout(() => setShowReset(false), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "비밀번호 재설정에 실패했습니다. 이메일을 확인하세요.";
      setResetError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Campus Fit</h1>
        <h2>로그인</h2>

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
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="auth-link">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
        <p className="auth-link">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setShowReset(true);
              setResetError("");
              setResetSuccess("");
            }}
          >
            비밀번호 재설정
          </button>
        </p>
      </div>

      {showReset && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
            padding: "24px",
          }}
          onClick={() => setShowReset(false)}
        >
          <div
            className="auth-card"
            style={{ maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 style={{ fontSize: "1.3rem" }}>비밀번호 재설정</h1>
            <h2>등록된 이메일과 새 비밀번호를 입력하세요.</h2>
            <form onSubmit={handleResetSubmit}>
              <div className="field">
                <label htmlFor="reset-email">이메일</label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  value={resetForm.email}
                  onChange={handleResetChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="reset-password">새 비밀번호</label>
                <input
                  id="reset-password"
                  name="newPassword"
                  type="password"
                  value={resetForm.newPassword}
                  onChange={handleResetChange}
                  minLength={8}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="reset-confirm">새 비밀번호 확인</label>
                <input
                  id="reset-confirm"
                  name="confirm"
                  type="password"
                  value={resetForm.confirm}
                  onChange={handleResetChange}
                  minLength={8}
                  required
                />
              </div>

              {resetError && <p className="error">{resetError}</p>}
              {resetSuccess && <p className="success">{resetSuccess}</p>}

              <button
                type="submit"
                className="btn-primary"
                disabled={resetLoading}
              >
                {resetLoading ? "변경 중..." : "비밀번호 변경"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: 8, width: "100%" }}
                onClick={() => setShowReset(false)}
              >
                취소
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
