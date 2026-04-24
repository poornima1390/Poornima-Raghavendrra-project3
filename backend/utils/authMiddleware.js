import User from '../models/User.js';


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

const getUser = (req) => {
  return req.cookies?.username ?? null;
};

export { requireAuth, getUser };