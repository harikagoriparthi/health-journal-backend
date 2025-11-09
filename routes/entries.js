const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Entry = require('../models/Entry');

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(401);
  }
}

// ✅ Get all entries for a specific user
router.get('/', auth, async (req, res) => {
  const entries = await Entry.find({ userId: req.user.id });
  res.json(entries);
});

// ✅ Add new entry
router.post('/', auth, async (req, res) => {
  const entry = new Entry({ ...req.body, userId: req.user.id });
  await entry.save();
  res.json(entry);
});

// ✅ Delete an entry (only if it belongs to the logged-in user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found or unauthorized' });
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting entry' });
  }
});

module.exports = router;
