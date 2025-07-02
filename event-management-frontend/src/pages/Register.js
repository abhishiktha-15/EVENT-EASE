import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Register.css';
import registerBg from '../assets/Register.png'; // ✅ Your background image

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/register', { ...form, role: 'USER' });
      setMessage('✅ Registration successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      setMessage('❌ Registration failed');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <motion.div
        className="glass-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        {message && (
          <p
            style={{
              textAlign: 'center',
              color: message.startsWith('✅') ? 'green' : 'red',
              marginBottom: '15px',
            }}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="register-form">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
          <button type="submit">Register</button>
        </form>
      </motion.div>
    </div>
  );
}
