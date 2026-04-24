import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/GameSelection.css';

const GameSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(''); // 'normal' | 'easy' | ''

  // Fetch all existing games on mount
  useEffect(() => {
    fetch('/api/sudoku', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch(() => setError('Failed to load games'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateGame = async (difficulty) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setCreating(difficulty);
    setError('');

    try {
      const res = await fetch('/api/sudoku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create game');
        return;
      }

      navigate(`/game/${data._id}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setCreating('');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="selection-page">
      <header className="page-header">
        <h1 className="page-title">Game Selection</h1>
        <p className="page-subtitle">Create a new puzzle or pick an existing one</p>
      </header>

      {/* Create game buttons */}
      <div className="create-buttons">
        <button
          className="btn-create btn-normal"
          onClick={() => handleCreateGame('normal')}
          disabled={!!creating}
        >
          <i className="fas fa-fire"></i>
          {creating === 'normal' ? 'Creating...' : 'Create Normal Game'}
        </button>

        <button
          className="btn-create btn-easy"
          onClick={() => handleCreateGame('easy')}
          disabled={!!creating}
        >
          <i className="fas fa-seedling"></i>
          {creating === 'easy' ? 'Creating...' : 'Create Easy Game'}
        </button>

        {user && (
          <Link to="/custom" className="btn-create btn-custom">
            <i className="fas fa-pencil-alt"></i>
            Create Custom Game
          </Link>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Existing games list */}
      <section className="games-section">
        <h2 className="games-section-title">Existing Games</h2>

        {loading && <p className="loading-message">Loading games...</p>}

        {!loading && games.length === 0 && (
          <p className="empty-message">No games yet — create one above!</p>
        )}

        {!loading && games.length > 0 && (
          <div className="games-grid">
            {games.map((game) => (
              <div key={game._id} className="game-card">
                <div className={`difficulty-badge ${game.difficulty}`}>
                  {game.difficulty === 'easy' ? 'Easy' : 'Normal'}
                </div>

                <h2 className="game-title">{game.name}</h2>

                <div className="game-meta">
                  <div className="game-author">
                    <i className="fas fa-user"></i>
                    <span>{game.createdBy}</span>
                  </div>
                  <div className="game-stats">
                    <i className="fas fa-calendar"></i>
                    <span>{formatDate(game.createdAt)}</span>
                  </div>
                </div>

                {game.completedBy?.length > 0 && (
                  <div className="game-completions">
                    <i className="fas fa-check-circle"></i>
                    <span>{game.completedBy.length} completion{game.completedBy.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

                <div className="game-card-footer">
                  <Link to={`/game/${game._id}`} className="btn-play">
                    Play <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GameSelection;