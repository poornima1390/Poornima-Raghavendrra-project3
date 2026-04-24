import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/HighScores.css';

const HighScores = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/highscore', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setScores(data))
      .catch(() => setError('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `${rank}th`;
  };

  return (
    <div className="highscores-page">
      <header className="page-header">
        <h1 className="page-title">Hall of Fame</h1>
        <p className="page-subtitle">Top Sudoku solvers — ranked by games completed</p>
      </header>

      <div className="leaderboard-section">
        {loading && <p className="loading-message">Loading leaderboard...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && scores.length === 0 && (
          <p className="empty-message">
            No wins recorded yet — complete a game to appear here!
          </p>
        )}

        {!loading && !error && scores.length > 0 && (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Games Won</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => {
                const rank = index + 1;
                const isCurrentUser = user?.username === score.username;
                return (
                  <tr
                    key={score.username}
                    className={`${isCurrentUser ? 'current-user-row' : ''} ${rank <= 3 ? `top-${rank}` : ''}`}
                  >
                    <td>
                      <div className="rank-column">
                        <span className={`rank-badge rank-${Math.min(rank, 4)}`}>
                          {getRankBadge(rank)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="player-info">
                        <div className="player-avatar">
                          {score.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="player-name">
                          {score.username}
                          {isCurrentUser && (
                            <span className="you-badge"> (you)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="wins-count">{score.wins}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HighScores;