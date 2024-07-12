const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const lessonSchema = new mongoose.Schema({
  lessonId: String, 
  isTestAvailable: Boolean,
  timeLimit: String,
  questions: [questionSchema],
});

const courseSchema = new mongoose.Schema({
  courseId: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
  title: String,
  lessons: [lessonSchema],
});

const testScoreSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  courseId: mongoose.Schema.Types.ObjectId,
  lessonId: String,
  score: Number,
  isCompleted: Boolean,
});

const TestSchema = new mongoose.Schema({
  courses: [courseSchema],
  scores: [testScoreSchema],
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
