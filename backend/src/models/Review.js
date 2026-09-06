const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  pandalId: { type: String, required: true, index: true },
  tag: { 
    type: String, 
    enum: ['long_line', 'best_light', 'worst_management', 'spacious', 'great_idol', 'general'],
    default: 'general'
  },
  comment: { type: String, required: true, maxlength: 300 },
  userName: { type: String, default: 'দর্শনার্থী' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
