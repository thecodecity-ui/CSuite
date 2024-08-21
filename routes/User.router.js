const { Router } = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken'); 
const User = require('../models/User.model');
const CourseDetail = require('../models/CourseDetails.model');
const { findUserByEmail, insertUser } = require('../models/User.model');

const QuestionModel = require('../models/Question.model');

const userRouter = Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all users
userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, users, message: "Get request success" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});


userRouter.post('/check', async (req, res) => {
  try {
    const {email,password} = req.body;
    const users = await User.findOne({email:email});
    if (users.length<1) {
      return res.status(200).json({ success: false, message: "User not found" });
    }
    isMatch = await bcrypt.compare(password, users.password);
    res.status(200).json({ success: true, users, message: "Get request success" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

userRouter.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user, message: "Get request success" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});


userRouter.post('/', upload.fields([{ name: 'profilePic' }, { name: 'profileBanner' }]), async (req, res) => {
  try {
    const { password, socialMediaId, ...rest } = req.body;
    const profilePic = req.files.profilePic ? req.files.profilePic[0].buffer.toString('base64') : null;
    const profileBanner = req.files.profileBanner ? req.files.profileBanner[0].buffer.toString('base64') : null;

    let newUser;
    if (socialMediaId) {
      newUser = new User({ ...rest, profilePic, profileBanner, socialMediaId });
    } else if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = new User({ ...rest, password: hashedPassword, profilePic, profileBanner });
    } else {
      return res.status(400).json({ success: false, message: 'Password or social media ID required' });
    }

    const savedUser = await newUser.save();
    res.status(201).json({ success: true, user: savedUser, message: "User added successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});


userRouter.put('/:id', upload.fields([{ name: 'profilePic' }, { name: 'profileBanner' }]), async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      rest.password = hashedPassword;
    }
    if (req.files.profilePic) {
      rest.profilePic = req.files.profilePic[0].buffer.toString('base64');
    }
    if (req.files.profileBanner) {
      rest.profileBanner = req.files.profileBanner[0].buffer.toString('base64');
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, rest, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: updatedUser, message: "Successfully updated" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});


userRouter.put('/updatecourse/:id', async (req, res) => {
  try {
    const { courseId, courseName} = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const course = await CourseDetail.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (user.coursePurchased.some(purchased => purchased.courseId.toString() === courseId.toString())) {
      return res.status(400).json({ success: false, message: "Course already purchased" });
    }

    user.coursePurchased.push({ courseId: course._id, courseName: course.title });
    const updatedUser = await user.save();
    res.status(200).json({ success: true, user: updatedUser, message: "Course added successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});


userRouter.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});


const updateVideoProgress = async (userId, courseId, lessonIndex, chapterIndex) => {
  try {
    const user = await User.findById(userId);
    
   
    let courseProgress = user.courseProgress.find(cp => cp.courseId.equals(courseId));
    if (!courseProgress) {
      courseProgress = {
        courseId: courseId,
        lessons: []
      };
      user.courseProgress.push(courseProgress);
    }
    
  
    let lessonProgress = courseProgress.lessons.find(lesson => lesson.lessonId === lessonIndex);
    if (!lessonProgress) {
      lessonProgress = {
        lessonId: lessonIndex,
        chapters: []
      };
      courseProgress.lessons.push(lessonProgress);
    }
    
    
    let chapterProgress = lessonProgress.chapters.find(chapter => chapter.chapterId === chapterIndex);
    if (!chapterProgress) {
      chapterProgress = {
        chapterId: chapterIndex,
        watched: true
      };
      lessonProgress.chapters.push(chapterProgress);
    } else {
      chapterProgress.watched = true;
    }
    
    await user.save();
    return user;
  } catch (error) {
    console.error('Error updating video progress:', error);
    throw error;
  }
};

const calculateCompletionPercentage = async (userId, courseId) => {
  try {
    const user = await User.findById(userId).populate('courseProgress.courseId');
    
    const courseProgress = user.courseProgress.find(cp => cp.courseId.equals(courseId));
    if (!courseProgress) {
      return { percentage: 0, lessons: [] };
    }

    const courseDetail = await CourseDetail.findById(courseId);
    const totalLessons = courseDetail.lessons.length;

    let totalWatchedLessons = 0;
    const lessonProgresses = courseProgress.lessons.map(lp => {
      const lessonDetail = courseDetail.lessons[lp.lessonId];
      const totalChapters = lessonDetail.chapter.length;

      let watchedChapters = lp.chapters.filter(ch => ch.watched).length;
      let lessonPercentage = (watchedChapters / totalChapters) * 100;

      if (lessonPercentage === 100) {
        totalWatchedLessons++;
      }

      return {
        lessonId: lp.lessonId,
        percentage: lessonPercentage,
        chapters: lp.chapters
      };
    });

    const overallPercentage = (totalWatchedLessons / totalLessons) * 100;

    return {
      percentage: overallPercentage,
      lessons: lessonProgresses
    };
  } catch (error) {
    console.error('Error calculating completion percentage:', error);
    throw error;
  }
};


userRouter.post('/progress/update', async (req, res) => {
  const { userId, courseId, lessonIndex, chapterIndex } = req.body;
  try {
    const user = await updateVideoProgress(userId, courseId, lessonIndex, chapterIndex);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating video progress', error });
  }
});


userRouter.get('/progress/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const progress = await calculateCompletionPercentage(userId, courseId);
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user progress', error });
  }
});


userRouter.get('/fetchela', async (req, res) => {
  try {
    const ela = await ELA.findOne();  // Assuming ELA is another model
    res.json(ela);
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

userRouter.get('/check', async (req, res) => {
  try {
    if (!req.query.email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }
    console.log(req.query.email);
    const user = await User.findOne({ email: req.query.email });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
    console.log(req.query.email)
    console.log("route --- check")
  } catch (err) {
    console.error('Error in /check route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  console.log("Check")
});

userRouter.post('/checks', async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({ exists: true, message: 'Email already exists in the database' });
    } else {
      return res.status(200).json({ exists: false, message: 'Email is available' });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



userRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, linkedin, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = new User({
      name,
      email,
      linkedIn: linkedin,
      password,
      type: 'user',
      firstLogin: true,
      elaComplete: false,
    });

    // Save the user
    await newUser.save();
    res.json({ message: 'Signup successful', user: newUser });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const userData = user.toObject();
    delete userData.password;
    res.json({ message: 'Login successful', user: userData });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = userRouter;
