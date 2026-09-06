const mongoose = require('mongoose');

const visitorLogSchema = new mongoose.Schema({
  pandalId: { type: String, required: true, index: true },
  visitedAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('VisitorLog', visitorLogSchema);
