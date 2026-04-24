import express from 'express';
import Game from '../models/Game.js';
import Highscore from '../models/Highscore.js';
import { requireAuth } from '../utils/authMiddleware.js';
import { generateGameName } from '../utils/wordList.js';
import {
  hasUniqueSolution,
  generatePuzzle,
  copyBoard,
  solveSudoku,
} from '../utils/sudokuUtils.js';

const router = express.Router();

// ─── Helper: convert 2D board array to flat array for storage ─────────────────
const flatten = (board) => board.flat();

// ─── Helper: convert flat array back to 2D board ─────────────────────────────
const unflatten = (flat, size) => {
  const board = [];
  for (let i = 0; i < size; i++) {
    board.push(flat.slice(i * size, (i + 1) * size));
  }
  return board;
};

// ─── Helper: attempt game creation with name collision retry ─────────────────
const createGameWithRetry = async (gameData) => {
  let attempts = 0;
  while (attempts < 5) {
    try {
      const name = generateGameName();
      const game = await Game.create({ ...gameData, name });
      return game;
    } catch (err) {
      console.error('Game creation attempt failed:', err.code, err.message);
      if (err.code === 11000) {
        attempts++;
      } else {
        throw err; // surface the real error immediately
      }
    }
  }
  throw new Error('Could not generate a unique game name after 5 attempts');
};

// ─── GET /api/sudoku ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    return res.json(games.map((g) => g.toSummary()));
  } catch (err) {
    console.error('GET /api/sudoku error:', err);
    return res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// ─── POST /api/sudoku ─────────────────────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const { difficulty } = req.body;

    if (!['normal', 'easy'].includes(difficulty)) {
      return res.status(400).json({ error: "difficulty must be 'normal' or 'easy'" });
    }

    
    const size = difficulty === 'normal' ? 9 : 6;
    const cellsToKeep = difficulty === 'normal' ? Math.floor(Math.random() * 3) + 28 : 18;
    const { puzzle: puzzle2D, solution: solution2D } = generatePuzzle(size, cellsToKeep);

    const puzzleFlat = flatten(puzzle2D);
    const solutionFlat = flatten(solution2D);

    const game = await createGameWithRetry({
      difficulty,
      puzzle: puzzleFlat,
      solution: solutionFlat,
      currentState: puzzleFlat, // starts identical to puzzle
      createdBy: req.user.username,
    });

    return res.status(201).json({ _id: game._id });
  } catch (err) {
    console.error('POST /api/sudoku error:', err);
    return res.status(500).json({ error: 'Failed to create game' });
  }
});

// ─── GET /api/sudoku/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const size = game.difficulty === 'normal' ? 9 : 6;

    return res.json({
      _id: game._id,
      name: game.name,
      difficulty: game.difficulty,
      size,
      puzzle: unflatten(game.puzzle, size),
      solution: unflatten(game.solution, size),
      currentState: unflatten(game.currentState, size),
      createdBy: game.createdBy,
      createdAt: game.createdAt,
      completedBy: game.completedBy,
    });
  } catch (err) {
    console.error('GET /api/sudoku/:id error:', err);
    return res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// ─── PUT /api/sudoku/:id ──────────────────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const { currentState, completed } = req.body;

    if (currentState) {
      // Accept either 2D array from frontend or flat array
      const flat = Array.isArray(currentState[0])
        ? flatten(currentState)
        : currentState;
      game.currentState = flat;
    }

    // Record win if completed and not already recorded for this user
    if (completed && !game.completedBy.includes(req.user.username)) {
      game.completedBy.push(req.user.username);

      // Upsert highscore — the unique index prevents duplicates
      await Highscore.findOneAndUpdate(
        { userId: req.user._id, gameId: game._id },
        {
          userId: req.user._id,
          username: req.user.username,
          gameId: game._id,
          completedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    await game.save();
    return res.json({ message: 'Game updated' });
  } catch (err) {
    console.error('PUT /api/sudoku/:id error:', err);
    return res.status(500).json({ error: 'Failed to update game' });
  }
});

// ─── DELETE /api/sudoku/:id ───────────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (game.createdBy !== req.user.username) {
      return res.status(403).json({ error: 'Only the creator can delete this game' });
    }

    // Remove all wins associated with this game so leaderboard stays accurate
    await Highscore.deleteMany({ gameId: game._id });
    await game.deleteOne();

    return res.json({ message: 'Game deleted' });
  } catch (err) {
    console.error('DELETE /api/sudoku/:id error:', err);
    return res.status(500).json({ error: 'Failed to delete game' });
  }
});

// ─── POST /api/sudoku/validate ────────────────────────────────────────────────
router.post('/validate', requireAuth, async (req, res) => {
  try {
    const { board } = req.body;

    if (!board || !Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ error: 'Invalid board — must be a 9x9 array' });
    }

    const size = 9;

    // Replace empty strings / 0s with null so the solver treats them as blanks
    const normalised = board.map((row) =>
      row.map((cell) => (cell === 0 || cell === '' ? null : cell))
    );

    if (!hasUniqueSolution(normalised, size)) {
      return res.status(400).json({
        error: 'This puzzle does not have exactly one solution. Please adjust it.',
      });
    }

    const solution2D = solveSudoku(copyBoard(normalised), size);
    const puzzleFlat = flatten(normalised);
    const solutionFlat = flatten(solution2D);

    const game = await createGameWithRetry({
      difficulty: 'normal',
      puzzle: puzzleFlat,
      solution: solutionFlat,
      currentState: puzzleFlat,
      createdBy: req.user.username,
    });

    return res.status(201).json({ _id: game._id });
  } catch (err) {
    console.error('POST /api/sudoku/validate error:', err);
    return res.status(500).json({ error: 'Failed to validate custom game' });
  }
});

export default router;