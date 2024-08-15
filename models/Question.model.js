const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  sections: [
    {
      section: Number,
      duration: { 
        hours: Number, 
        minutes: Number 
      }, 
      difficulty: { 
        type: String, 
        enum: ['Easy', 'Medium', 'Hard'] 
      }, 
      tags: [String],
      description: String,
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
