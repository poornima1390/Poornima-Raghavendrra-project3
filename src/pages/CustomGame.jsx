import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isCellInvalid } from '../utils/validators';
import '../styles/SudokuGrid.css';
import '../styles/CustomGame.css';

const SIZE = 9;

const generateEmptyBoard = () =>
  Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));

const CustomGame = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [board, setBoard] = useState(generateEmptyBoard());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedCell, setSelectedCell] = useState(null);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="custom-page">
        <div className="auth-required">
          <i className="fas fa-lock"></i>
          <h2>Login Required</h2>
          <p>You must be logged in to create a custom game.</p>
          <button className="auth-btn" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleCellChange = (row, col, raw) => {
    if (raw === '') {
      updateCell(row, col, null);
      return;
    }
    const num = parseInt(raw);
    if (!isNaN(num) && num >= 1 && num <= SIZE) {
      updateCell(row, col, num);
    }
  };

  const updateCell = (row, col, value) => {
    setBoard((prev) => {
      const updated = prev.map((r) => [...r]);
      updated[row][col] = value;
      return updated;
    });
    setError('');
  };

  const handleClear = () => {
    setBoard(generateEmptyBoard());
    setError('');
    setSelectedCell(null);
  };

  const getCellClass = (row, col) => {
    const classes = [];
    if ((row + 1) % 3 === 0 && row !== 8) classes.push('border-bottom-thick');
    if ((col + 1) % 3 === 0 && col !== 8) classes.push('border-right-thick');
    return classes.join(' ');
  };

  const isInvalid = (row, col) => {
    if (board[row][col] === null) return false;
    return isCellInvalid(board, row, col, SIZE);
  };

  const isSelected = (row, col) =>
    selectedCell?.row === row && selectedCell?.col === col;

  const filledCount = board.flat().filter((c) => c !== null).length;
  const hasConflicts = board.some((row, r) =>
    row.some((_, c) => isInvalid(r, c))
  );

  const handleSubmit = async () => {
    setError('');

    if (filledCount < 17) {
      setError('A valid Sudoku puzzle needs at least 17 clues. Please fill in more cells.');
      return;
    }

    if (hasConflicts) {
      setError('Your puzzle has conflicts (red cells). Please fix them before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/sudoku/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ board }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Puzzle validation failed');
        return;
      }

      navigate(`/game/${data._id}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="custom-page">
      <header className="page-header">
        <h1 className="page-title">Create Custom Game</h1>
        <p className="page-subtitle">
          Fill in your puzzle clues — we'll verify it has exactly one solution
        </p>
      </header>

      <div className="custom-instructions">
        <i className="fas fa-info-circle"></i>
        Click any cell and type a number (1–9). Leave cells empty for blanks.
        Conflicts are highlighted in red. You need at least 17 clues.
        <span className="clue-count">
          {filledCount} clue{filledCount !== 1 ? 's' : ''} entered
        </span>
      </div>

      {/* Board */}
      <div className="game-container">
        <div className="sudoku-grid hard-grid">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex)}
                >
                  <input
                    type="text"
                    className={`grid-cell-input
                      ${isSelected(rowIndex, colIndex) ? 'selected' : ''}
                      ${isInvalid(rowIndex, colIndex) ? 'invalid' : ''}
                      ${cell !== null ? 'user-filled' : ''}
                    `}
                    value={cell === null ? '' : cell}
                    maxLength={1}
                    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="auth-error custom-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="custom-actions">
        <button className="game-action-btn" onClick={handleClear} disabled={submitting}>
          <i className="fas fa-eraser"></i>
          Clear Board
        </button>

        <button
          className="auth-btn submit-btn"
          onClick={handleSubmit}
          disabled={submitting || filledCount < 17 || hasConflicts}
        >
          <i className="fas fa-check-circle"></i>
          {submitting ? 'Validating...' : 'Submit Puzzle'}
        </button>
      </div>

      <p className="custom-note">
        <i className="fas fa-flask"></i>
        Validation checks that your puzzle has exactly one solution.
        This may take a few seconds for complex puzzles.
      </p>
    </div>
  );
};

export default CustomGame;