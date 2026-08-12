const express = require('express');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { evaluateTranscript } = require('../controllers/evaluateController');

const router = express.Router();
router.use(auth);

router.post('/', asyncHandler(evaluateTranscript));

module.exports = router;
