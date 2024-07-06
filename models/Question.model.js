const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  sections: [
    {
      section: Number,
      questions: [
        {
          question: String,
          options: [String],
          answer: String
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Question', questionSchema);