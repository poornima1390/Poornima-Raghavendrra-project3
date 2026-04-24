import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SudokuGrid from '../components/game/SudokuGrid';
import { checkWin } from '../utils/validators';
import '../styles/SudokuGrid.css';

const GamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState(null);       // full game from API
  const [board, setBoard] = useState(null);     // current user input state (2D)
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const timerRef = useRef(null);
  const saveTimeoutRef = useRef(null); // debounce saves so we don't hit API on every keypress

  // ── Fetch game on mount ────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/sudoku/${id}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Game not found');
        return res.json();
      })
      .then((data) => {
        setGame(data);
        const alreadyDone = user && data.completedBy?.includes(user.username);

      if (alreadyDone) {
        // This user already completed it — show solution
        setCompleted(true);
        setBoard(data.solution);
      } else {
        // Always start from the original puzzle for users who haven't completed it
        // This prevents user 1's progress from showing for user 2
        setBoard(data.puzzle.map(r => [...r]));
      }
    })
    .catch(() => setError('Failed to load game'))
    .finally(() => setLoading(false));
}, [id, user]);

  // ── Timer — only runs while game is active ────────────────────────────────
  useEffect(() => {
    if (!game || completed) return;
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [game, completed]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Save board to API (debounced 800ms) ───────────────────────────────────
  const saveBoard = useCallback((newBoard, isCompleted = false) => {
    if (!user) return;
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      fetch(`/api/sudoku/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentState: newBoard, completed: isCompleted }),
      }).catch((err) => console.error('Save failed:', err));
    }, 800);
  }, [id, user]);

  // ── Handle cell change from SudokuGrid ────────────────────────────────────
  const handleCellChange = useCallback((row, col, value) => {
    if (completed || !user) return;

    setBoard((prev) => {
      const updated = prev.map((r) => [...r]);
      updated[row][col] = value;

      // Check if the board is now complete
      const won = checkWin(updated, game.size);
      if (won) {
        setCompleted(true);
        clearInterval(timerRef.current);
        saveBoard(updated, true);
      } else {
        saveBoard(updated, false);
      }

      return updated;
    });
  }, [completed, user, game, saveBoard]);

  // ── Reset board to original puzzle ───────────────────────────────────────
  const handleReset = () => {
    if (!user || completed) return;
    const reset = game.puzzle.map((r) => [...r]);
    setBoard(reset);
    saveBoard(reset, false);
  };

  // ── Delete game (bonus — only for creator) ────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Delete this game? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sudoku/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      navigate('/games');
    } catch {
      setError('Failed to delete game');
      setDeleting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return <div className="loading">Loading puzzle...</div>;
  if (error)   return <div className="error-message">{error}</div>;
  if (!game)   return null;

  const isCreator = user?.username === game.createdBy;
  const isReadOnly = !user; // logged-out users can view but not interact

  return (
    <div className={`game-page ${game.difficulty}-game`}>
      <header className="game-page-header">
        <h1 className="game-page-title">{game.name}</h1>
        <p className="game-page-subtitle">
          {game.difficulty === 'easy' ? '6x6 Grid — Easy' : '9x9 Grid — Normal'}
        </p>
      </header>

      {/* Controls row */}
      <div className="game-controls">
        <div className="timer-container">
          <i className="far fa-clock"></i>
          <span>{formatTime(timer)}</span>
          <span className="timer-label">elapsed</span>
        </div>

        <div className={`difficulty-badge-game ${game.difficulty}`}>
          <i className={`fas ${game.difficulty === 'easy' ? 'fa-seedling' : 'fa-fire'}`}></i>
          <span>{game.difficulty === 'easy' ? 'Easy • 6x6' : 'Normal • 9x9'}</span>
        </div>

        <div className="game-actions">
          {user && !completed && (
            <button className="game-action-btn" onClick={handleReset}>
              <i className="fas fa-redo-alt"></i>
              Reset
            </button>
          )}
          {isCreator && (
            <button
              className="game-action-btn delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              <i className="fas fa-trash"></i>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      {isReadOnly && (
        <p className="readonly-notice">
          <i className="fas fa-lock"></i>
          <a href="/login">Log in</a> to play this game
        </p>
      )}

      {/* Board */}
      <div className="game-container">
        <SudokuGrid
          board={board}
          initialBoard={game.puzzle}
          solution={game.solution}
          size={game.size}
          onCellChange={handleCellChange}
          readOnly={isReadOnly}
          completed={completed}
        />
      </div>

      {/* Win message */}
      {completed && (
        <div className="congratulations-message">
          <i className="fas fa-trophy"></i>
          <h2>Congratulations!</h2>
          <p>You solved <strong>{game.name}</strong>!</p>
          <button className="auth-btn" onClick={() => navigate('/games')}>
            Back to Games
          </button>
        </div>
      )}

      {/* Instructions */}
      {!completed && (
        <div className="game-instructions">
          <p>
            <i className="fas fa-info-circle"></i>
            Gray cells are pre-filled. Click any empty cell and use keyboard (1–{game.size}) to fill in numbers.
            Invalid placements are highlighted in red.
          </p>
        </div>
      )}
    </div>
  );
};

export default GamePage;