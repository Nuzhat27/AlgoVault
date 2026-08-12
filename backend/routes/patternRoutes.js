const express = require('express');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { listPatterns, createPattern, updatePattern, deletePattern } = require('../controllers/patternController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(listPatterns));
router.post('/', asyncHandler(createPattern));
router.put('/:id', asyncHandler(updatePattern));
router.delete('/:id', asyncHandler(deletePattern));

module.exports = router;
