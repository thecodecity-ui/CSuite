const express = require('express');
const router = express.Router();
const Question = require('../models/Question.model.js');


router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(questionDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/sections/:sectionNumber/duration', async (req, res) => {
  const { id, sectionNumber } = req.params;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const section = questionDoc.sections.find(s => s.section === parseInt(sectionNumber));
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(200).json({ duration: section.duration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/sections', async (req, res) => {
  const { id } = req.params;
  const newSection = req.body;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    questionDoc.sections.push(newSection);
    await questionDoc.save();
    res.status(201).json(questionDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/:questionId/sections/:sectionNumber/questions', async (req, res) => {
  const { questionId, sectionNumber } = req.params;
  const { question, options, answer, description, difficulty, tags } = req.body;

  try {
    const questionDoc = await Question.findById(questionId);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Question document not found' });
    }

    const section = questionDoc.sections.find(sec => sec.section === parseInt(sectionNumber));
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.questions.push({ question, options, answer, description, difficulty, tags });

    await questionDoc.save();
    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update duration for a specific section
router.put('/:questionId/sections/:sectionNumber/duration', async (req, res) => {
  const { questionId, sectionNumber } = req.params;
  const { hours, minutes } = req.body;

  try {
    const questionDoc = await Question.findById(questionId);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Question document not found' });
    }

    const section = questionDoc.sections.find(s => s.section === parseInt(sectionNumber));
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.duration.hours = hours;
    section.duration.minutes = minutes;

    await questionDoc.save();
    res.status(200).json(questionDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new question to a specific section
router.put('/:id/sections/:sectionNumber/questions', async (req, res) => {
  const { id, sectionNumber } = req.params;
  const newQuestion = req.body;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const section = questionDoc.sections.find(s => s.section === parseInt(sectionNumber));
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.questions.push(newQuestion);
    await questionDoc.save();
    res.status(200).json(questionDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a specific question in a section
router.put('/:id/sections/:sectionNumber/questions/:questionIndex', async (req, res) => {
  const { id, sectionNumber, questionIndex } = req.params;
  const updatedQuestion = req.body;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const section = questionDoc.sections.find(s => s.section === parseInt(sectionNumber));
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    if (section.questions[questionIndex]) {
      section.questions[questionIndex] = updatedQuestion;
      await questionDoc.save();
      res.status(200).json(questionDoc);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id/sections/:sectionNumber/questions/:questionIndex', async (req, res) => {
  const { id, sectionNumber, questionIndex } = req.params;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const section = questionDoc.sections.find(s => s.section === parseInt(sectionNumber));
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    if (section.questions[questionIndex]) {
      section.questions.splice(questionIndex, 1);
      await questionDoc.save();
      res.status(200).json(questionDoc);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id/sections/:sectionNumber', async (req, res) => {
  const { id, sectionNumber } = req.params;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const sectionIndex = questionDoc.sections.findIndex(s => s.section === parseInt(sectionNumber));
    if (sectionIndex !== -1) {
      questionDoc.sections.splice(sectionIndex, 1);
      await questionDoc.save();
      res.status(200).json(questionDoc);
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
