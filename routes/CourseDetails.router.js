const { Router } = require('express');
const multer = require('multer');
const CourseDetail = require('../models/CourseDetails.model');

const courseDetailsRouter = Router();

// Configure Multer
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects
const upload = multer({ storage: storage });

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

// Add a new course with file uploads
courseDetailsRouter.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'syllabus', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, overviewPoints, description, lessons, header, videoUrl, whoIsThisFor, whatYouGet, price, courseDetails } = req.body;

    const image = req.files['image'] ? req.files['image'][0].buffer.toString('base64') : null;
    const syllabus = req.files['syllabus'] ? req.files['syllabus'][0].buffer.toString('base64') : null;

    const newCourse = new CourseDetail({
      title,
      overviewPoints: JSON.parse(overviewPoints),
      description,
      image,
      lessons: JSON.parse(lessons),
      header,
      videoUrl,
      whoIsThisFor: JSON.parse(whoIsThisFor),
      whatYouGet: JSON.parse(whatYouGet),
      syllabus,
      price,
      courseDetails: JSON.parse(courseDetails)
    });

    await newCourse.save();
    res.status(201).json({ success: true, course: newCourse, message: "Course created successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Edit a course by ID
courseDetailsRouter.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'syllabus', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, overviewPoints, description, lessons, header, videoUrl, whoIsThisFor, whatYouGet, price, courseDetails } = req.body;

    const image = req.files['image'] ? req.files['image'][0].buffer.toString('base64') : null;
    const syllabus = req.files['syllabus'] ? req.files['syllabus'][0].buffer.toString('base64') : null;

    const updatedCourse = await CourseDetail.findByIdAndUpdate(
      req.params.id,
      {
        title,
        overviewPoints: JSON.parse(overviewPoints),
        description,
        ...(image && { image }),
        lessons: JSON.parse(lessons),
        header,
        videoUrl,
        whoIsThisFor: JSON.parse(whoIsThisFor),
        whatYouGet: JSON.parse(whatYouGet),
        ...(syllabus && { syllabus }),
        price,
        courseDetails: JSON.parse(courseDetails)
      },
      { new: true, runValidators: true }
    );

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
