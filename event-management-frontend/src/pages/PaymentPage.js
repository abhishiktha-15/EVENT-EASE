// File: src/pages/PaymentPage.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

export default function PaymentPage() {
  const { registrationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => openRazorpay();
      script.onerror = () => alert('Razorpay SDK failed to load');
      document.body.appendChild(script);
    };

    const openRazorpay = async () => {
      try {
        const res = await API.post(`/payment/razorpay/order/${registrationId}`);
        const { amount, currency, orderId, userName, userEmail } = res.data;

        const options = {
          key: 'rzp_test_YourTestKeyHere', // replace with your Razorpay test key
          amount,
          currency,
          name: 'EventEase',
          description: 'Event Ticket Booking',
          order_id: orderId,
          handler: async (response) => {
            try {
              await API.post(`/registrations/pay/${registrationId}`);
              alert('✅ Payment successful! Ticket sent to your email.');
              navigate('/my-events');
            } catch (err) {
              alert('❌ Payment succeeded but ticket confirmation failed.');
            }
          },
          prefill: {
            name: userName,
            email: userEmail,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error('❌ Razorpay order creation failed:', err);
        alert('Failed to initiate payment.');
      }
    };

    loadRazorpayScript();
  }, [registrationId, navigate]);

  return <div>🔄 Processing your payment...</div>;
}
