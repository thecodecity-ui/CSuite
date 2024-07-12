const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Test = require('../models/Test.model');
const User = require('../models/User.model');

// Add test score
router.post('/score', async (req, res) => {
  const { userId, courseId, lessonId, score, isCompleted } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingScore = user.testScores.find(testScore => 
      testScore.courseId.equals(courseId) && testScore.lessonId === lessonId
    );
    if (existingScore) {
      return res.status(400).json({ message: 'Score for this test already exists' });
    }

    user.testScores.push({ courseId, lessonId, score, isCompleted });
    await user.save();
    res.status(201).json({ message: 'Score added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update test score
router.put('/score/:userId/:courseId/:lessonId', async (req, res) => {
  const { userId, courseId, lessonId } = req.params;
  const { score, isCompleted } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const scoreEntry = user.testScores.find(testScore => 
      testScore.courseId.equals(courseId) && testScore.lessonId === lessonId
    );
    if (!scoreEntry) return res.status(404).json({ message: 'Score not found' });

    scoreEntry.score = score;
    scoreEntry.isCompleted = isCompleted;
    await user.save();
    res.status(200).json({ message: 'Score updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete test score
router.delete('/score/:userId/:courseId/:lessonId', async (req, res) => {
  const { userId, courseId, lessonId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.testScores = user.testScores.filter(testScore => 
      !(testScore.courseId.equals(courseId) && testScore.lessonId === lessonId)
    );
    await user.save();
    res.status(200).json({ message: 'Score deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all test data
router.get('/', async (req, res) => {
  try {
    const testData = await Test.find();
    res.json(testData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get test data 
router.get('/:userId/:courseId/:lessonId', async (req, res) => {
  const { userId, courseId, lessonId } = req.params;
  try {
    const testData = await Test.findOne({
      'courses._id': new mongoose.Types.ObjectId(courseId),
      'courses.lessons.lessonId': lessonId
    });
    if (!testData) return res.status(404).json({ message: 'Test not found' });

    const course = testData.courses.find(course => course._id.equals(new mongoose.Types.ObjectId(courseId)));
    const lesson = course.lessons.find(lesson => lesson.lessonId === lessonId);
    
    res.json({ lesson });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit test data
router.put('/:courseId/:lessonId', async (req, res) => {
  const { courseId, lessonId } = req.params;
  const { title, isTestAvailable, timeLimit, questions } = req.body;
  try {
    const testData = await Test.findOne({
      'courses._id': new mongoose.Types.ObjectId(courseId),
      'courses.lessons.lessonId': lessonId
    });
    if (!testData) return res.status(404).json({ message: 'Test not found' });

    const course = testData.courses.find(course => course._id.equals(new mongoose.Types.ObjectId(courseId)));
    const lesson = course.lessons.find(lesson => lesson.lessonId === lessonId);

    if (title) course.title = title;
    if (typeof isTestAvailable === 'boolean') lesson.isTestAvailable = isTestAvailable;
    if (timeLimit) lesson.timeLimit = timeLimit;
    if (questions) lesson.questions = questions;

    await testData.save();
    res.status(200).json({ message: 'Test data updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
