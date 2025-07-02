import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import '../styles/Registrants.css';

export default function EventRegistrants() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [eventTitle, setEventTitle] = useState("");

  useEffect(() => {
    API.get(`/registrations/event/${eventId}`)
      .then((res) => {
        setRegistrations(res.data || []);
        if (res.data?.length > 0) {
          setEventTitle(res.data[0].eventTitle || 'Unknown Event');
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching registrants:", err);
        setRegistrations([]);
      });
  }, [eventId]);

  return (
    <div className="registrants-container">
      <h2 className="registrants-title">👥 Registrants for: <span>{eventTitle || `Event ID ${eventId}`}</span></h2>

      {registrations.length === 0 ? (
        <p className="no-registrants-msg">No users have registered for this event yet.</p>
      ) : (
        <ul className="registrants-list">
          {registrations.map((r, idx) => (
            <li key={idx} className="registrant-item">
              👤 <strong>{r.userName}</strong> — 📧 {r.userEmail} — 🏷️ {r.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
