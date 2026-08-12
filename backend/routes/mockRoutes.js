const express = require('express');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { listMockSessions, createMockSession } = require('../controllers/mockController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(listMockSessions));
router.post('/', asyncHandler(createMockSession));

module.exports = router;
