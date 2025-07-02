import React, { useState } from 'react';
import API from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';
import loginBg from '../assets/Login.png';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/login', form);
      if (res.data) {
        setMessage('✅ Login successful!');
        localStorage.setItem("user", JSON.stringify(res.data));
        setTimeout(() => {
          navigate(res.data.role === "ADMIN" ? "/admin" : from);
        }, 1000);
      } else {
        setMessage('❌ Invalid email or password');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Login failed');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="glass-box"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <h2 className="login-title">Login</h2>
        {message && (
          <p
            style={{
              textAlign: 'center',
              color: message.startsWith('✅') ? 'green' : 'red',
              margin: '10px 0',
            }}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
