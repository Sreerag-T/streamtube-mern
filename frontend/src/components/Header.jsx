import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Header = ({ onToggleSidebar, onSearch }) => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          &#9776;
        </button>
        <Link to="/" className="brand">
          <span className="brand-mark">ST</span>
          <span className="brand-text">StreamTube</span>
        </Link>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn" type="submit" aria-label="Search">
            &#128269;
          </button>
        </form>
      </div>

      <div className="header-right">
        {!user ? (
          <Link to="/login" className="signin-btn">
            <span>&#128100;</span> Sign in
          </Link>
        ) : (
          <div className="user-menu">
            <button className="avatar-btn" onClick={() => setMenuOpen((v) => !v)}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                user.username?.[0]?.toUpperCase()
              )}
            </button>
            {menuOpen && (
              <div className="dropdown" onMouseLeave={() => setMenuOpen(false)}>
                <div className="dropdown-header">
                  <div className="dropdown-name">{user.username}</div>
                  <div className="dropdown-email">{user.email}</div>
                </div>
                {user.channels?.length > 0 ? (
                  <Link
                    to={`/channel/${user.channels[0]}`}
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Your channel
                  </Link>
                ) : (
                  <Link to="/create-channel" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    Create channel
                  </Link>
                )}
                <Link to="/upload" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  Upload video
                </Link>
                <button className="dropdown-item" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
