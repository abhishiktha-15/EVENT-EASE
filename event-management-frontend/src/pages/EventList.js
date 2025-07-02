// EventList.js
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import '../styles/EventList.css';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events');
      setEvents(res.data);
    } catch {
      setMessage('❌ Failed to load events');
    }
  };

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await API.get(`/registrations/user/${userId}`);
      setRegistrations(res.data);
    } catch {
      setMessage('❌ Failed to load your registrations');
    }
  }, [userId]);

  useEffect(() => {
    fetchEvents();
    if (userId) fetchRegistrations();
  }, [userId, fetchRegistrations]);

  const handleBook = async (eventId) => {
    if (!userId) {
      navigate('/login', { state: { from: `/events` } });
      return;
    }
    try {
      await API.post(`/registrations/${userId}/${eventId}`);
      setMessage('✅ Event booked!');
      fetchRegistrations();
    } catch (err) {
      setMessage(err.response?.data || '❌ Booking failed');
    }
  };

  const handleCancel = async (registrationId) => {
    try {
      await API.delete(`/registrations/${registrationId}`);
      setMessage('✅ Registration cancelled.');
      fetchRegistrations();
    } catch {
      setMessage('❌ Could not cancel registration.');
    }
  };

  const handlePayment = async (registrationId) => {
    try {
      const res = await API.post(`/payment/create-order/${registrationId}`);
      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        order_id: res.data.orderId,
        name: 'EventEase',
        description: 'Event Booking Payment',
        handler: async (response) => {
          await API.post(`/payment/verify/${registrationId}`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          alert('✅ Payment successful!');
          fetchRegistrations();
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#3399cc' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('❌ Payment initiation failed');
      console.error(err);
    }
  };

  const getRegistration = (eventId) => {
    return registrations.find(r => r.event.id === eventId);
  };

  const getEventImage = (title) => {
    const base64 = localStorage.getItem(`image-${title}`);
    return base64 || '/images/default.jpg';
  };

  return (
    <div className="event-wrapper">
      <h2 className="section-title">🌟 Explore Events</h2>
      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="grid-container">
        {events.map(event => {
          const reg = getRegistration(event.id);
          const bgImage = getEventImage(event.title);

          return (
            <motion.div
              key={event.id}
              className="event-card-modern"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="event-content">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                <p><strong>Price:</strong> ₹{event.price}</p>

                {reg ? (
                  reg.status === 'PAID' ? (
                    <div className="badge-paid">🎟️ Paid</div>
                  ) : (
                    <div className="btn-group">
                      <button onClick={() => handlePayment(reg.id)} className="btn-pay">Pay</button>
                      <button onClick={() => handleCancel(reg.id)} className="btn-cancel">Cancel</button>
                    </div>
                  )
                ) : (
                  <button onClick={() => handleBook(event.id)} className="btn-book">
                    {userId ? 'Book' : '🔐 Login to Book'}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
