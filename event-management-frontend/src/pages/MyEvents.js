import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';
import '../styles/MyEvents.css';

export default function MyEvents() {
  const [myEvents, setMyEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await API.get(`/registrations/user/${userId}`);
      setMyEvents(res.data);
    } catch (error) {
      console.error('❌ Failed to load your events');
    }
  }, [userId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handlePayment = async (registrationId) => {
    try {
      const res = await API.post('/payment/create-order', {
        registrationId,
        amount: 50000 // ₹500 in paise
      });

      const options = {
        key: 'rzp_test_OyM0zqNQocrLZ7',
        amount: res.data.amount,
        currency: 'INR',
        order_id: res.data.id,
        name: 'EventEase',
        description: 'Event Booking Payment',
        handler: async (response) => {
          await API.post('/payment/verify', {
            registrationId,
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

  return (
    <div className="my-events-container">
      <h2 className="my-events-title">📅 My Booked Events</h2>
      {myEvents.length === 0 ? (
        <p>No events booked yet.</p>
      ) : (
        <div className="my-events-list">
          {myEvents.map((reg) => (
            <div key={reg.id} className="event-card">
              <h3>{reg.event.title}</h3>
              <p>{reg.event.description}</p>
              <p><strong>Venue:</strong> {reg.event.venue}</p>
              <p><strong>Date:</strong> {new Date(reg.event.date).toLocaleString()}</p>
              <p><strong>Status:</strong> {reg.status}</p>

              {reg.status === 'REGISTERED' && (
                <button onClick={() => handlePayment(reg.id)}>💳 Proceed to Pay</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
