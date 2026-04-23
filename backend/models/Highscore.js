import mongoose from 'mongoose';

const highscoreSchema = new mongoose.Schema(
  {
    // Store both userId and username so we can display names
    // without extra lookups on the leaderboard
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },

    username: {
      type: String,
      required: [true, 'username is required'],
      trim: true,
    },

    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'gameId is required'],
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // completedAt covers everything we need
  }
);

// Prevent a user from having duplicate wins for the same game
highscoreSchema.index({ userId: 1, gameId: 1 }, { unique: true });

const Highscore = mongoose.model('Highscore', highscoreSchema);

export default Highscore;