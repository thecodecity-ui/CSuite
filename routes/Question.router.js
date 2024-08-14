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


router.put('/:id/sections/:sectionId/questions', async (req, res) => {
  const { id, sectionId } = req.params;
  const newQuestion = req.body;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const section = questionDoc.sections.find(s => s.section === parseInt(sectionId));
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


router.put('/:id/sections/:sectionId/questions/:questionIndex', async (req, res) => {
  const { id, sectionId, questionIndex } = req.params;
  const updatedQuestion = req.body;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const section = questionDoc.sections.find(s => s.section === parseInt(sectionId));
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


router.delete('/:id/sections/:sectionId/questions/:questionIndex', async (req, res) => {
  const { id, sectionId, questionIndex } = req.params;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const section = questionDoc.sections.find(s => s.section === parseInt(sectionId));
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


router.delete('/:id/sections/:sectionId', async (req, res) => {
  const { id, sectionId } = req.params;

  try {
    const questionDoc = await Question.findById(id);
    if (!questionDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const sectionIndex = questionDoc.sections.findIndex(s => s.section === parseInt(sectionId));
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
