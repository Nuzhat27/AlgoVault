const mongoose = require('mongoose');

const MockResultSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    score: { type: Number, default: null },
    skipped: { type: Boolean, default: false },
  },
  { _id: false }
);

const MockSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    results: [MockResultSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('MockSession', MockSessionSchema);
