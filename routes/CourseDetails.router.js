const { Router } = require('express');
const courseDetailsRouter = Router();
const CourseDetail = require('../models/CourseDetails.model');

// Get all courses
courseDetailsRouter.get('/', async (req, res) => {
  try {
    const courses = await CourseDetail.find({});
    res.status(200).json({ success: true, courses, message: "Get request success" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Get a single course by ID
courseDetailsRouter.get('/:id', async (req, res) => {
  try {
    const course = await CourseDetail.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, course, message: "Get course by ID success" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Add a new course
courseDetailsRouter.post('/', async (req, res) => {
  try {
    const newCourse = new CourseDetail(req.body);
    await newCourse.save();
    res.status(201).json({ success: true, course: newCourse, message: "Course created successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Edit a course by ID
courseDetailsRouter.put('/:id', async (req, res) => {
  try {
    const updatedCourse = await CourseDetail.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, course: updatedCourse, message: "Course updated successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Delete a course by ID
courseDetailsRouter.delete('/:id', async (req, res) => {
  try {
    const deletedCourse = await CourseDetail.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = courseDetailsRouter;
