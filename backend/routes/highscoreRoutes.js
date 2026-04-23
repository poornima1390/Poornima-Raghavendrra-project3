import express from 'express';
import Highscore from '../models/Highscore.js';
import { requireAuth } from '../utils/authMiddleware.js';

const router = express.Router();

// ─── GET /api/highscore ───────────────────────────────────────────────────────
// Returns the sorted leaderboard — users grouped by win count.
// Ties broken alphabetically by username (ascending).
// Users with 0 wins are excluded (they have no documents here).
// Accessible to all users including logged-out.
router.get('/', async (req, res) => {
  try {
    const scores = await Highscore.aggregate([
      {
        $group: {
          _id: '$username',
          wins: { $sum: 1 },
        },
      },
      {
        $sort: { wins: -1, _id: 1 }, // most wins first, then A-Z for ties
      },
      {
        $project: {
          _id: 0,
          username: '$_id',
          wins: 1,
        },
      },
    ]);

    return res.json(scores);
  } catch (err) {
    console.error('GET /api/highscore error:', err);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// ─── GET /api/highscore/:gameId ───────────────────────────────────────────────
// Returns all wins recorded for a specific game.
// Used on the game page to show who has already completed it.
router.get('/:gameId', async (req, res) => {
  try {
    const scores = await Highscore.find({ gameId: req.params.gameId })
      .sort({ completedAt: 1 }) // first completion first
      .select('username completedAt -_id');

    return res.json(scores);
  } catch (err) {
    console.error('GET /api/highscore/:gameId error:', err);
    return res.status(500).json({ error: 'Failed to fetch game scores' });
  }
});

// ─── POST /api/highscore ──────────────────────────────────────────────────────
// Body: { gameId }
// Records a win for the currently logged-in user.
// Safe to call multiple times — the unique index on {userId, gameId}
// prevents duplicate wins from being stored.
// Note: the PUT /api/sudoku/:id route also records wins when completed: true
// is passed. This endpoint exists as a standalone fallback per the rubric.
router.post('/', requireAuth, async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'gameId is required' });
    }

    await Highscore.findOneAndUpdate(
      { userId: req.user._id, gameId },
      {
        userId: req.user._id,
        username: req.user.username,
        gameId,
        completedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({ message: 'Win recorded' });
  } catch (err) {
    console.error('POST /api/highscore error:', err);
    return res.status(500).json({ error: 'Failed to record win' });
  }
});

export default router;