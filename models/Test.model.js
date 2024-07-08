const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const lessonSchema = new mongoose.Schema({
  lessonId: Number,
  isTestAvailable: Boolean,
  timeLimit: String,
  questions: [questionSchema],
});

const courseSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema],
});

const TestSchema = new mongoose.Schema({
  courses: [courseSchema],
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
