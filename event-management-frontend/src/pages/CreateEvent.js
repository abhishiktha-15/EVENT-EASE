import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateEvent.css';

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    price: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ POST event details to backend
      await API.post('/events', {
        ...form,
        price: parseInt(form.price) // ensure it's sent as number
      });

      setMessage('✅ Event created successfully!');
      setTimeout(() => navigate('/admin'), 1000);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to create event.');
    }
  };

  return (
    <div className="create-container">
      <h2>Create New Event</h2>
      {message && (
        <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="create-form">
        <input
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
