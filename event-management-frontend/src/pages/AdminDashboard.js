import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = () => {
    API.get('/events')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('Failed to fetch events:', err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await API.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert("Failed to delete");
        console.error("❌ DELETE error:", err);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="header-row">
        <h2>🎯 Admin Panel - Manage Events</h2>
        <Link to="/create">
          <button className="create-btn">+ Create Event</button>
        </Link>
      </div>

      <div className="event-list">
        {events.map((event) => (
          <motion.div
            key={event.id}
            className="event-card"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{event.title}</h3>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p>{event.description}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>

            <div className="action-buttons">
              <button onClick={() => navigate(`/edit/${event.id}`)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(event.id)} className="delete-btn">Delete</button>
              + <Link to={`/registrants/${event.id}`}>
                <button className="view-btn">View Registrants</button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
