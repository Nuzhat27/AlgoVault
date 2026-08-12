const express = require('express');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const {
  listProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  addPracticeSession,
  scheduleReview,
  addEvaluation,
} = require('../controllers/problemController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(listProblems));
router.post('/', asyncHandler(createProblem));
router.get('/:id', asyncHandler(getProblem));
router.put('/:id', asyncHandler(updateProblem));
router.delete('/:id', asyncHandler(deleteProblem));
router.post('/:id/practice-sessions', asyncHandler(addPracticeSession));
router.post('/:id/schedule-review', asyncHandler(scheduleReview));
router.post('/:id/evaluations', asyncHandler(addEvaluation));

module.exports = router;
