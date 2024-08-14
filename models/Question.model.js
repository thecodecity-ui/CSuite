const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  sections: [
    {
      section: Number,
      duration: { 
        hours: Number, 
        minutes: Number 
      }, 
      questions: [
        {
          question: String,
          options: [String],
          answer: String,
          description: String, 
          difficulty: { 
            type: String, 
            enum: ['Easy', 'Medium', 'Hard'] 
          }, 
          tags: [String] 
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Question', questionSchema);
