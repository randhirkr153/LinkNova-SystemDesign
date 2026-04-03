const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000000 } // Start from 1,000,000 for non-trivial strings
});

module.exports = mongoose.model('Counter', counterSchema);
