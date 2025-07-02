import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Home.css';
import bgImage from '../assets/Home.png';

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleExploreClick = () => {
    if (user) {
      navigate('/events');
    } else {
      navigate('/login', { state: { from: '/events' } });
    }
  };

  return (
    <div
  className="home-container"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>

      <div className="home-hero">
        <motion.div
          className="home-card glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="main-heading"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Welcome to <span className="highlight">EventEase</span>
          </motion.h1>

          <motion.p
            className="sub-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Your all-in-one event booking experience.
          </motion.p>

          <motion.button
            className="explore-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExploreClick}
          >
            Explore Events
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}