const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  description: String,
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium'
  },
  tags: [String],
  time: Number,
  sections: [
    {
      section: Number,
      questions: [
        {
          question: String,
          options: [String],
          answer: String,
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Question1', questionSchema);
