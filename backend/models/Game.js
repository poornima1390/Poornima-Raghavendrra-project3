import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Game name is required'],
      unique: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ['normal', 'easy'],
      required: [true, 'Difficulty is required'],
    },

    // The initial puzzle board — null means a blank cell
    // Stored as a flat array of 81 values (9x9) or 36 values (6x6)
    puzzle: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },

    // The fully solved board — same flat array format
    solution: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },

    // The current state of user inputs — starts as a copy of puzzle,
    // gets updated via PUT as users fill in cells
    currentState: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },

    // Username of the user who created the game
    createdBy: {
      type: String,
      required: [true, 'createdBy is required'],
    },

    // Array of usernames who have completed this game
    // Used by GamePage to show completed state on return,
    // and by /api/highscore to count wins per user
    completedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Helper: board size derived from puzzle length
gameSchema.virtual('size').get(function () {
  return this.difficulty === 'normal' ? 9 : 6;
});

// Safe summary object for the /games list page —
// excludes the full puzzle arrays to keep the response light
gameSchema.methods.toSummary = function () {
  return {
    _id: this._id,
    name: this.name,
    difficulty: this.difficulty,
    createdBy: this.createdBy,
    createdAt: this.createdAt,
    completedBy: this.completedBy,
  };
};

const Game = mongoose.model('Game', gameSchema);

export default Game;