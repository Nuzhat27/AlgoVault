const Problem = require('../models/Problem');

async function listProblems(req, res) {
  const problems = await Problem.find({ user: req.userId }).sort({ updatedAt: -1 });
  res.json({ problems });
}

async function getProblem(req, res) {
  const problem = await Problem.findOne({ _id: req.params.id, user: req.userId });
  if (!problem) return res.status(404).json({ message: 'Problem not found.' });
  res.json({ problem });
}

async function createProblem(req, res) {
  const problem = await Problem.create({ ...req.body, user: req.userId });
  res.status(201).json({ problem });
}

async function updateProblem(req, res) {
  const problem = await Problem.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!problem) return res.status(404).json({ message: 'Problem not found.' });
  res.json({ problem });
}

async function deleteProblem(req, res) {
  const result = await Problem.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!result) return res.status(404).json({ message: 'Problem not found.' });
  res.json({ message: 'Deleted.' });
}

// Log a practice session (solved / partial / gave_up / reviewed)
async function addPracticeSession(req, res) {
  const { outcome } = req.body;
  const problem = await Problem.findOne({ _id: req.params.id, user: req.userId });
  if (!problem) return res.status(404).json({ message: 'Problem not found.' });

  problem.practiceSessions.push({ timestamp: new Date(), outcome });

  // Automatically schedule solved problems for spaced repetition.
  // The interval grows as the same problem is successfully recalled.
  if (outcome === 'solved') {
    if (problem.status === 'New') problem.status = 'Solved';
    const solvedCount = problem.practiceSessions.filter((session) => session.outcome === 'solved').length;
    const intervals = [1, 3, 7, 14, 30];
    const days = intervals[Math.min(solvedCount - 1, intervals.length - 1)];
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + days);
    problem.spacedRepetition.nextReviewDate = nextReview;
  }

  if (outcome === 'reviewed') {
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 7);
    problem.spacedRepetition.nextReviewDate = nextReview;
  }

  await problem.save();
  res.json({ problem });
}

// Schedule spaced repetition
async function scheduleReview(req, res) {
  const { days } = req.body;
  const problem = await Problem.findOne({ _id: req.params.id, user: req.userId });
  if (!problem) return res.status(404).json({ message: 'Problem not found.' });

  const date = new Date();
  date.setDate(date.getDate() + Number(days));
  problem.spacedRepetition.nextReviewDate = date;
  await problem.save();
  res.json({ problem });
}

// Save an AI evaluation onto a problem (called after /api/evaluate returns a report)
async function addEvaluation(req, res) {
  const { transcript, report } = req.body;
  const problem = await Problem.findOne({ _id: req.params.id, user: req.userId });
  if (!problem) return res.status(404).json({ message: 'Problem not found.' });

  problem.evaluations.push({ transcript, report, createdAt: new Date() });
  await problem.save();
  res.json({ problem });
}

module.exports = {
  listProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  addPracticeSession,
  scheduleReview,
  addEvaluation,
};
