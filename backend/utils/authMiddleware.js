import User from '../models/User.js';

// Middleware that checks if a valid session cookie exists.
// Attach to any route that requires a logged-in user.
// On success, attaches req.user = { _id, username } for use in the route handler.
// On failure, returns 401 so the frontend can redirect to /login.
const requireAuth = async (req, res, next) => {
  try {
    const userId = req.session?.userId ?? req.cookies?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach safe user info to the request for downstream handlers
    req.user = { _id: user._id, username: user.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Lightweight version — reads the cookie without hitting the DB.
// Use this for routes that only need to know the username (e.g. GET routes
// where logged-out users can still view but not act).
const getUser = (req) => {
  return req.cookies?.username ?? null;
};

export { requireAuth, getUser };