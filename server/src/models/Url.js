const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  short_url: { type: String, required: true, unique: true, index: true },
  long_url: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  numeric_id: { type: Number }
});

module.exports = mongoose.model('Url', urlSchema);
