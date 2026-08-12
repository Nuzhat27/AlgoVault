const MockSession = require('../models/MockSession');

async function listMockSessions(req, res) {
  const sessions = await MockSession.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ sessions });
}

async function createMockSession(req, res) {
  const session = await MockSession.create({ ...req.body, user: req.userId });
  res.status(201).json({ session });
}

module.exports = { listMockSessions, createMockSession };
