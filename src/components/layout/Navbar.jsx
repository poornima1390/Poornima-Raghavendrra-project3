import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <i className="fas fa-th"></i>
          <span>Sudoku</span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>

          {/* Always visible */}
          <li className={`nav-item ${isActive('/')}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/games')}`}>
            <Link to="/games" className="nav-link" onClick={closeMenu}>
              <i className="fas fa-gamepad"></i>
              <span>Games</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/rules')}`}>
            <Link to="/rules" className="nav-link" onClick={closeMenu}>
              <i className="fas fa-book"></i>
              <span>Rules</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/scores')}`}>
            <Link to="/scores" className="nav-link" onClick={closeMenu}>
              <i className="fas fa-trophy"></i>
              <span>High Scores</span>
            </Link>
          </li>

          
          {!user && (
            <>
              <li className={`nav-item ${isActive('/login')}`}>
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
              </li>
              <li className={`nav-item ${isActive('/register')}`}>
                <Link to="/register" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}

          
          {user && (
            <>
              <li className="nav-item nav-username">
                <i className="fas fa-user-circle"></i>
                <span>{user.username}</span>
              </li>
              <li className="nav-item">
                <button className="nav-link nav-logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;