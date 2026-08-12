const Pattern = require('../models/Pattern');
const Problem = require('../models/Problem');

async function listPatterns(req, res) {
  const patterns = await Pattern.find({ user: req.userId }).sort({ name: 1 });
  res.json({ patterns });
}

async function createPattern(req, res) {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ message: 'Pattern name is required.' });

  // Reuse an existing pattern with the same name (case-insensitive) instead of duplicating
  const existing = await Pattern.findOne({ user: req.userId, name: new RegExp(`^${name.trim()}$`, 'i') });
  if (existing) return res.status(200).json({ pattern: existing });

  const pattern = await Pattern.create({ ...req.body, user: req.userId });
  res.status(201).json({ pattern });
}

async function updatePattern(req, res) {
  const pattern = await Pattern.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!pattern) return res.status(404).json({ message: 'Pattern not found.' });
  res.json({ pattern });
}

async function deletePattern(req, res) {
  const pattern = await Pattern.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!pattern) return res.status(404).json({ message: 'Pattern not found.' });
  // Unlink from any problems referencing it
  await Problem.updateMany({ user: req.userId }, { $pull: { patterns: pattern._id } });
  res.json({ message: 'Deleted.' });
}

module.exports = { listPatterns, createPattern, updatePattern, deletePattern };
