import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Sudoku</h1>
          <p className="hero-subtitle">Test Your Logic. Master The Grid.</p>

          <img
            src="https://cdn.pixabay.com/photo/2017/02/05/17/28/relaxation-2040676_1280.jpg"
            alt="Sudoku puzzle illustration"
            className="hero-image"
          />

          <div className="hero-actions">
            <Link to="/games" className="btn btn-primary">
              <i className="fas fa-play-circle"></i>
              Start Playing
            </Link>
            <Link to="/rules" className="btn btn-secondary">
              <i className="fas fa-book-open"></i>
              Learn Rules
            </Link>
          </div>

          {/* Personalised greeting when logged in */}
          {user && (
            <p className="hero-greeting">
              Welcome back, <strong>{user.username}</strong>!
            </p>
          )}
        </div>
      </header>
    </div>
  );
};

export default Home;