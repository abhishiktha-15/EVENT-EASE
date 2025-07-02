import React from 'react';
import { motion } from 'framer-motion';
import '../styles/EventCard.css';

export default function EventCard({ event }) {
  return (
    <motion.div className="card" whileHover={{ scale: 1.03 }}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
    </motion.div>
  );
}
