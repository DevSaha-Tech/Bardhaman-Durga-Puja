const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit platform feedback
router.post('/', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const feedback = new Feedback({ rating, comment });
    await feedback.save();
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ error: 'Server error adding feedback' });
  }
});

module.exports = router;
