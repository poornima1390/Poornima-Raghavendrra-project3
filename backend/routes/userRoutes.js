import express from 'express';
import User from '../models/User.js';

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: false,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  sameSite: 'lax',
};

// ─── GET /api/user/isLoggedIn ─────────────────────────────────────────────────
router.get('/isLoggedIn', async (req, res) => {
  try {
    const userId = req.cookies?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    return res.json({ username: user.username });
  } catch (err) {
    return res.status(401).json({ error: 'Not logged in' });
  }
});

// ─── POST /api/user/register ──────────────────────────────────────────────────
// Body: { username, password }
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // passwordHash field triggers the pre('save') bcrypt hook in User.js
    const user = new User({ username, passwordHash: password });
    await user.save();

    setAuthCookies(res, user);
    return res.status(201).json({ username: user.username });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// ─── POST /api/user/login ─────────────────────────────────────────────────────
// Body: { username, password }
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    setAuthCookies(res, user);
    return res.json({ username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// ─── POST /api/user/logout ────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.clearCookie('username');
  return res.json({ message: 'Logged out' });
});

// ─── Helper ───────────────────────────────────────────────────────────────────
// Sets both cookies in one place so login and register stay in sync.
const setAuthCookies = (res, user) => {
  // httpOnly: true — JS can't read this, only the server uses it for auth
  res.cookie('userId', user._id.toString(), { ...COOKIE_OPTIONS, httpOnly: true });
  // httpOnly: false — React AuthContext reads this to display the username
  res.cookie('username', user.username, { ...COOKIE_OPTIONS, httpOnly: false });
};

export default router;