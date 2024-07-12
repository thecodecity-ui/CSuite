const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required']
  },
  videoUrl: {
    type: String,
    required: [true, 'Lesson video URL is required']
  },
  isTestAvailable: {
    type: Boolean,
    default: false
  },
  timeLimit: {
    type: Number,
    default: 0
  },
  questions: {
    type: Array,
    default: []
  }
}, { _id: false });

const CourseDetailsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title field required']
  },
  overviewPoints: {
    type: [String],
    required: [true, 'Overview points field required']
  },
  description: {
    type: String,
    required: [true, 'Description field required']
  },
  lessons: {
    type: [LessonSchema],
    required: [true, 'Lessons field required']
  },
  header: {
    type: String,
    required: [true, 'Header field required']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL field required']
  },
  whoIsThisFor: {
    type: [String],
    required: [true, 'Who is this for field required']
  },
  whatYouGet: {
    type: [String],
    required: [true, 'What you get field required']
  },
  syllabus: {
    type: String,
    required: [true, 'Syllabus field required']
  },
  price: {
    type: Number,
    required: [true, 'Price field required']
  },
  image :{
    type : String ,
    required : [true, 'image field required']
},
  courseDetails: {
    type: [String],
    required: [true, 'Course details field required']
  }
  
}, { timestamps: true });

const CourseDetail = mongoose.model('CourseDetail', CourseDetailsSchema);

module.exports = CourseDetail;
