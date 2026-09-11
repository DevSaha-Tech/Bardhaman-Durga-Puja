const express = require('express');
const router = express.Router();
const VisitorLog = require('../models/VisitorLog');
const Review = require('../models/Review');

// Check-in (Add to VisitorLog)
router.post('/:id/checkin', async (req, res) => {
  try {
    const pandalId = req.params.id;
    
    // Save visit log
    const visit = new VisitorLog({ pandalId });
    await visit.save();

    // Calculate current live count (visits in the last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const liveCount = await VisitorLog.countDocuments({
      pandalId,
      visitedAt: { $gte: twoHoursAgo }
    });

    res.status(201).json({ success: true, liveCount });
  } catch (error) {
    console.error('Error in checkin:', error);
    res.status(500).json({ error: 'Server error during checkin' });
  }
});

// Create a review/tip
router.post('/:id/reviews', async (req, res) => {
  try {
    const { tag, comment, userName } = req.body;
    const review = new Review({
      pandalId: req.params.id,
      tag,
      comment,
      userName
    });
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Server error adding review' });
  }
});

// Get reviews for a pandal
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ pandalId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
});

module.exports = router;
