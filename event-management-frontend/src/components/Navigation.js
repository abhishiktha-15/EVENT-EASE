import { Link } from 'react-router-dom';
import '../styles/Navigation.css'; // ✅ Add this import for styling

export default function Navigation() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="nav-container">
      <div className="nav-brand">🎟️ EventEase</div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>

        {!user && (
          <>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        )}

        {user && (
          <Link to="/my-events" className="nav-link">My Events</Link>
        )}

        {role === "ADMIN" && (
          <>
            <Link to="/create" className="nav-link">Create Event</Link>
            <Link to="/admin" className="nav-link">Admin Panel</Link>
          </>
        )}

        {user && (
          <>
            <span className="nav-user">👤 {user.name} ({user.role})</span>
            <button onClick={handleLogout} className="nav-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
