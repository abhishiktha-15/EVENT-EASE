import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import EventList from './pages/EventList';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import EventRegistrants from './pages/EventRegistrants';
import AdminDashboard from './pages/AdminDashboard';
import EditEvent from './pages/EditEvent';
import RequireAuth from './components/RequireAuth';
import Navigation from './components/Navigation';
import { AnimatePresence } from 'framer-motion';
import PaymentPage from './pages/PaymentPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navigation />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Home Route */}
            <Route path="/" element={<Home />} />

            {/* Public Event Viewing */}
            <Route path="/events" element={<EventList />} />

            {/* Authenticated Routes */}
            <Route
              path="/my-events"
              element={
                <RequireAuth>
                  <MyEvents />
                </RequireAuth>
              }
            />

            {/* Admin Only Routes */}
            {JSON.parse(localStorage.getItem("user"))?.role === "ADMIN" && (
              <>
                <Route
                  path="/create"
                  element={
                    <RequireAuth>
                      <CreateEvent />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <AdminDashboard />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/edit/:eventId"
                  element={
                    <RequireAuth>
                      <EditEvent />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/registrants/:eventId"
                  element={
                    <RequireAuth>
                      <EventRegistrants />
                    </RequireAuth>
                  }
                />
                 <Route
  path="/pay/:registrationId"
  element={
    <RequireAuth>
      <PaymentPage />
    </RequireAuth>
  }
/>
              </>
            )}

            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
