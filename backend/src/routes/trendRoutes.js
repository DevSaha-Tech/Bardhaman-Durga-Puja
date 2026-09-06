const express = require('express');
const router = express.Router();
const VisitorLog = require('../models/VisitorLog');

// Get trends
router.get('/', async (req, res) => {
  try {
    // Top 3 most-visited and least-visited over the last 48 hours
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    
    const pipeline = [
      { $match: { visitedAt: { $gte: fortyEightHoursAgo } } },
      { $group: { _id: "$pandalId", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ];

    const result = await VisitorLog.aggregate(pipeline);
    
    // Top 3 most visited
    const mostVisited = result.slice(0, 3);
    
    // Top 3 least visited (requires reversing the sorted array)
    const leastVisited = [...result].reverse().slice(0, 3);

    res.json({ mostVisited, leastVisited });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Server error fetching trends' });
  }
});

module.exports = router;
