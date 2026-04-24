import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import GameSelection from './pages/GameSelection';
import GamePage from './pages/GamePage';
import Rules from './pages/Rules';
import HighScores from './pages/HighScores';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomGame from './pages/CustomGame';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GameSelection />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/scores" element={<HighScores />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/custom" element={<CustomGame />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;