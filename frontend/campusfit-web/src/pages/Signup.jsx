import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    name: '',
    serviceAgree: false,
    privacyAgree: false,
    marketingAgree: false,
    verificationType: 'STUDENT_ID',
    note: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('email', formData.userId); // 아이디를 이메일로 사용
      data.append('password', formData.password);
      data.append('name', formData.name);
      data.append('serviceAgree', formData.serviceAgree);
      data.append('privacyAgree', formData.privacyAgree);
      data.append('marketingAgree', formData.marketingAgree);
      data.append('verificationType', formData.verificationType);
      data.append('note', formData.note);

      const response = await axios.post('http://localhost:8080/api/v1/auth/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('회원가입이 완료되었습니다!');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('회원가입 실패: 입력 정보를 확인하세요.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="verificationType">인증 유형</label>
          <select
            id="verificationType"
            name="verificationType"
            value={formData.verificationType}
            onChange={handleChange}
          >
            <option value="STUDENT_ID">학생증</option>
            <option value="FACULTY_ID">교직원증</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="note">추가 메모 (선택)</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="추가 메모를 입력하세요"
          />
        </div>

        <div className="agreement-container">
          <h3>개인정보 동의</h3>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="serviceAgree"
                checked={formData.serviceAgree}
                onChange={handleChange}
                required
              />
              서비스 이용약관에 동의합니다 (필수)
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="privacyAgree"
                checked={formData.privacyAgree}
                onChange={handleChange}
                required
              />
              개인정보 처리방침에 동의합니다 (필수)
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="marketingAgree"
                checked={formData.marketingAgree}
                onChange={handleChange}
              />
              마케팅 수신에 동의합니다 (선택)
            </label>
          </div>
        </div>

        <button type="submit">회원가입</button>
        <button type="button" onClick={() => navigate('/login')} style={{ marginTop: '10px', backgroundColor: '#6c757d' }}>
          로그인으로 돌아가기
        </button>
      </form>
    </div>
  );
}

export default Signup;