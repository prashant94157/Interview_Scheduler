const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  email: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
const interview = mongoose.model('interview', interviewSchema);

module.exports = interview;
