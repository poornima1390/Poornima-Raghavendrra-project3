import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <i className="fas fa-th"></i>
          <span>Sudoku</span>
        </div>
        <p className="footer-copyright">© 2026 Sudoku. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/rules">Rules</Link>
          <Link to="/scores">High Scores</Link>
          <Link to="/rules#credits">Credits</Link>
          <a href="mailto:contact@sudokuchallenge.com">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;