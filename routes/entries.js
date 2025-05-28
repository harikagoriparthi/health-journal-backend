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

router.get('/', auth, async (req, res) => {
  const entries = await Entry.find({ userId: req.user.id });
  res.json(entries);
});

router.post('/', auth, async (req, res) => {
  const entry = new Entry({ ...req.body, userId: req.user.id });
  await entry.save();
  res.json(entry);
});

router.delete('/:id', auth, async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  res.json({ message: 'Entry deleted' });
});

module.exports = router;
