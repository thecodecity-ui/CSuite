const mongoose = require('mongoose');

//For individual lesson videos
const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, { _id: false });

// Schema for a lesson
const LessonSchema = new mongoose.Schema({
  lessonId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required']
  },
  videos: {
    type: [VideoSchema],
    required: true
  },
  pdfFiles: {
    type: [String],
    default: []
  },
  pptFiles: {
    type: [String],
    default: []
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: false
  }
}, { _id: false });


const OverviewPointSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { _id: false });


const WhatYouGetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { _id: false });


const WhoIsThisForSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
}, { _id: false });

const CourseDetailsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title field required']
  },
  overviewPoints: {
    type: [OverviewPointSchema],
    default: []
  },
  description: {
    type: String,
    required: [true, 'Description field required']
  },
<<<<<<< HEAD
  image: {
    type: String,
    default: ''
=======
   image: {
    type: String,
    required: [true, 'Image field required']
>>>>>>> bfc40feca42566fa056bd43daaca418ce87447d0
  },
  lessons: {
    type: [LessonSchema],
    default: []
  },
  header: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  whoIsThisFor: {
    type: [WhoIsThisForSchema],
    default: []
  },
  whatYouGet: {
    type: [WhatYouGetSchema],
    default: []
  },
  syllabus: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
<<<<<<< HEAD
    default: 0
  },
=======
    required: [true, 'Price field required']
  },
 
>>>>>>> bfc40feca42566fa056bd43daaca418ce87447d0
  courseDetails: {
    type: [
      {
        text: {
          type: String,
          required: true
        }
      }
    ],
    default: []
  }
}, { timestamps: true });

const CourseDetail = mongoose.model('CourseDetail', CourseDetailsSchema);

module.exports = CourseDetail;
