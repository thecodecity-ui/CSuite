const { Router } = require('express');
const multer = require('multer');
const CourseDetail = require('../models/CourseDetails.model');

const courseDetailsRouter = Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


courseDetailsRouter.get('/', async (req, res) => {
  try {
    const courses = await CourseDetail.find({});
    res.status(200).json({ success: true, courses, message: "Get request success" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Get course by ID
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
courseDetailsRouter.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'syllabus', maxCount: 10 }]), async (req, res) => {
  try {
    const { title, overviewPoints, description, header, videoUrl, whoIsThisFor, whatYouGet, price, courseDetails } = req.body;

    
    const parsedOverviewPoints = JSON.parse(overviewPoints || '[]');
    const parsedWhoIsThisFor = JSON.parse(whoIsThisFor || '[]');
    const parsedWhatYouGet = JSON.parse(whatYouGet || '[]');
    const parsedCourseDetails = JSON.parse(courseDetails || '[]');


    const image = req.files['image'] ? req.files['image'][0].buffer.toString('base64') : null;
    const syllabus = req.files['syllabus'] ? req.files['syllabus'][0].buffer.toString('base64') : null;


    const newCourse = new CourseDetail({
      title,
      overviewPoints: parsedOverviewPoints,
      description,
      image,
      syllabus,
      header,
      videoUrl,
      whoIsThisFor: parsedWhoIsThisFor,
      whatYouGet: parsedWhatYouGet,
      price,
      courseDetails: parsedCourseDetails
    });

    await newCourse.save();

    res.status(201).json({ success: true, course: newCourse, message: "Course created successfully" });
  } catch (error) {
    
    console.error("Error creating course:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});


courseDetailsRouter.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'syllabus', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, overviewPoints, description, lessons, header, videoUrl, whoIsThisFor, whatYouGet, price, courseDetails } = req.body;

    
    const parsedOverviewPoints = JSON.parse(overviewPoints || '[]');
    const parsedWhoIsThisFor = JSON.parse(whoIsThisFor || '[]');
    const parsedWhatYouGet = JSON.parse(whatYouGet || '[]');
    const parsedCourseDetails = JSON.parse(courseDetails || '[]');
    const parsedLessons = JSON.parse(lessons || '[]');

   
    const image = req.files['image'] ? req.files['image'][0].buffer.toString('base64') : null;
    const syllabus = req.files['syllabus'] ? req.files['syllabus'][0].buffer.toString('base64') : null;

    const updatedCourse = await CourseDetail.findByIdAndUpdate(
      req.params.id,
      {
        title,
        overviewPoints: parsedOverviewPoints,
        description,
        ...(image && { image }),
        lessons: parsedLessons,
        header,
        videoUrl,
        whoIsThisFor: parsedWhoIsThisFor,
        whatYouGet: parsedWhatYouGet,
        ...(syllabus && { syllabus }),
        price,
        courseDetails: parsedCourseDetails
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




courseDetailsRouter.put('/:courseId/lessons', async (req, res) => {
  const { courseId } = req.params;
  const { lessonId, title, description, videos, pdfFiles, pptFiles, testId } = req.body;

  try {
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }


    const course = await CourseDetail.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

   
    if (!lessonId || !title || !description) {
      return res.status(400).json({ success: false, message: 'Lesson ID, title, and description are required' });
    }

    const newLesson = {
      lessonId,
      title,
      description,
      videos: videos || [],
      pdfFiles: pdfFiles || [],
      pptFiles: pptFiles || [],
      testId: testId ? new mongoose.Types.ObjectId(testId) : null
    };

    
    course.lessons.push(newLesson);
    await course.save();

    res.status(200).json({ success: true, message: 'Lesson added successfully', course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = courseDetailsRouter;
