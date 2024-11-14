// routes/instructorRoutes.js

const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor.model');

router.post('/save-email', async (req, res) => {
  try {
    const { email } = req.body;

    let instructor = await Instructor.findOne({ email });
    if (instructor) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    instructor = new Instructor({ email });
    await instructor.save();

    res.status(201).json({ message: 'Instructor email saved successfully', instructor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.get('/emails', async (req, res) => {
  try {
    const instructors = await Instructor.find({}, 'email'); 
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
