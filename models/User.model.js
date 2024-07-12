const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const TestScoreSchema = new mongoose.Schema({
  courseId: mongoose.Schema.Types.ObjectId,
  lessonId: Number,
  score: Number,
  isCompleted: Boolean
}, { _id: false });

const EmergencyContactSchema = mongoose.Schema({
  name: {
    type: String,
    required: [false, 'Emergency contact name required']
  },
  relationship: {
    type: String,
    required: [false, 'Emergency contact relationship required']
  },
  phone: {
    type: String,
    required: [false, 'Emergency contact phone required']
  },
  address: {
    type: String,
    required: [false, 'Emergency contact address required']
  }
}, { _id: false });

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name field required']
    },
    email: {
      type: String,
      required: [true, 'Email field required']
    },
    phoneNumber: {
      type: String,
      required: [false, 'Phone number field required']
    },
    password: {
      type: String,
      required: [false, 'Password field required'],
      select: false 
    },
    linkedIn: {
      type: String,
      required: [false, 'LinkedIn field required']
    },
    bio: {
      type: String,
      required: [false, 'Bio field required']
    },
    coursePurchased: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseDetail'
    }],
    idCard: {
      type: String,
      required: [false, 'ID card field required']
    },
    address: {
      type: String,
      required: [false, 'Address field required']
    },
    testScore: {
      type: Number,
      required: [false, 'Test score field required']
    },
    companyname: {
      type: String,
      required: [false, 'Company name field required']
    },
    position: {
      type: String,
      required: [false, 'Position field required']
    },
    relationship: {
      type: String,
      required: [false, 'Relationship field required']
    },
    gender: {
      type: String,
      required: [false, 'Gender field required']
    },
    profilePic: {
      type: String,
      required: [false, 'Profile picture field required']
    },
    profileBanner: {
      type: String,
      required: [false, 'Profile banner field required']
    },
    testScores: [TestScoreSchema],
    emergencyContact: EmergencyContactSchema,
    socialMediaId: {
      type: String,
      required: [false, 'Social media ID required'],
      unique: true,
      sparse: true 
    }
  },
  { timestamps: true }
);

// Hash the password 
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
