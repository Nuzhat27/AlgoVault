const mongoose = require('mongoose');

const CodeVersionSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'attempt 1' },
    language: { type: String, default: 'python' },
    code: { type: String, default: '' },
  },
  { _id: true }
);

const PracticeSessionSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    outcome: { type: String, enum: ['solved', 'partial', 'gave_up', 'reviewed'], required: true },
  },
  { _id: true }
);

const SectionScoreSchema = new mongoose.Schema(
  {
    name: String,
    score: Number,
  },
  { _id: false }
);

const EvaluationReportSchema = new mongoose.Schema(
  {
    overallScore: Number,
    rating: String,
    sectionScores: [SectionScoreSchema],
    shortcomings: [String],
    suggestions: [String],
    modelAnswer: String,
  },
  { _id: false }
);

const EvaluationSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now },
    transcript: String,
    report: EvaluationReportSchema,
  },
  { _id: true }
);

const ProblemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '', trim: true },
    topics: [{ type: String, trim: true }],
    patterns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pattern' }],
    sourceLink: { type: String, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    personalDifficulty: { type: String, enum: ['', 'Easy', 'Medium', 'Hard'], default: '' },
    description: { type: String, default: '' },
    approach: { type: String, default: '' },
    timeComplexity: { type: String, default: '' },
    spaceComplexity: { type: String, default: '' },
    status: {
      type: String,
      enum: ['New', 'Attempted', 'Solved', 'Solved-Optimally', 'Needs Revisit', 'Mastered'],
      default: 'New',
    },
    codeVersions: { type: [CodeVersionSchema], default: () => [{ label: 'attempt 1', language: 'python', code: '' }] },
    activeVersionIndex: { type: Number, default: 0 },
    spacedRepetition: {
      nextReviewDate: { type: Date, default: null },
    },
    practiceSessions: [PracticeSessionSchema],
    evaluations: [EvaluationSchema],
  },
  { timestamps: true }
);

ProblemSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Problem', ProblemSchema);
