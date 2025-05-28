const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: String,
  symptoms: String,
  medications: String,
  mood: String,
});

module.exports = mongoose.model('Entry', EntrySchema);
