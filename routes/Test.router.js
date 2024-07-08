const express = require('express');
const router = express.Router();
const Test = require('../models/Test.model');

// Get all test data
router.get('/', async (req, res) => {
  try {
    const testData = await Test.find();
    res.json(testData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get test data by lesson ID
router.get('/:lessonId', async (req, res) => {
  const lessonId = parseInt(req.params.lessonId);
  try {
    const testData = await Test.findOne({ 'courses.lessons.lessonId': lessonId });
    if (!testData) return res.status(404).json({ message: 'Test not found' });

    const lesson = testData.courses[0].lessons.find(lesson => lesson.lessonId === lessonId);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
