const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
 

const connectionString = "mongodb+srv://sarandatabase:saran%40143@mycluster.zm3yrdt.mongodb.net/demo?retryWrites=true&w=majority&appName=MyCluster";
const app = express();

// Enable CORS
app.use(cors());

// Models
const Contact = require('./models/Contact.model');
const CourseList = require('./models/CourseList.model');

// Routers
const contactRouter = require('./routes/Contact.router');
const courseListRouter = require('./routes/CourseList.router');
const courseDetailsRouter = require('./routes/CourseDetails.router');
const userRouter = require('./routes/User.router');
const questionsRouter = require('./routes/Question.router');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Use routers
app.use('/api/contact', contactRouter);
app.use('/api/courseList', courseListRouter);
app.use('/api/courseDetail', courseDetailsRouter);
app.use('/api/user', userRouter);
app.use('/api/questions', questionsRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Db connection
mongoose.connect(connectionString, {})
  .then(() => {
    app.listen(5000, () => {
      console.log("Db connected - Listening port 5000");
    });
  })
  .catch((e) => {
    console.log(e);
  });
