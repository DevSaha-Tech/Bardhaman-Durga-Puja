const express = require('express');
const router = express.Router();

// Mock route
router.get('/', (req, res) => {
  res.json({ message: 'Pandal routes' });
});

module.exports = router;
