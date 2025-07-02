import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/EditEvent.css';

export default function EditEvent() {
  const { eventId } = useParams();
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    price: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/events/${eventId}`)
      .then((res) => {
        const data = res.data;
        const formattedDate = new Date(data.date).toISOString().slice(0, 16);
        setForm({ ...data, date: formattedDate });
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
      });
  }, [eventId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/events/${eventId}`, {
        ...form,
        date: form.date
      });

      navigate('/admin');
    } catch (err) {
      alert("❌ Failed to update event");
      console.error(err);
    }
  };

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <input
          name="title"
          placeholder="Title"
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
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}
