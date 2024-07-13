const { Router } = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const CourseDetail = require('../models/CourseDetails.model'); 

const userRouter = Router();

// Multer setup for file uploads
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

// Get user by ID
userRouter.get('/:id', async (req, res) => {
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

// Add a new user
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

// Update an existing user
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

// Add a course to user
userRouter.put('/updatecourse/:id', async (req, res) => {
  try {
    const { courseId } = req.body;
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

// Delete a user
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

module.exports = userRouter;
