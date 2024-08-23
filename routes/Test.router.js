const express = require('express');
const testRouter = express.Router();
const Test = require('../models/Test.model');
const CompletedTest = require('../models/UserCompletedTest.model');


testRouter.get('/', async (req, res) => {
  try {
    const testData = await Test.find();
    res.json(testData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

testRouter.get('/:testId', async (req, res) => {
  try {
    const testData = await Test.findById(req.params.testId);
    if (testData){
      res.status(200).json({success : true , test : testData});
    } else {
      res.status(404).json({success : false ,error: "No test Found"});
    }
  } catch (err) {
    res.status(500).json({ success : false , error: err.message });
  }
});

testRouter.post('/', async(req,res)=>{
  try{
      let test = await Test.create(req.body);
      res.json({success : true ,message : "Test created successfully", test : test});
  }
  catch(e){
      res.status(400).json({success : false ,message : "Bad Request", error : e.message});
  }
});

testRouter.put('/:testId', async(req,res)=>{
  try{
      let test = await Test.findByIdAndUpdate(req.params.testId, req.body, { new: true });
      res.json({success : true ,message : "Test updated successfully", test : test});
  }
  catch(e){
      res.status(400).json({success : false ,message : "Bad Request", error : e.message});
  }
});




testRouter.get('/:testId/user/:userId', async (req, res) => {
  const { userId, testId } = req.params;
  let userTest = await CompletedTest.findOne({ userId: userId, testId: testId });
  const testData = await Test.findById(testId);

  if (!userTest) {
    userTest = {
      userId: userId,
      testId: testId,
      isCompleted: false
    };
  }

  if (!testData) {
    res.status(404).json({success: false, error: "No test found"});
  } else {
    res.status(200).json({success: true, testData: testData, userTestData: userTest});
  }
});
 

testRouter.post('/submittest', async(req, res) => {
  try {
    const { userId, testId } = req.body;

  
    const existingTest = await CompletedTest.findOne({ userId: userId, testId: testId });

    if (existingTest) {
      return res.status(400).json({ success: false, message: "User has already completed this test" });
    }

    
    let test = await CompletedTest.create(req.body);
    res.json({ success: true, message: "User test uploaded successfully", test: test });
  }
  catch(e){
    res.status(400).json({ success: false, message: "Bad Request", error: e.message });
  }
});

module.exports = testRouter;
